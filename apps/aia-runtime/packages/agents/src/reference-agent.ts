import type { DurableStep } from "../../automation/src/durable-workflow.js";
import { executeAgentRun } from "../../automation/src/runtime.js";
import { executeModel, executeTool, type PersistToolCall } from "../../observability/src/instrumented-adapters.js";
import type { SupabaseDurableStore } from "../../automation/src/supabase-durable-store.js";

export interface ApprovalGate {
  requireApproval(args:{runId:string; action:string; actionDigest:string}):Promise<boolean>;
}

export interface ReferenceAgentDeps {
  store:SupabaseDurableStore;
  persistToolCall:PersistToolCall;
  approvals:ApprovalGate;
  model:(input:string)=>Promise<string>;
  publish:(content:string)=>Promise<{id:string}>;
}

export async function runReferenceAgent(args:{
  runId:string;
  idempotencyKey:string;
  prompt:string;
  actionDigest:string;
  deps:ReferenceAgentDeps;
}){
  const steps:DurableStep[]=[
    {
      key:"draft",
      async execute(){
        return executeModel({
          model:"reference-model",
          runId:args.runId,
          call:()=>args.deps.model(args.prompt)
        });
      }
    },
    {
      key:"publish",
      maxAttempts:3,
      async execute(ctx){
        const approved=await args.deps.approvals.requireApproval({
          runId:args.runId,
          action:"publish",
          actionDigest:args.actionDigest
        });
        if(!approved) throw Object.assign(new Error("Persisted approval required"),{code:"APPROVAL_REQUIRED"});
        const content=String(ctx.checkpoint.draft??"");
        return executeTool({
          runId:args.runId,
          toolName:"reference.publish",
          idempotencyKey:`${args.idempotencyKey}:publish`,
          authorized:true,
          input:{content},
          persist:args.deps.persistToolCall,
          call:()=>args.deps.publish(content)
        });
      }
    }
  ];
  return executeAgentRun({runId:args.runId,idempotencyKey:args.idempotencyKey,steps,store:args.deps.store});
}
