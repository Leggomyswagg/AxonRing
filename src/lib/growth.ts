// ── Growth Engine ──
// Pure logic that powers the Campaign Builder: audience segmentation, KPI
// targeting, ad copy generation, and the scale/hold/refresh recommendation.

import { DB360_PROFILES, type CustomerProfile360 } from '@/data/db360';
import {
  AD_COPY_TEMPLATES,
  AUDIENCE_SEGMENTS,
  OBJECTIVES,
  SCALING_RULES,
  type AdCopyTemplate,
  type CampaignChannel,
  type CampaignObjective,
} from '@/data/campaignPlaybook';
import type { Product } from '@/data/catalog';

export function segmentProfiles(segmentId: string, profiles: CustomerProfile360[] = DB360_PROFILES): CustomerProfile360[] {
  const def = AUDIENCE_SEGMENTS.find(s => s.id === segmentId);
  if (!def) return [];
  return profiles.filter(p => {
    if (!def.lifecycleStages.includes(p.lifecycleStage)) return false;
    if (def.minEngagementScore !== undefined && p.engagementScore < def.minEngagementScore) return false;
    if (def.contentAffinity && !p.contentAffinities.includes(def.contentAffinity)) return false;
    return true;
  });
}

export function segmentAvgLTV(segmentId: string): number {
  const members = segmentProfiles(segmentId);
  if (members.length === 0) return 0;
  return Math.round(members.reduce((s, p) => s + p.lifetimeValue, 0) / members.length);
}

export function recommendKPITarget(objective: CampaignObjective, segmentId: string): { value: number; unit: string; label: string } {
  const def = OBJECTIVES.find(o => o.id === objective)!;
  const members = segmentProfiles(segmentId);
  const avgEngagement = members.length ? members.reduce((s, p) => s + p.engagementScore, 0) / members.length : 30;

  switch (objective) {
    case 'awareness':
      return { value: Math.max(4, Math.round(18 - avgEngagement / 10)), unit: '$', label: def.kpiLabel };
    case 'engagement':
      return { value: Math.min(35, Math.max(6, Math.round(avgEngagement * 0.6))), unit: '%', label: def.kpiLabel };
    case 'conversion':
      return { value: Math.min(20, Math.max(3, Math.round(avgEngagement * 0.25))), unit: '%', label: def.kpiLabel };
    case 'retention':
      return { value: Math.min(45, Math.max(10, Math.round(avgEngagement * 0.5))), unit: '%', label: def.kpiLabel };
  }
}

function fillTemplate(tpl: AdCopyTemplate, product: Product, segmentLabel: string, offer: string): AdCopyTemplate {
  const fill = (s: string) => s.split('{product}').join(product.name).split('{segment}').join(segmentLabel).split('{offer}').join(offer);
  return { headline: fill(tpl.headline), body: fill(tpl.body) };
}

export function generateAdCopy(
  objective: CampaignObjective,
  product: Product,
  segmentLabel: string,
  offer = '15% off',
  variantIndex = 0
): AdCopyTemplate {
  const templates = AD_COPY_TEMPLATES[objective];
  const tpl = templates[variantIndex % templates.length];
  return fillTemplate(tpl, product, segmentLabel, offer);
}

// ── Campaigns: created via the builder, persisted to localStorage ──

export interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  segmentId: string;
  channel: CampaignChannel;
  productHandle: string;
  kpiTarget: number;
  kpiUnit: string;
  kpiLabel: string;
  adCopy: AdCopyTemplate;
  budget: number;
  createdAt: string; // ISO
  // Mock trailing-7-day performance, generated at creation for demo purposes.
  performance: {
    kpiActual: number;
    costPerOutcome: number;
    daysRunning: number;
    daysAtCurrentBudget: number;
  };
}

export interface ScalingRecommendation {
  status: 'ready-to-scale' | 'refresh-creative' | 'hold' | 'too-early';
  reason: string;
  suggestedIncreasePct?: [number, number];
}

