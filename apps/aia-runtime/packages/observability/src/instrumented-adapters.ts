import { tracedCall } from "./tracing.js";

export type PersistToolCall = (row:{
 runId:string; stepId?:string; toolName:string; idempotencyKey:string;
 authorized:boolean; request:unknown; response?:unknown; latencyMs:number;
 costUsd?:number; error?:unknown;
})=>Promise<void>;

export async function executeTool<T>(args:{
 runId:string; stepId?:string; toolName:string; idempotencyKey:string;
 authorized:boolean; input:unknown; persist:PersistToolCall; call:()=>Promise<T>;
}):Promise<T>{
 if(!args.authorized) throw Object.assign(new Error("Tool action is not authorized"),{code:"UNAUTHORIZED_ACTION"});
 const started=performance.now();
 try{
   const response=await tracedCall("tool",args.toolName,args.call,{run_id:args.runId,step_id:args.stepId??"",idempotency_key:args.idempotencyKey});
   await args.persist({runId:args.runId,stepId:args.stepId,toolName:args.toolName,idempotencyKey:args.idempotencyKey,authorized:true,request:args.input,response,latencyMs:Math.round(performance.now()-started)});
   return response;
 }catch(error){
   await args.persist({runId:args.runId,stepId:args.stepId,toolName:args.toolName,idempotencyKey:args.idempotencyKey,authorized:true,request:args.input,latencyMs:Math.round(performance.now()-started),error});
   throw error;
 }
}

export async function executeModel<T>(args:{
 model:string; runId:string; stepId?:string; estimatedCostUsd?:number; call:()=>Promise<T>;
}):Promise<T>{
 return tracedCall("model",args.model,args.call,{run_id:args.runId,step_id:args.stepId??"",estimated_cost_usd:args.estimatedCostUsd??0});
}
