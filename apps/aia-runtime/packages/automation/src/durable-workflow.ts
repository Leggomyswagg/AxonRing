export type StepStatus = "pending"|"running"|"succeeded"|"failed"|"skipped"|"compensating"|"compensated";

export interface DurableStore {
  loadCheckpoint(runId:string): Promise<Record<string,unknown>>;
  saveCheckpoint(runId:string, checkpoint:Record<string,unknown>): Promise<void>;
  claimStep(runId:string, stepKey:string, idempotencyKey:string): Promise<"execute"|"already_succeeded">;
  completeStep(runId:string, stepKey:string, output:unknown): Promise<void>;
  failStep(runId:string, stepKey:string, error:unknown): Promise<void>;
}

export interface DurableStep<T=unknown> {
  key:string;
  maxAttempts?:number; // hard-capped at 5
  execute(ctx:WorkflowContext):Promise<T>;
  compensate?(ctx:WorkflowContext, output:T):Promise<void>;
}

export interface WorkflowContext {
  runId:string;
  idempotencyKey:string;
  checkpoint:Record<string,unknown>;
}

const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const retryable=(e:any)=>e?.retryable===true || e?.status===429 || (e?.status>=500 && e?.status<600);

export async function runDurableWorkflow(store:DurableStore, ctx:WorkflowContext, steps:DurableStep[]) {
  ctx.checkpoint=await store.loadCheckpoint(ctx.runId);
  const completed:Array<{step:DurableStep; output:unknown}>=[];

  try {
    for (const step of steps) {
      const stepIdempotency=`${ctx.idempotencyKey}:${step.key}`;
      if (await store.claimStep(ctx.runId,step.key,stepIdempotency)==="already_succeeded") continue;
      const max=Math.min(Math.max(step.maxAttempts??3,1),5);
      let output:unknown;
      for(let attempt=1; attempt<=max; attempt++){
        try { output=await step.execute(ctx); break; }
        catch(e){ if(attempt===max || !retryable(e)){ await store.failStep(ctx.runId,step.key,e); throw e; } await sleep(Math.min(250*2**(attempt-1),4000)); }
      }
      await store.completeStep(ctx.runId,step.key,output);
      ctx.checkpoint[step.key]=output;
      await store.saveCheckpoint(ctx.runId,ctx.checkpoint);
      completed.push({step,output});
    }
    return ctx.checkpoint;
  } catch(error) {
    for(const {step,output} of completed.reverse()){
      if(!step.compensate) continue;
      try { await step.compensate(ctx,output); } catch { /* record separately; never mask root failure */ }
    }
    throw error;
  }
}
