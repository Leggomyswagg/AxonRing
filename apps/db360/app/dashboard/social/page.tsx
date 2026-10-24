import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function SocialAnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(id,name)')
    .eq('user_id', user.id)
    .limit(1);
  const member = members?.[0];
  if (!member) redirect('/onboarding');
  const orgId = member.organization_id;

  const [posts, postMetrics, campaignMetrics, attribution, accounts] = await Promise.all([
    supabase.from('social_posts').select('id,post_type,is_paid,published_at,social_accounts(account_name,social_platforms(name)),campaigns(name)').eq('organization_id', orgId).order('published_at', { ascending: false }).limit(25),
    supabase.from('social_post_metrics').select('impressions,reach,views,likes,comments,shares,saves,clicks,profile_visits,follows,spend,conversions,attributed_revenue').eq('organization_id', orgId),
    supabase.from('social_campaign_metrics').select('spend,impressions,reach,clicks,conversions,attributed_revenue,ctr,cpc,cpm,cpa,roas,social_platforms(name),campaigns(name)').eq('organization_id', orgId),
    supabase.from('social_attribution').select('attribution_type,attributed_value,social_posts(id,external_post_id),campaigns(name)').eq('organization_id', orgId),
    supabase.from('social_accounts').select('id,account_name,status,social_platforms(name)').eq('organization_id', orgId),
  ]);

  const m = postMetrics.data ?? [];
  const totals = m.reduce((a, x) => ({
    impressions: a.impressions + Number(x.impressions || 0), reach: a.reach + Number(x.reach || 0), views: a.views + Number(x.views || 0),
    engagements: a.engagements + Number(x.likes || 0) + Number(x.comments || 0) + Number(x.shares || 0) + Number(x.saves || 0),
    clicks: a.clicks + Number(x.clicks || 0), conversions: a.conversions + Number(x.conversions || 0), spend: a.spend + Number(x.spend || 0), revenue: a.revenue + Number(x.attributed_revenue || 0)
  }), { impressions: 0, reach: 0, views: 0, engagements: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
  const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
  const engagementRate = totals.impressions ? (totals.engagements / totals.impressions) * 100 : 0;
  const roas = totals.spend ? totals.revenue / totals.spend : 0;

  return <main className="shell"><aside className="sidebar"><div className="brand"><span className="mark">A</span><span>AxonRing <b>DB360</b></span></div><nav><a href="/dashboard">Overview</a><a href="/dashboard/intelligence">Outcome Intelligence</a><a href="/dashboard/workbench">Command Workbench</a><a className="active" href="/dashboard/social">Social Analytics</a><a href="#accounts">Connected Accounts</a><a href="#campaigns">Social Campaigns</a></nav></aside><section className="content"><header className="topbar"><div><p className="eyebrow">SOCIAL INTELLIGENCE</p><h1>Social Analytics</h1><p className="sub">Organic and paid social performance connected to campaigns, content and revenue attribution.</p></div><a className="gold-button" href="/dashboard/intelligence">Open Intelligence</a></header><section className="kpi-grid">{[['Impressions',totals.impressions],['Reach',totals.reach],['Engagements',totals.engagements],['Clicks',totals.clicks],['Conversions',totals.conversions],['ROAS',roas.toFixed(2)+'x']].map(([label,value])=><article className="card kpi" key={String(label)}><span>{label}</span><strong>{typeof value === 'number' ? value.toLocaleString() : value}</strong><em>Live social data</em></article>)}</section><section className="hero-grid"><article className="card"><p className="eyebrow">PERFORMANCE</p><h2>{engagementRate.toFixed(2)}% engagement rate</h2><p>{ctr.toFixed(2)}% CTR · ${totals.spend.toLocaleString()} spend · ${totals.revenue.toLocaleString()} attributed revenue.</p><div className="bars"><i style={{height:`${Math.max(8,Math.min(100,engagementRate*10+8))}%`}}/><i style={{height:`${Math.max(8,Math.min(100,ctr*10+8))}%`}}/><i style={{height:`${Math.max(8,Math.min(100,Math.min(100,roas*12+8)))}%`}}/></div></article><article className="card" id="accounts"><p className="eyebrow">CONNECTED ACCOUNTS</p><h2>{accounts.data?.length ?? 0} accounts</h2><p>{(accounts.data ?? []).map((a: any) => `${a.account_name} · ${Array.isArray(a.social_platforms) ? a.social_platforms[0]?.name : a.social_platforms?.name} · ${a.status}`).join(' | ') || 'No social accounts connected yet.'}</p></article></section><section className="card" id="campaigns"><p className="eyebrow">RECENT POSTS</p><h2>Post-level campaign usage</h2><div className="table-wrap"><table><thead><tr><th>Post</th><th>Platform</th><th>Campaign</th><th>Type</th><th>Paid</th></tr></thead><tbody>{(posts.data ?? []).map((p: any)=><tr key={p.id}><td>{p.external_post_id || p.post_type || 'Unidentified post'}</td><td>{Array.isArray(p.social_accounts) ? p.social_accounts[0]?.social_platforms?.name : p.social_accounts?.social_platforms?.name}</td><td>{Array.isArray(p.campaigns) ? p.campaigns[0]?.name : p.campaigns?.name || '—'}</td><td>{p.post_type || '—'}</td><td>{p.is_paid ? 'Paid' : 'Organic'}</td></tr>)}</tbody></table></div><p className="sub">Attribution records available: {attribution.data?.length ?? 0}. Campaign metric rows: {campaignMetrics.data?.length ?? 0}.</p></section></section></main>;
}
