import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DB360_PROFILES,
  getChannelPerformance,
  getFunnelTotals,
  getSegmentBreakdown,
  getTopContent,
} from '@/data/db360';

const STAGE_LABELS: Record<string, string> = {
  lead: 'Lead', 'first-time': 'First-Time', repeat: 'Repeat', vip: 'VIP', lapsed: 'Lapsed',
};

export default function Overview() {
  const funnel = getFunnelTotals();
  const segments = getSegmentBreakdown();
  const channels = getChannelPerformance().sort((a, b) => b.avgLTV - a.avgLTV);
  const topContent = getTopContent(5);

  const totalLTV = DB360_PROFILES.reduce((s, p) => s + p.lifetimeValue, 0);
  const avgEngagement = Math.round(DB360_PROFILES.reduce((s, p) => s + p.engagementScore, 0) / DB360_PROFILES.length);
  const conversionRate = Math.round((funnel.find(f => f.stage === 'Converted')!.count / funnel[0].count) * 1000) / 10;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Growth Overview</h1>
        <p className="text-zinc-500 mt-1">Live read on the DB 360 audience, content performance, and funnel health.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tracked Profiles', value: DB360_PROFILES.length.toLocaleString() },
          { label: 'Avg. Engagement Score', value: `${avgEngagement}/100` },
          { label: 'Awareness → Conversion', value: `${conversionRate}%` },
          { label: 'Total Attributed LTV', value: `$${totalLTV.toLocaleString()}` },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Content-to-Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="stage" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="count" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Segment breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Lifecycle Segments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {segments.map(s => {
              const pct = Math.round((s.count / DB360_PROFILES.length) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">{STAGE_LABELS[s.stage]}</span>
                    <span className="text-zinc-500">{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel performance */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Acquisition Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {channels.map(c => (
                <div key={c.channel} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                  <span className="text-sm text-zinc-300 capitalize">{c.channel.replace(/-/g, ' ')}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-500">{c.count} profiles</span>
                    <span className="text-zinc-400">{c.conversionRate}% conv.</span>
                    <span className="text-white font-semibold">${c.avgLTV} LTV</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top content */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Top Converting Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContent.map(c => (
                <div key={c.id} className="flex items-start justify-between gap-3 py-2 border-b border-zinc-800/60 last:border-0">
                  <div>
                    <p className="text-sm text-zinc-200 leading-snug">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] capitalize">{c.channel}</Badge>
                      <Badge variant="info" className="text-[10px] capitalize">{c.funnelStage}</Badge>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-rose-400 whitespace-nowrap">{c.conversions} conv.</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
