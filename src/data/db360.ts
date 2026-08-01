// ── AxonRing DB 360 ──
// A unified customer/audience data model: one profile per person that merges
// identity, content interactions, marketing engagement, campaign attribution,
// and purchase history. This is the "single source of truth" the Growth Hub
// (content creation, audience engagement, and conversion tooling) reads from.
//
// No backend is wired up yet, so this module also seeds a realistic, fully
// deterministic mock dataset from the real product catalog — swap
// `buildMockDB360()` for a live query once a warehouse/CDP is connected.

import { PRODUCTS } from './catalog';

export type LifecycleStage = 'lead' | 'first-time' | 'repeat' | 'vip' | 'lapsed';
export type AcquisitionChannel = 'organic-search' | 'paid-social' | 'paid-search' | 'email' | 'influencer' | 'referral' | 'direct' | 'nfc-instore';
export type ContentCategory = 'product-education' | 'lifestyle' | 'health-tracking' | 'nfc-payments' | 'unboxing' | 'comparison' | 'ugc-review';
export type FunnelStage = 'awareness' | 'engagement' | 'conversion' | 'retention';
export type EngagementType = 'content_view' | 'email_open' | 'email_click' | 'social_engagement' | 'nfc_tap' | 'ad_click' | 'review_left';

export interface ContentAsset {
  id: string;
  title: string;
  category: ContentCategory;
  funnelStage: FunnelStage;
  channel: 'blog' | 'email' | 'instagram' | 'tiktok' | 'youtube' | 'landing-page';
  publishedAt: string; // ISO date
  views: number;
  avgEngagementRate: number; // 0-1
  conversions: number; // attributed orders
}

export interface EngagementEvent {
  id: string;
  type: EngagementType;
  contentId?: string;
  campaignId?: string;
  channel: ContentAsset['channel'] | 'in-store';
  timestamp: string; // ISO date
  value: number; // e.g. dwell seconds, or 1 for a discrete action
}

export interface CampaignTouch {
  campaignId: string;
  response: 'delivered' | 'opened' | 'clicked' | 'converted';
  timestamp: string;
}

export interface CustomerProfile360 {
  id: string;
  name: string;
  email: string;
  joinedAt: string; // ISO date
  lifecycleStage: LifecycleStage;
  acquisitionChannel: AcquisitionChannel;
  preferredChannel: ContentAsset['channel'];
  productsOwned: string[]; // product handles
  orderCount: number;
  lifetimeValue: number; // dollars
  avgOrderValue: number;
  engagementScore: number; // 0-100, blended recency/frequency/depth
  conversionProbability: number; // 0-1, likelihood of next-30-day purchase
  contentAffinities: ContentCategory[];
  engagementEvents: EngagementEvent[];
  campaignHistory: CampaignTouch[];
  lastActiveAt: string; // ISO date
  npsScore: number | null; // -100..100
}

// ── Deterministic PRNG so the dataset is stable across renders/builds ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = ['Avery', 'Jordan', 'Riley', 'Casey', 'Morgan', 'Quinn', 'Sydney', 'Reese', 'Dakota', 'Skyler', 'Rowan', 'Emerson', 'Finley', 'Hayden', 'Kendall', 'Peyton', 'Sage', 'Blair', 'Cameron', 'Drew'];
const LAST_NAMES = ['Chen', 'Okafor', 'Martinez', 'Nguyen', 'Patel', 'Kowalski', 'Silva', 'Johansson', 'Haddad', 'Kim', 'Brennan', 'Osei', 'Rossi', 'Fischer', 'Park'];
const CONTENT_CATEGORIES: ContentCategory[] = ['product-education', 'lifestyle', 'health-tracking', 'nfc-payments', 'unboxing', 'comparison', 'ugc-review'];
const ACQUISITION_CHANNELS: AcquisitionChannel[] = ['organic-search', 'paid-social', 'paid-search', 'email', 'influencer', 'referral', 'direct', 'nfc-instore'];
const CHANNELS: ContentAsset['channel'][] = ['blog', 'email', 'instagram', 'tiktok', 'youtube', 'landing-page'];

function daysAgoISO(rnd: () => number, maxDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(rnd() * maxDays));
  return d.toISOString();
}

