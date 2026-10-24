import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient<any> | undefined;

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('DB360 requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  browserClient ??= createClient<any>(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
