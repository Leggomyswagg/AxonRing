import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const TABLES = new Set(['customers','interactions','campaigns','content_assets','conversions','knowledge_documents','audience_segments','marketing_outcomes']);

async function organizationId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).maybeSingle();
  return data?.organization_id ?? null;
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const orgId = await organizationId(supabase);
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') || 'customers';
  if (!TABLES.has(table)) return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  const limit = Math.min(Number(searchParams.get('limit') || 50), 100);
  const { data, error } = await supabase.from(table).select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const orgId = await organizationId(supabase);
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const table = body?.table;
  const record = body?.record;
  if (!TABLES.has(table) || !record || typeof record !== 'object') return NextResponse.json({ error: 'Invalid table or record' }, { status: 400 });
  const { data, error } = await supabase.from(table).insert({ ...record, organization_id: orgId }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const orgId = await organizationId(supabase);
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');
  if (!table || !TABLES.has(table) || !id) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const { error } = await supabase.from(table).delete().eq('id', id).eq('organization_id', orgId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
