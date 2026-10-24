import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const resources = {
  customers: { table: 'customers', select: 'id,external_id,email,first_name,last_name,status,source,lifetime_value,acquisition_cost,first_seen_at,last_seen_at,created_at' },
  campaigns: { table: 'campaigns', select: 'id,name,objective,status,start_at,end_at,budget,created_at,updated_at' },
  content: { table: 'content_assets', select: 'id,title,content_type,platform,status,body,published_at,created_at,updated_at' },
  outcomes: { table: 'marketing_outcomes', select: 'id,name,outcome_type,target_value,current_value,target_date,status,created_at,updated_at' },
  audiences: { table: 'audience_segments', select: 'id,name,description,criteria,estimated_size,created_at,updated_at' },
} as const;

type Resource = keyof typeof resources;

async function context(resource: string) {
  const config = resources[resource as Resource];
  if (!config) return { error: NextResponse.json({ error: 'Unsupported resource' }, { status: 404 }) };
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id,role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) return { error: NextResponse.json({ error: 'Organization required' }, { status: 403 }) };
  return { supabase, user, membership, config };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if ('error' in ctx) return ctx.error;
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 50), 100);

  // The resource table is selected from a closed, validated allow-list above.
  // Cast only this dynamic query to avoid Supabase's generated union becoming too complex for TypeScript.
  const db = ctx.supabase as any;
  const { data, error } = await db
    .from(ctx.config.table)
    .select(ctx.config.select)
    .eq('organization_id', ctx.membership.organization_id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if ('error' in ctx) return ctx.error;
  const body = await request.json();
  const allowed = Object.fromEntries(
    Object.entries(body).filter(([key]) => !['id', 'organization_id', 'created_at', 'updated_at'].includes(key)),
  );
  const db = ctx.supabase as any;
  const { data, error } = await db
    .from(ctx.config.table)
    .insert({ ...allowed, organization_id: ctx.membership.organization_id })
    .select(ctx.config.select)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if ('error' in ctx) return ctx.error;
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete updates.organization_id;
  delete updates.created_at;
  delete updates.updated_at;
  const db = ctx.supabase as any;
  const { data, error } = await db
    .from(ctx.config.table)
    .update(updates)
    .eq('id', id)
    .eq('organization_id', ctx.membership.organization_id)
    .select(ctx.config.select)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if ('error' in ctx) return ctx.error;
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const db = ctx.supabase as any;
  const { error } = await db
    .from(ctx.config.table)
    .delete()
    .eq('id', id)
    .eq('organization_id', ctx.membership.organization_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
