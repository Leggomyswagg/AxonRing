import { useEffect, useMemo, useState } from 'react';
import { Rocket, Trash2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { PRODUCTS } from '@/data/catalog';
import { AUDIENCE_SEGMENTS, CHANNEL_LABELS, OBJECTIVES, type CampaignChannel, type CampaignObjective } from '@/data/campaignPlaybook';
import {
  buildCampaignDraft,
  deleteCampaign,
  evaluateScaling,
  loadCampaigns,
  recommendKPITarget,
  saveCampaign,
  segmentAvgLTV,
  segmentProfiles,
  type Campaign,
} from '@/lib/growth';

const STATUS_STYLE: Record<ReturnType<typeof evaluateScaling>['status'], { label: string; badge: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  'ready-to-scale': { label: 'Ready to Scale', badge: 'success' },
  'refresh-creative': { label: 'Refresh Creative', badge: 'warning' },
  hold: { label: 'Hold Budget', badge: 'destructive' },
  'too-early': { label: 'Too Early to Judge', badge: 'secondary' },
};

export default function CampaignBuilder() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>('conversion');
  const [segmentId, setSegmentId] = useState(AUDIENCE_SEGMENTS[0].id);
  const [channel, setChannel] = useState<CampaignChannel>(OBJECTIVES.find(o => o.id === 'conversion')!.recommendedChannels[0]);
  const [productHandle, setProductHandle] = useState(PRODUCTS[0].handle);
  const [budget, setBudget] = useState(1500);
  const [offer, setOffer] = useState('15% off');
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => { setCampaigns(loadCampaigns()); }, []);

  const objectiveDef = OBJECTIVES.find(o => o.id === objective)!;
  const segmentDef = AUDIENCE_SEGMENTS.find(s => s.id === segmentId)!;
  const product = PRODUCTS.find(p => p.handle === productHandle)!;
  const members = segmentProfiles(segmentId);
  const avgLTV = segmentAvgLTV(segmentId);
  const kpi = useMemo(() => recommendKPITarget(objective, segmentId), [objective, segmentId]);

  const preview = useMemo(
    () => buildCampaignDraft({ name: name || 'Untitled Campaign', objective, segmentId, channel, product, budget, offer, variantIndex, seedOffset: 0 }),
    [name, objective, segmentId, channel, product, budget, offer, variantIndex]
  );

  const handleObjectiveChange = (v: CampaignObjective) => {
    setObjective(v);
    setChannel(OBJECTIVES.find(o => o.id === v)!.recommendedChannels[0]);
  };

  const handleLaunch = () => {
    const draft = buildCampaignDraft({
      name: name || `${product.name} — ${objectiveDef.label}`,
      objective, segmentId, channel, product, budget, offer, variantIndex,
      seedOffset: campaigns.length,
    });
    setCampaigns(saveCampaign(draft));
    setName('');
    toast({ title: 'Campaign launched', description: `${draft.name} is live with a ${draft.kpiLabel} target of ${draft.kpiTarget}${draft.kpiUnit === '$' ? '' : draft.kpiUnit}.` });
  };

  const handleDelete = (id: string) => {
    setCampaigns(deleteCampaign(id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Campaign Builder</h1>
        <p className="text-zinc-500 mt-1">Outcome-based by design: objective and audience first, ad copy and scaling recommendation generated from that.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Builder form */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader><CardTitle className="text-white text-base">1. Define the outcome</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-400 text-xs">Campaign name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder={`${product.name} — ${objectiveDef.label}`} className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200" />
            </div>

            <div>
              <Label className="text-zinc-400 text-xs">Objective</Label>
              <Select value={objective} onValueChange={v => handleObjectiveChange(v as CampaignObjective)}>
                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OBJECTIVES.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500 mt-1">{objectiveDef.description}</p>
            </div>

            <div>
              <Label className="text-zinc-400 text-xs">Audience segment (DB 360)</Label>
              <Select value={segmentId} onValueChange={setSegmentId}>
                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCE_SEGMENTS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500 mt-1">{segmentDef.description} — {members.length} profiles, ${avgLTV} avg. LTV</p>
            </div>

            <div>
              <Label className="text-zinc-400 text-xs">Channel</Label>
              <Select value={channel} onValueChange={v => setChannel(v as CampaignChannel)}>
                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHANNEL_LABELS) as CampaignChannel[]).map(c => (
                    <SelectItem key={c} value={c}>
                      {CHANNEL_LABELS[c]}{objectiveDef.recommendedChannels.includes(c) ? ' (recommended)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-zinc-400 text-xs">Product</Label>
              <Select value={productHandle} onValueChange={setProductHandle}>
                <SelectTrigger className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map(p => <SelectItem key={p.handle} value={p.handle}>{p.name} — ${p.price}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-400 text-xs">Budget ($/mo)</Label>
                <Input type="number" min={0} value={budget} onChange={e => setBudget(Number(e.target.value))} className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200" />
              </div>
              <div>
                <Label className="text-zinc-400 text-xs">Offer</Label>
                <Input value={offer} onChange={e => setOffer(e.target.value)} className="mt-1 bg-zinc-950 border-zinc-800 text-zinc-200" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-zinc-400 text-xs">Ad copy variant</Label>
              <div className="flex gap-1">
                {[0, 1].map(i => (
                  <button
                    key={i}
                    onClick={() => setVariantIndex(i)}
                    className={`px-2.5 py-1 text-xs rounded border ${variantIndex === i ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'border-zinc-800 text-zinc-400'}`}
                  >
                    {i === 0 ? 'A' : 'B'}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleLaunch} className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white">
              <Rocket className="w-4 h-4 mr-2" /> Launch Campaign
            </Button>
          </CardContent>
        </Card>

        {/* Live preview */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-3 h-fit">
          <CardHeader><CardTitle className="text-white text-base">2. Outcome &amp; creative preview</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">KPI target</p>
                <p className="text-lg font-semibold text-white mt-0.5">{kpi.unit === '$' ? '$' : ''}{kpi.value}{kpi.unit !== '$' ? kpi.unit : ''}</p>
                <p className="text-[11px] text-zinc-500">{kpi.label}</p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">Reach</p>
                <p className="text-lg font-semibold text-white mt-0.5">{members.length}</p>
                <p className="text-[11px] text-zinc-500">profiles in segment</p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">Est. CAC ceiling</p>
                <p className="text-lg font-semibold text-white mt-0.5">{avgLTV > 0 ? `$${Math.round(avgLTV / 3)}` : 'N/A'}</p>
                <p className="text-[11px] text-zinc-500">{avgLTV > 0 ? 'LTV ÷ 3' : 'No purchase history yet'}</p>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-950/60 px-4 py-2 text-xs text-zinc-500 border-b border-zinc-800">Generated ad copy — {CHANNEL_LABELS[channel]}</div>
              <div className="p-4">
                <p className="font-semibold text-white">{preview.adCopy.headline}</p>
                <p className="text-sm text-zinc-400 mt-1.5">{preview.adCopy.body}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-500">Recommended channels for {objectiveDef.label}: {objectiveDef.recommendedChannels.map(c => CHANNEL_LABELS[c]).join(', ')}.</p>
          </CardContent>
        </Card>
      </div>

      {/* Active campaigns */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-rose-400" /> Active Campaigns ({campaigns.length})</h2>
        {campaigns.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800"><CardContent className="py-10 text-center text-zinc-500">No campaigns launched yet — build one above.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => {
              const rec = evaluateScaling(c);
              const style = STATUS_STYLE[rec.status];
              const attainmentPct = c.kpiTarget > 0 ? Math.min(150, Math.round((c.performance.kpiActual / c.kpiTarget) * 100)) : 0;
              return (
                <Card key={c.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white">{c.name}</p>
                          <Badge variant="outline" className="capitalize">{c.objective}</Badge>
                          <Badge variant="secondary">{CHANNEL_LABELS[c.channel]}</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {AUDIENCE_SEGMENTS.find(s => s.id === c.segmentId)?.label} · ${c.budget}/mo · {c.performance.daysRunning}d running
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={style.badge}>{style.label}</Badge>
                        <button onClick={() => handleDelete(c.id)} className="text-zinc-600 hover:text-rose-400 transition-colors" aria-label="Delete campaign">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>{c.kpiLabel}: {c.performance.kpiActual}{c.kpiUnit !== '$' ? c.kpiUnit : ''} of {c.kpiTarget}{c.kpiUnit !== '$' ? c.kpiUnit : ''} target</span>
                        <span>${c.performance.costPerOutcome} cost/outcome</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full ${attainmentPct >= 80 ? 'bg-emerald-500' : attainmentPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, attainmentPct)}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 mt-3">{rec.reason}</p>
                    {rec.suggestedIncreasePct && (
                      <p className="text-xs text-emerald-400 mt-1">Suggested budget increase: {rec.suggestedIncreasePct[0]}–{rec.suggestedIncreasePct[1]}%</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
