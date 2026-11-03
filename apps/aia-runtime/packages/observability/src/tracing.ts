import { trace, SpanStatusCode } from "@opentelemetry/api";
const tracer=trace.getTracer("axonring-aia");

function safe(attrs:Record<string,unknown>){
  // Never attach prompts, API keys, auth headers, tokens, or service-role credentials to spans.
  return Object.fromEntries(Object.entries(attrs).filter(([k])=>!/prompt|secret|token|authorization|api.?key|service.?role/i.test(k)));
}

export async function tracedCall<T>(kind:"model"|"tool", name:string, fn:()=>Promise<T>, attrs:Record<string,unknown>={}):Promise<T>{
  return tracer.startActiveSpan(`aia.${kind}.${name}`, async span=>{
    const started=performance.now();
    try{
      span.setAttributes(safe({"aia.call.kind":kind,"aia.call.name":name,...attrs}) as any);
      const out=await fn();
      span.setAttribute("aia.latency_ms",Math.round(performance.now()-started));
      span.setStatus({code:SpanStatusCode.OK});
      return out;
    }catch(e:any){
      span.recordException(e);
      span.setStatus({code:SpanStatusCode.ERROR,message:e?.message});
      throw e;
    }finally{span.end();}
  });
}
