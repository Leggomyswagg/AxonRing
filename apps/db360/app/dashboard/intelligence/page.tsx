import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function IntelligencePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: members } = await supabase.from('organization_members').select('organization_id,role,organizations(name)').eq('user_id', user.id).limit(1);
  const member = members?.[0];
  if (!member) redirect('/onboarding');
  const orgId = member.organization_id;

  const [customers, interactions, conversions, campaigns, content, outcomes, segments] = await Promise.all([
    supabase.from('customers').select('id,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('interactions').select('id,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('conversions').select('id,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('campaigns').select('id,status,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('content_assets').select('id,status,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('marketing_outcomes').select('id,status,target_value,current_value,created_at', { count: 'exact' }).eq('organization_id', orgId),
    supabase.from('audience_segments').select('id,name,created_at', { count: 'exact' }).eq('organization_id', orgId),
  ]);

  const customerCount = customers.count ?? 0;
  const interactionCount = interactions.count ?? 0;
  const conversionCount = conversions.count ?? 0;
  const campaignCount = campaigns.count ?? 0;
  const contentCount = content.count ?? 0;
  const outcomeCount = outcomes.count ?? 0;
  const segmentCount = segments.count ?? 0;
  const engagementPerCustomer = customerCount ? interactionCount / customerCount : 0;
  const conversionRate = interactionCount ? (conversionCount / interactionCount) * 100 : 0;

  const recommendations = [
    customerCount === 0 ? 'Load your first customer records to activate Customer360 intelligence.' : `Customer engagement averages ${engagementPerCustomer.toFixed(1)} interactions per customer. Prioritize segments with the strongest interaction density.`,
    campaignCount === 0 ? 'Create the first campaign and attach a measurable marketing outcome.' : 'Rank campaigns by conversion contribution and shift budget toward the highest outcome efficiency.',
    contentCount === 0 ? 'Create a content asset and connect it to a campaign to establish content-to-outcome attribution.' : 'Score content by engagement and conversion contribution before expanding production volume.',
    segmentCount === 0 ? 'Create audience segments so campaigns can be evaluated by audience rather than only aggregate performance.' : 'Compare segment conversion rates and build next-best-action audiences from the highest-performing cohorts.',
  ];

  return <main className="shell"><aside className="sidebar"><div className="brand"><span className="mark">A</span><span>AxonRing <b>DB360</b></span></div><nav><a href="/dashboard">Overview</a><a className="active" href="/dashboard/intelligence">Intelligence</a><a href="/dashboard/workbench">Command Workbench</a></nav><div className="side-note"><span>Intelligence Layer</span><strong>LIVE</strong></div></aside><section className="content"><header className="topbar"><div><p className="eyebrow">DB360 INTELLIGENCE</p><h1>Outcome Intelligence</h1><p className="sub">Translate operational marketing data into measurable next-best actions.</p></div><a className="gold-button" href="/dashboard/workbench">Open Workbench</a></header><section className="kpi-grid">{[['Customers',customerCount],['Interactions',interactionCount],['Conversions',conversionCount],['Campaigns',campaignCount],['Content',contentCount],['Outcomes',outcomeCount],['Segments',segmentCount],['Conversion Rate',`${conversionRate.toFixed(1)}%`]].map(([label,value])=><article className="card kpi" key={String(label)}><span>{label}</span><strong>{String(value)}</strong><em>Live DB360</em></article>)}</section><section className="hero-grid"><article className="card insight"><p className="eyebrow">NEXT-BEST ACTIONS</p><h2>Growth priorities</h2>{recommendations.map((r,i)=><div key={i} className="recommendation"><b>{String(i+1).padStart(2,'0')}</b><p>{r}</p></div>)}</article><article className="card ai"><p className="eyebrow">OUTCOME ENGINE</p><h2>{conversionRate > 0 ? `${conversionRate.toFixed(1)}% interaction-to-conversion rate` : 'Awaiting conversion signals'}</h2><p>DB360 continuously evaluates customers, engagement, campaigns, content, audiences, and outcomes to identify where attention and budget should move next.</p><a className="gold-button" href="/dashboard/workbench">Create Data</a></article></section></section></main>;
}
