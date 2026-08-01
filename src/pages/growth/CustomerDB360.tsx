import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DB360_PROFILES, type CustomerProfile360, type LifecycleStage } from '@/data/db360';
import { getProduct } from '@/data/catalog';

const STAGE_BADGE: Record<LifecycleStage, 'default' | 'secondary' | 'success' | 'warning' | 'info'> = {
  lead: 'secondary',
  'first-time': 'info',
  repeat: 'default',
  vip: 'success',
  lapsed: 'warning',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CustomerDB360() {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | LifecycleStage>('all');
  const [selectedId, setSelectedId] = useState<string | null>(DB360_PROFILES[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DB360_PROFILES.filter(p => {
      if (stageFilter !== 'all' && p.lifecycleStage !== stageFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, stageFilter]);

  const selected: CustomerProfile360 | undefined = DB360_PROFILES.find(p => p.id === selectedId) ?? filtered[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">DB 360</h1>
        <p className="text-zinc-500 mt-1">One profile per person — identity, content interactions, engagement, campaign attribution, and purchases, unified.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader className="space-y-3">
            <CardTitle className="text-white text-base">Profiles ({filtered.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search name or email…"
                  className="pl-8 bg-zinc-950 border-zinc-800 text-zinc-200"
                />
              </div>
              <Select value={stageFilter} onValueChange={v => setStageFilter(v as typeof stageFilter)}>
                <SelectTrigger className="w-36 bg-zinc-950 border-zinc-800 text-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="first-time">First-Time</SelectItem>
                  <SelectItem value="repeat">Repeat</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="lapsed">Lapsed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="max-h-[560px] overflow-y-auto space-y-1 pr-1">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                  selected?.id === p.id ? 'bg-zinc-800 border-rose-500/50' : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-100">{p.name}</span>
                  <Badge variant={STAGE_BADGE[p.lifecycleStage]} size="sm" className="capitalize">{p.lifecycleStage.replace('-', ' ')}</Badge>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-zinc-500">
                  <span>Engagement {p.engagementScore}</span>
                  <span>${p.lifetimeValue.toLocaleString()} LTV</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-zinc-500 py-6 text-center">No profiles match.</p>}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-3">
          {selected ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{selected.name}</CardTitle>
                    <p className="text-sm text-zinc-500">{selected.email}</p>
                  </div>
                  <Badge variant={STAGE_BADGE[selected.lifecycleStage]} className="capitalize">{selected.lifecycleStage.replace('-', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Engagement Score', value: `${selected.engagementScore}/100` },
                    { label: 'Conversion Prob.', value: `${Math.round(selected.conversionProbability * 100)}%` },
                    { label: 'Lifetime Value', value: `$${selected.lifetimeValue.toLocaleString()}` },
                    { label: 'Orders', value: selected.orderCount },
                  ].map(m => (
                    <div key={m.label} className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{m.label}</p>
                      <p className="text-lg font-semibold text-white mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-1">Acquisition channel</p>
                    <p className="text-zinc-200 capitalize">{selected.acquisitionChannel.replace(/-/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Preferred channel</p>
                    <p className="text-zinc-200 capitalize">{selected.preferredChannel}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Member since</p>
                    <p className="text-zinc-200">{formatDate(selected.joinedAt)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Last active</p>
                    <p className="text-zinc-200">{formatDate(selected.lastActiveAt)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm mb-2">Content affinities</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.contentAffinities.map(a => (
                      <Badge key={a} variant="outline" className="capitalize">{a.replace(/-/g, ' ')}</Badge>
                    ))}
                  </div>
                </div>

                {selected.productsOwned.length > 0 && (
                  <div>
                    <p className="text-zinc-500 text-sm mb-2">Products owned</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.productsOwned.map(handle => {
                        const product = getProduct(handle);
                        return <Badge key={handle} variant="secondary">{product?.name ?? handle}</Badge>;
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-zinc-500 text-sm mb-2">Recent engagement ({selected.engagementEvents.length} events, 90d)</p>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {selected.engagementEvents.slice(0, 12).map(ev => (
                      <div key={ev.id} className="flex items-center justify-between text-xs bg-zinc-950/50 border border-zinc-800/70 rounded px-2.5 py-1.5">
                        <span className="text-zinc-300 capitalize">{ev.type.replace(/_/g, ' ')} <span className="text-zinc-600">· {ev.channel}</span></span>
                        <span className="text-zinc-500">{formatDate(ev.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-16 text-center text-zinc-500">Select a profile to view its DB 360 record.</CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