export function evaluateScaling(campaign: Campaign): ScalingRecommendation {
  const { performance, kpiTarget, segmentId } = campaign;
  const { minRunDays, minDaysAtCurrentBudget, kpiAttainmentThreshold, maxCostToLtvRatio, recommendedIncreasePctRange } = SCALING_RULES;

  if (performance.daysRunning < minRunDays || performance.daysAtCurrentBudget < minDaysAtCurrentBudget) {
    return { status: 'too-early', reason: `Still in the learning phase (${performance.daysRunning}d running, ${performance.daysAtCurrentBudget}d at current budget). Wait for ${minRunDays}d running / ${minDaysAtCurrentBudget}d at budget before evaluating.` };
  }

  const kpiAttainment = kpiTarget > 0 ? performance.kpiActual / kpiTarget : 0;
  const avgLTV = segmentAvgLTV(segmentId);
  const maxAllowedCost = avgLTV * maxCostToLtvRatio;
  const costOk = avgLTV === 0 ? true : performance.costPerOutcome <= maxAllowedCost;

  if (kpiAttainment >= kpiAttainmentThreshold && costOk) {
    const costNote = avgLTV > 0 ? `with cost per outcome ($${performance.costPerOutcome}) within segment LTV/3 ($${Math.round(maxAllowedCost)})` : '(segment has no purchase history yet, so no LTV ceiling applies)';
    return { status: 'ready-to-scale', reason: `Hit ${Math.round(kpiAttainment * 100)}% of KPI target ${costNote}. Increase budget in one step.`, suggestedIncreasePct: recommendedIncreasePctRange };
  }
  if (kpiAttainment < kpiAttainmentThreshold && costOk) {
    return { status: 'refresh-creative', reason: `Cost per outcome is healthy but KPI attainment is only ${Math.round(kpiAttainment * 100)}% of target — audience and channel are working, message likely isn't landing. Try new creative before adding budget.` };
  }
  return { status: 'hold', reason: `Cost per outcome ($${performance.costPerOutcome}) exceeds the segment's LTV/3 ceiling ($${Math.round(maxAllowedCost)}). Hold budget and re-check targeting before scaling.` };
}

const STORAGE_KEY = 'axonring_growth_campaigns_v1';

function seedDemoPerformance(kpiTarget: number, seedOffset: number): Campaign['performance'] {
  // Deterministic-ish spread so the builder has example campaigns at every recommendation state.
  const bucket = seedOffset % 4;
  const daysRunning = [10, 12, 4, 9][bucket];
  const daysAtCurrentBudget = [5, 6, 2, 4][bucket];
  const kpiActual = Math.max(0, Math.round(kpiTarget * [0.92, 0.55, 0.4, 0.87][bucket]));
  const costPerOutcome = [22, 18, 40, 65][bucket];
  return { kpiActual, costPerOutcome, daysRunning, daysAtCurrentBudget };
}

export function loadCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Campaign[] : [];
  } catch {
    return [];
  }
}

export function saveCampaign(campaign: Campaign): Campaign[] {
  const existing = loadCampaigns();
  const next = [campaign, ...existing];
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function deleteCampaign(id: string): Campaign[] {
  const next = loadCampaigns().filter(c => c.id !== id);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function buildCampaignDraft(params: {
  name: string;
  objective: CampaignObjective;
  segmentId: string;
  channel: CampaignChannel;
  product: Product;
  budget: number;
  offer: string;
  variantIndex: number;
  seedOffset: number;
}): Campaign {
  const segment = AUDIENCE_SEGMENTS.find(s => s.id === params.segmentId)!;
  const kpi = recommendKPITarget(params.objective, params.segmentId);
  const adCopy = generateAdCopy(params.objective, params.product, segment.label, params.offer, params.variantIndex);
  return {
    id: `camp-${Date.now()}`,
    name: params.name,
    objective: params.objective,
    segmentId: params.segmentId,
    channel: params.channel,
    productHandle: params.product.handle,
    kpiTarget: kpi.value,
    kpiUnit: kpi.unit,
    kpiLabel: kpi.label,
    adCopy,
    budget: params.budget,
    createdAt: new Date().toISOString(),
    performance: seedDemoPerformance(kpi.value, params.seedOffset),
  };
}
