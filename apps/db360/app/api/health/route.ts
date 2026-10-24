import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('organizations').select('id').limit(1);
  return NextResponse.json({ app: 'ok', database: error ? 'error' : 'ok', timestamp: new Date().toISOString() }, { status: error ? 503 : 200 });
}