function pick<T>(rnd: () => number, arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

export const CONTENT_LIBRARY: ContentAsset[] = [
  { id: 'c-01', title: 'Titanium vs. Ceramic: Which AxonRing Finish Lasts Longer?', category: 'comparison', funnelStage: 'awareness', channel: 'blog', publishedAt: daysAgoFixed(52), views: 18420, avgEngagementRate: 0.041, conversions: 61 },
  { id: 'c-02', title: 'Tap to Pay, Anywhere: A Day in the Life of AxonRing Elite', category: 'nfc-payments', funnelStage: 'engagement', channel: 'instagram', publishedAt: daysAgoFixed(41), views: 92310, avgEngagementRate: 0.087, conversions: 204 },
  { id: 'c-03', title: 'Unboxing the AxonRing Adventure (IP68 Waterproof Test)', category: 'unboxing', funnelStage: 'awareness', channel: 'youtube', publishedAt: daysAgoFixed(38), views: 61250, avgEngagementRate: 0.063, conversions: 118 },
  { id: 'c-04', title: 'How Accurate Is AxonRing Sleep Tracking? We Compared It to a Sleep Lab', category: 'health-tracking', funnelStage: 'engagement', channel: 'blog', publishedAt: daysAgoFixed(29), views: 24870, avgEngagementRate: 0.052, conversions: 74 },
  { id: 'c-05', title: '"I Wear Mine Every Day" — Real AxonRing Reviews Roundup', category: 'ugc-review', funnelStage: 'conversion', channel: 'landing-page', publishedAt: daysAgoFixed(24), views: 15310, avgEngagementRate: 0.112, conversions: 289 },
  { id: 'c-06', title: 'Size Guide: Finding Your Perfect AxonRing Fit', category: 'product-education', funnelStage: 'conversion', channel: 'landing-page', publishedAt: daysAgoFixed(19), views: 33980, avgEngagementRate: 0.074, conversions: 401 },
  { id: 'c-07', title: '30-Second Smart Ring Setup — TikTok Tutorial', category: 'product-education', funnelStage: 'engagement', channel: 'tiktok', publishedAt: daysAgoFixed(15), views: 214600, avgEngagementRate: 0.095, conversions: 176 },
  { id: 'c-08', title: 'Weekend Drop: 10% Off Welcome Email', category: 'product-education', funnelStage: 'conversion', channel: 'email', publishedAt: daysAgoFixed(9), views: 48250, avgEngagementRate: 0.183, conversions: 512 },
  { id: 'c-09', title: 'From Gym to Boardroom: Styling the AxonRing Executive', category: 'lifestyle', funnelStage: 'awareness', channel: 'instagram', publishedAt: daysAgoFixed(6), views: 40120, avgEngagementRate: 0.071, conversions: 88 },
  { id: 'c-10', title: 'Smart Home Control With a Tap — AxonRing x Matter', category: 'nfc-payments', funnelStage: 'engagement', channel: 'blog', publishedAt: daysAgoFixed(3), views: 9640, avgEngagementRate: 0.038, conversions: 22 },
];

function daysAgoFixed(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function buildEngagementEvents(rnd: () => number, count: number): EngagementEvent[] {
  const types: EngagementType[] = ['content_view', 'email_open', 'email_click', 'social_engagement', 'nfc_tap', 'ad_click', 'review_left'];
  return Array.from({ length: count }, (_, i): EngagementEvent => {
    const type = pick(rnd, types);
    const content = pick(rnd, CONTENT_LIBRARY);
    return {
      id: `ev-${i}-${Math.floor(rnd() * 1e6)}`,
      type,
      contentId: type === 'content_view' ? content.id : undefined,
      campaignId: rnd() > 0.5 ? `camp-${1 + Math.floor(rnd() * 6)}` : undefined,
      channel: type === 'nfc_tap' ? 'in-store' : content.channel,
      timestamp: daysAgoISO(rnd, 90),
      value: type === 'content_view' ? Math.round(20 + rnd() * 240) : 1,
    };
  }).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

function buildCampaignHistory(rnd: () => number, count: number): CampaignTouch[] {
  const responses: CampaignTouch['response'][] = ['delivered', 'opened', 'clicked', 'converted'];
  return Array.from({ length: count }, (_, i) => ({
    campaignId: `camp-${1 + Math.floor(rnd() * 6)}`,
    response: pick(rnd, responses),
    timestamp: daysAgoISO(rnd, 90),
  }));
}

function computeEngagementScore(events: EngagementEvent[], lastActiveAt: string): number {
  const recencyDays = (Date.now() - +new Date(lastActiveAt)) / 86_400_000;
  const recencyScore = Math.max(0, 40 - recencyDays); // fresher = higher, caps at 40
  const frequencyScore = Math.min(35, events.length * 1.4);
  const depthScore = Math.min(25, events.filter(e => e.type === 'email_click' || e.type === 'ad_click' || e.type === 'nfc_tap').length * 4);
  return Math.round(Math.max(0, Math.min(100, recencyScore + frequencyScore + depthScore)));
}

function buildProfile(rnd: () => number, index: number): CustomerProfile360 {
  const first = pick(rnd, FIRST_NAMES);
  const last = pick(rnd, LAST_NAMES);
  const joinedAt = daysAgoISO(rnd, 540);
  const orderCount = rnd() < 0.22 ? 0 : 1 + Math.floor(rnd() * rnd() * 6);
  const owned = orderCount === 0 ? [] : Array.from({ length: Math.min(orderCount, 4) }, () => pick(rnd, PRODUCTS).handle);
  const uniqueOwned = Array.from(new Set(owned));
  const avgOrderValue = uniqueOwned.length
    ? Math.round(uniqueOwned.reduce((s, h) => s + (PRODUCTS.find(p => p.handle === h)?.price ?? 199), 0) / uniqueOwned.length)
    : 0;
  const lifetimeValue = Math.round(avgOrderValue * orderCount * (0.9 + rnd() * 0.3));
  const lifecycleStage: LifecycleStage =
    orderCount === 0 ? 'lead'
    : orderCount === 1 ? 'first-time'
    : orderCount >= 5 ? 'vip'
    : rnd() < 0.15 ? 'lapsed'
    : 'repeat';
  const events = buildEngagementEvents(rnd, orderCount === 0 ? 3 + Math.floor(rnd() * 5) : 5 + Math.floor(rnd() * 14));
  const lastActiveAt = events[0]?.timestamp ?? daysAgoISO(rnd, 120);
  const engagementScore = computeEngagementScore(events, lastActiveAt);
  const conversionProbability = Math.round(
    Math.min(0.95, Math.max(0.02,
      (engagementScore / 130) + (lifecycleStage === 'lead' ? 0.08 : 0) + (lifecycleStage === 'lapsed' ? -0.1 : 0) + rnd() * 0.1
    )) * 100
  ) / 100;

  return {
    id: `cust-${1000 + index}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${index}`.toLowerCase() + '@example.com',
    joinedAt,
    lifecycleStage,
    acquisitionChannel: pick(rnd, ACQUISITION_CHANNELS),
    preferredChannel: pick(rnd, CHANNELS),
    productsOwned: uniqueOwned,
    orderCount,
    lifetimeValue,
    avgOrderValue,
    engagementScore,
    conversionProbability,
    contentAffinities: Array.from(new Set(Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => pick(rnd, CONTENT_CATEGORIES)))),
    engagementEvents: events,
    campaignHistory: buildCampaignHistory(rnd, 2 + Math.floor(rnd() * 5)),
    lastActiveAt,
    npsScore: orderCount > 0 && rnd() > 0.4 ? Math.round(-20 + rnd() * 120) : null,
  };
}

export function buildMockDB360(count = 60, seed = 20260720): CustomerProfile360[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => buildProfile(rnd, i));
}

// Stable module-level dataset — regenerate with buildMockDB360(n, seed) for a different sample size.
export const DB360_PROFILES: CustomerProfile360[] = buildMockDB360();

// ── Aggregate helpers ──

export function getSegmentBreakdown(profiles: CustomerProfile360[] = DB360_PROFILES) {
  const stages: LifecycleStage[] = ['lead', 'first-time', 'repeat', 'vip', 'lapsed'];
  return stages.map(stage => ({
    stage,
    count: profiles.filter(p => p.lifecycleStage === stage).length,
  }));
}

export function getChannelPerformance(profiles: CustomerProfile360[] = DB360_PROFILES) {
  const byChannel = new Map<AcquisitionChannel, { count: number; totalLTV: number; converted: number }>();
  for (const p of profiles) {
    const row = byChannel.get(p.acquisitionChannel) ?? { count: 0, totalLTV: 0, converted: 0 };
    row.count += 1;
    row.totalLTV += p.lifetimeValue;
    if (p.orderCount > 0) row.converted += 1;
    byChannel.set(p.acquisitionChannel, row);
  }
  return Array.from(byChannel.entries()).map(([channel, row]) => ({
    channel,
    count: row.count,
    avgLTV: Math.round(row.totalLTV / row.count),
    conversionRate: Math.round((row.converted / row.count) * 1000) / 10,
  }));
}

export function getFunnelTotals(profiles: CustomerProfile360[] = DB360_PROFILES) {
  const awareness = profiles.length;
  const engaged = profiles.filter(p => p.engagementScore >= 25).length;
  const converted = profiles.filter(p => p.orderCount > 0).length;
  const retained = profiles.filter(p => p.orderCount > 1).length;
  return [
    { stage: 'Awareness' as const, count: awareness },
    { stage: 'Engaged' as const, count: engaged },
    { stage: 'Converted' as const, count: converted },
    { stage: 'Retained' as const, count: retained },
  ];
}

export function getTopContent(limit = 5): ContentAsset[] {
  return [...CONTENT_LIBRARY].sort((a, b) => b.conversions - a.conversions).slice(0, limit);
}
