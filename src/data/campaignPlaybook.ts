// ── Outcome-Based Marketing Playbook ──
// Static reference data the Campaign Builder uses to enforce "objective first,
// creative second": every campaign picks a business outcome and KPI before
// any ad copy is generated. See Knowledge Base > Outcome-Based Marketing.

import type { LifecycleStage, ContentCategory } from './db360';

export type CampaignObjective = 'awareness' | 'engagement' | 'conversion' | 'retention';
export type CampaignChannel = 'paid-social' | 'paid-search' | 'email' | 'sms' | 'influencer' | 'in-store-nfc';

export interface ObjectiveDef {
  id: CampaignObjective;
  label: string;
  description: string;
  kpiLabel: string;
  kpiUnit: '%' | 'count' | '$';
  recommendedChannels: CampaignChannel[];
}

export const OBJECTIVES: ObjectiveDef[] = [
  {
    id: 'awareness',
    label: 'Awareness',
    description: 'Introduce AxonRing to a new audience segment.',
    kpiLabel: 'Cost per 1,000 reached',
    kpiUnit: '$',
    recommendedChannels: ['paid-social', 'influencer'],
  },
  {
    id: 'engagement',
    label: 'Engagement',
    description: 'Deepen interest — content views, email opens/clicks, session depth.',
    kpiLabel: 'Engagement rate',
    kpiUnit: '%',
    recommendedChannels: ['paid-social', 'email', 'influencer'],
  },
  {
    id: 'conversion',
    label: 'Conversion',
    description: 'Turn engaged prospects into paying customers.',
    kpiLabel: 'Checkout-start rate',
    kpiUnit: '%',
    recommendedChannels: ['paid-search', 'paid-social', 'email', 'in-store-nfc'],
  },
  {
    id: 'retention',
    label: 'Retention',
    description: 'Drive repeat purchase and loyalty among existing customers.',
    kpiLabel: 'Repeat purchase rate',
    kpiUnit: '%',
    recommendedChannels: ['email', 'sms'],
  },
];

export const CHANNEL_LABELS: Record<CampaignChannel, string> = {
  'paid-social': 'Paid Social',
  'paid-search': 'Paid Search',
  'email': 'Email',
  'sms': 'SMS',
  'influencer': 'Influencer',
  'in-store-nfc': 'In-Store NFC',
};

export interface AudienceSegmentDef {
  id: string;
  label: string;
  description: string;
  lifecycleStages: LifecycleStage[];
  contentAffinity?: ContentCategory;
  minEngagementScore?: number;
}

export const AUDIENCE_SEGMENTS: AudienceSegmentDef[] = [
  { id: 'cold-leads', label: 'Cold Leads', description: 'No purchase yet, low engagement — top-of-funnel.', lifecycleStages: ['lead'], minEngagementScore: 0 },
  { id: 'warm-leads', label: 'Warm Leads', description: 'No purchase yet, actively engaging with content.', lifecycleStages: ['lead'], minEngagementScore: 40 },
  { id: 'first-time-buyers', label: 'First-Time Buyers', description: 'One order — prime for a second-purchase nudge.', lifecycleStages: ['first-time'] },
  { id: 'repeat-customers', label: 'Repeat Customers', description: 'Two or more orders, healthy engagement.', lifecycleStages: ['repeat'] },
  { id: 'vip', label: 'VIP', description: 'High-frequency, high-LTV customers.', lifecycleStages: ['vip'] },
  { id: 'lapsed', label: 'Lapsed', description: 'Previously purchased, engagement has dropped off.', lifecycleStages: ['lapsed'] },
  { id: 'nfc-affinity', label: 'NFC Payments Affinity', description: 'Any lifecycle stage with demonstrated interest in tap-to-pay content.', lifecycleStages: ['lead', 'first-time', 'repeat', 'vip', 'lapsed'], contentAffinity: 'nfc-payments' },
  { id: 'health-affinity', label: 'Health Tracking Affinity', description: 'Any lifecycle stage engaging with health/sleep tracking content.', lifecycleStages: ['lead', 'first-time', 'repeat', 'vip', 'lapsed'], contentAffinity: 'health-tracking' },
];

export interface AdCopyTemplate {
  headline: string;
  body: string;
}

// {product}, {segment}, {offer} are replaced at generation time.
export const AD_COPY_TEMPLATES: Record<CampaignObjective, AdCopyTemplate[]> = {
  awareness: [
    { headline: 'Meet {product} — Your Ring, Reimagined', body: 'Tap to pay. Track your health. All from a ring you\'ll forget you\'re wearing. Discover {product}.' },
    { headline: 'The Smart Ring {segment} Are Switching To', body: '{product} combines aerospace-grade materials with everyday tech. See why.' },
  ],
  engagement: [
    { headline: 'How Accurate Is {product}, Really?', body: 'We put {product} through real-world testing — sleep, workouts, and tap-to-pay. Read the results.' },
    { headline: 'Still Deciding? Here\'s What {segment} Say About {product}', body: 'Real reviews, real fit questions, answered. Explore {product}.' },
  ],
  conversion: [
    { headline: '{offer} on {product} — This Week Only', body: 'Free sizing kit, free shipping, 30-day returns. {segment}, your {product} is ready.' },
    { headline: 'Complete Your Order: {product}', body: 'You checked it out — here\'s {offer} to make it official. Limited time for {segment}.' },
  ],
  retention: [
    { headline: 'You\'ve Had {product} for a While — Here\'s What\'s New', body: 'New firmware, new finishes, and a referral reward for {segment}. See what\'s new.' },
    { headline: 'A Thank You From AxonRing', body: 'As one of our {segment}, enjoy {offer} on your next ring or accessory.' },
  ],
};

// ── Scaling thresholds (see Knowledge Base > "When to Scale a Campaign") ──
export const SCALING_RULES = {
  kpiAttainmentThreshold: 0.8, // 80%+ of KPI target
  maxCostToLtvRatio: 1 / 3,    // cost-per-outcome <= segment avg LTV / 3
  minRunDays: 7,
  minDaysAtCurrentBudget: 3,
  recommendedIncreasePctRange: [20, 30] as [number, number],
};
