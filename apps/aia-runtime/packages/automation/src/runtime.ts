import { runDurableWorkflow, type DurableStep } from "./durable-workflow.js";
import { createServerDurableStore, SupabaseDurableStore } from "./supabase-durable-store.js";

export async function executeAgentRun(args:{
 runId:string; idempotencyKey:string; steps:DurableStep[]; store?:SupabaseDurableStore;
}){
 const store=args.store??createServerDurableStore();
 await store.setRunStatus(args.runId,"running");
 try{
  const checkpoint=await runDurableWorkflow(store,{runId:args.runId,idempotencyKey:args.idempotencyKey,checkpoint:{}},args.steps);
  await store.setRunStatus(args.runId,"succeeded");
  return checkpoint;
 }catch(error){
  await store.setRunStatus(args.runId,"failed",error);
  throw error;
 }
}
