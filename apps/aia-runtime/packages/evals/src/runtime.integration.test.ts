import { describe,it,expect } from "vitest";
import { runDurableWorkflow, type DurableStore, type DurableStep } from "../../automation/src/durable-workflow.js";
import { executeTool } from "../../observability/src/instrumented-adapters.js";

class MemoryStore implements DurableStore {
  checkpoint:Record<string,unknown>={};
  status=new Map<string,string>();
  claims=new Set<string>();
  failures:string[]=[];
  async loadCheckpoint(){ return {...this.checkpoint}; }
  async saveCheckpoint(_runId:string,checkpoint:Record<string,unknown>){ this.checkpoint={...checkpoint}; }
  async claimStep(_runId:string,stepKey:string){
    if(this.status.get(stepKey)==="succeeded") return "already_succeeded" as const;
    this.claims.add(stepKey); return "execute" as const;
  }
  async completeStep(_runId:string,stepKey:string){ this.status.set(stepKey,"succeeded"); }
  async failStep(_runId:string,stepKey:string){ this.status.set(stepKey,"failed"); this.failures.push(stepKey); }
}

describe("M2 durable runtime integration",()=>{
  it("retries transient failures within the bounded policy",async()=>{
    const store=new MemoryStore(); let attempts=0;
    const steps:DurableStep[]=[{key:"retry",maxAttempts:3,async execute(){
      attempts++; if(attempts<3) throw Object.assign(new Error("transient"),{status:503}); return "ok";
    }}];
    const out=await runDurableWorkflow(store,{runId:"r1",idempotencyKey:"i1",checkpoint:{}},steps);
    expect(attempts).toBe(3); expect(out.retry).toBe("ok");
  });

  it("does not repeat a succeeded step on replay",async()=>{
    const store=new MemoryStore(); let calls=0;
    const steps:DurableStep[]=[{key:"once",async execute(){calls++; return "done";}}];
    await runDurableWorkflow(store,{runId:"r2",idempotencyKey:"i2",checkpoint:{}},steps);
    await runDurableWorkflow(store,{runId:"r2",idempotencyKey:"i2",checkpoint:{}},steps);
    expect(calls).toBe(1);
  });

  it("compensates completed work in reverse order",async()=>{
    const store=new MemoryStore(); const events:string[]=[];
    const steps:DurableStep[]=[
      {key:"a",async execute(){events.push("a");return "a";},async compensate(){events.push("undo-a");}},
      {key:"b",async execute(){events.push("b");return "b";},async compensate(){events.push("undo-b");}},
      {key:"c",async execute(){throw new Error("fatal");}}
    ];
    await expect(runDurableWorkflow(store,{runId:"r3",idempotencyKey:"i3",checkpoint:{}},steps)).rejects.toThrow("fatal");
    expect(events).toEqual(["a","b","undo-b","undo-a"]);
  });

  it("blocks unauthorized tool execution before side effects",async()=>{
    let called=false; let persisted=false;
    await expect(executeTool({
      runId:"r4",toolName:"dangerous",idempotencyKey:"i4",authorized:false,input:{},
      persist:async()=>{persisted=true;},
      call:async()=>{called=true; return "bad";}
    })).rejects.toMatchObject({code:"UNAUTHORIZED_ACTION"});
    expect(called).toBe(false); expect(persisted).toBe(false);
  });
});
