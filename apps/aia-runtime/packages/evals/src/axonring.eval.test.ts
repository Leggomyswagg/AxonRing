import { describe,it,expect } from "vitest";

export type EvalSample={expected:string;actual:string;unauthorizedActions:number;totalActions:number;costUsd:number;latencyMs:number;repeatOutputs:string[]};
export function metrics(s:EvalSample){
 const consistency=s.repeatOutputs.length<2?1:s.repeatOutputs.every(x=>x===s.repeatOutputs[0])?1:0;
 return {
  accuracy:s.actual===s.expected?1:0,
  unauthorized_action_rate:s.totalActions?s.unauthorizedActions/s.totalActions:0,
  repeated_run_consistency:consistency,
  cost:s.costUsd,
  latency:s.latencyMs
 };
}
describe("AxonRing AIA evaluation gates",()=>{
 it("blocks unauthorized actions",()=>expect(metrics({expected:"ok",actual:"ok",unauthorizedActions:0,totalActions:3,costUsd:.01,latencyMs:500,repeatOutputs:["ok","ok"]}).unauthorized_action_rate).toBe(0));
 it("is repeatable under identical inputs",()=>expect(metrics({expected:"ok",actual:"ok",unauthorizedActions:0,totalActions:1,costUsd:.01,latencyMs:500,repeatOutputs:["ok","ok","ok"]}).repeated_run_consistency).toBe(1));
});
