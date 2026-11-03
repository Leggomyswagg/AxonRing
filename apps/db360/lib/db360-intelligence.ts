import { SupabaseClient } from '@supabase/supabase-js';

export type IntelligenceResult = {
  metrics: Record<string, number>;
  recommendations: Array<{ priority: string; action: string; reason: string }>;
};

export async function generateDB360Intelligence(supabase: SupabaseClient): Promise<IntelligenceResult> {
  const { data, error } = await supabase.functions.invoke('db360-intelligence');
  if (error) throw error;
  return data as IntelligenceResult;
}
