import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { DurableStore } from "./durable-workflow.js";

function serializeError(error:unknown){
 if(error instanceof Error) return {name:error.name,message:error.message,stack:error.stack};
 return {message:String(error)};
}

export class SupabaseDurableStore implements DurableStore {
 constructor(private db:SupabaseClient){}
 async loadCheckpoint(runId:string){
  const {data,error}=await this.db.from("agent_runs").select("checkpoint").eq("id",runId).single();
  if(error) throw error; return (data?.checkpoint??{}) as Record<string,unknown>;
 }
 async saveCheckpoint(runId:string,checkpoint:Record<string,unknown>){
  const {error}=await this.db.from("agent_runs").update({checkpoint,updated_at:new Date().toISOString()}).eq("id",runId);
  if(error) throw error;
 }
 async claimStep(runId:string,stepKey:string,idempotencyKey:string):Promise<"execute"|"already_succeeded">{
  const {data:existing,error:readError}=await this.db.from("agent_steps").select("status").eq("run_id",runId).eq("step_key",stepKey).maybeSingle();
  if(readError) throw readError;
  if(existing?.status==="succeeded") return "already_succeeded";
  if(existing){
   const {error}=await this.db.from("agent_steps").update({status:"running",started_at:new Date().toISOString()}).eq("run_id",runId).eq("step_key",stepKey);
   if(error) throw error; return "execute";
  }
  const {error}=await this.db.from("agent_steps").insert({run_id:runId,step_key:stepKey,idempotency_key:idempotencyKey,status:"running",started_at:new Date().toISOString()});
  if(error?.code==="23505") return this.claimStep(runId,stepKey,idempotencyKey);
  if(error) throw error; return "execute";
 }
 async completeStep(runId:string,stepKey:string,output:unknown){
  const {error}=await this.db.from("agent_steps").update({status:"succeeded",output,completed_at:new Date().toISOString()}).eq("run_id",runId).eq("step_key",stepKey); if(error) throw error;
 }
 async failStep(runId:string,stepKey:string,errorValue:unknown){
  const {error}=await this.db.from("agent_steps").update({status:"failed",error:serializeError(errorValue),completed_at:new Date().toISOString()}).eq("run_id",runId).eq("step_key",stepKey); if(error) throw error;
 }
 async setRunStatus(runId:string,status:string,errorValue?:unknown){
  const patch:any={status,updated_at:new Date().toISOString()};
  if(status==="running") patch.started_at=new Date().toISOString();
  if(["succeeded","failed","compensated","cancelled"].includes(status)) patch.completed_at=new Date().toISOString();
  if(errorValue) patch.error=serializeError(errorValue);
  const {error}=await this.db.from("agent_runs").update(patch).eq("id",runId); if(error) throw error;
 }
 async persistToolCall(row:any){
  const {error}=await this.db.from("tool_calls").upsert({
   run_id:row.runId,step_id:row.stepId??null,tool_name:row.toolName,idempotency_key:row.idempotencyKey,
   authorized:row.authorized,request:row.request??{},response:row.response??null,latency_ms:row.latencyMs,cost_usd:row.costUsd??null,
   error:row.error?serializeError(row.error):null
  },{onConflict:"run_id,idempotency_key"}); if(error) throw error;
 }
}

export function createServerDurableStore(){
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) throw new Error("Server Supabase credentials are not configured");
 if(typeof window!=="undefined") throw new Error("Service-role runtime cannot execute in a browser");
 return new SupabaseDurableStore(createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}));
}
