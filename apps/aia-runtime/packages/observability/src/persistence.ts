import type { SupabaseDurableStore } from "../../automation/src/supabase-durable-store.js";
export function toolCallPersister(store:SupabaseDurableStore){
 return (row:any)=>store.persistToolCall(row);
}
