// ── AxonRing Growth Knowledge Base ──
// Practice-tool content: playbooks the content, lifecycle, and paid-media
// team pull from when creating content, running engagement programs, and
// scaling ad campaigns. Body text uses light markdown (rendered via `marked`).

export type KBCategory =
  | 'content-creation'
  | 'audience-engagement'
  | 'conversion'
  | 'outcome-based-marketing'
  | 'ad-campaigns-scaling';

export interface KBArticle {
  id: string;
  category: KBCategory;
  title: string;
  summary: string;
  readMinutes: number;
  tags: string[];
  body: string; // markdown
}

export const KB_CATEGORIES: { id: KBCategory; label: string; description: string }[] = [
  { id: 'content-creation', label: 'Content Creation', description: 'Briefs, formats, and asset patterns that reliably move people down the AxonRing funnel.' },
  { id: 'audience-engagement', label: 'Audience Engagement', description: 'Segmentation, lifecycle messaging, and channel cadence for keeping the DB 360 audience warm.' },
  { id: 'conversion', label: 'Conversion', description: 'On-site, checkout, and lifecycle levers for turning engaged visitors into buyers.' },
  { id: 'outcome-based-marketing', label: 'Outcome-Based Marketing', description: 'Tying every campaign to a business outcome and KPI target before it launches.' },
  { id: 'ad-campaigns-scaling', label: 'Ad Campaigns & Scaling', description: 'Rules for when and how to scale spend once a campaign proves itself.' },
];

export const KB_ARTICLES: KBArticle[] = [
  {
    id: 'kb-content-01',
    category: 'content-creation',
    title: 'The AxonRing Content Brief Template',
    summary: 'Every asset — blog, reel, email — starts from the same 6-field brief so creative stays on-strategy.',
    readMinutes: 4,
    tags: ['brief', 'process'],
    body: `Use this template before writing or filming anything:

1. **Funnel stage** — awareness, engagement, conversion, or retention (pick one).
2. **Audience segment** — pull straight from DB 360 (e.g. "lapsed VIPs, NFC affinity").
3. **Single message** — one sentence. If it needs "and," split it into two assets.
4. **Proof point** — a stat, review, or demo that makes the claim credible (e.g. IP68 rating, 4.9★ average).
5. **Call to action** — the one next step (Shop Elite, Get Size Guide, Watch Demo).
6. **Success metric** — the number that tells you it worked (CTR, watch-through, add-to-cart rate).

Briefs without all 6 fields don't go into production. This keeps content measurable against the outcome it's meant to drive, not just "engagement" in the abstract.`,
  },
  {
    id: 'kb-content-02',
    category: 'content-creation',
    title: 'Format-to-Funnel Map',
    summary: 'Which content formats perform at which funnel stage, based on the current AxonRing content library.',
    readMinutes: 3,
    tags: ['formats', 'funnel'],
    body: `Match format to job-to-be-done rather than defaulting to "make a video":

- **Awareness** — short-form video (TikTok/Reels unboxings, comparisons), influencer seeding. Optimize for watch-through and shares, not clicks.
- **Engagement** — long-form blog/YouTube (deep dives on health tracking, NFC tech), UGC roundups. Optimize for time-on-page and return visits.
- **Conversion** — landing pages, size guides, review compilations, cart-abandon email. Optimize for add-to-cart and checkout-start rate.
- **Retention** — post-purchase email series, loyalty/VIP content, "how to get the most out of your ring" guides. Optimize for repeat purchase and NPS.

The Growth Hub's Overview tab shows live conversions-per-asset from the content library — use it to double down on formats that are already converting, not just ones that are trending.`,
  },
  {
    id: 'kb-engage-01',
    category: 'audience-engagement',
    title: 'Reading a DB 360 Profile',
    summary: 'How to interpret engagement score, conversion probability, and content affinity when planning outreach.',
    readMinutes: 5,
    tags: ['db360', 'segmentation'],
    body: `Every profile in DB 360 blends three signals into one **engagement score (0–100)**:

- **Recency** (up to 40 pts) — how long since their last touch, across email, social, ads, or an in-store NFC tap.
- **Frequency** (up to 35 pts) — total engagement events in the trailing 90 days.
- **Depth** (up to 25 pts) — high-intent actions specifically: email clicks, ad clicks, NFC taps.

Pair engagement score with **lifecycle stage** before you message someone:

- \`lead\` + high engagement → send a conversion-stage asset (size guide, best-seller roundup), not another awareness piece.
- \`repeat\` + falling engagement → retention play (loyalty content, new-arrival preview) before they lapse.
- \`lapsed\` → win-back offer, not a generic newsletter. Check their \`contentAffinities\` first so the win-back hook matches what they cared about.

**Conversion probability** is a 0–1 estimate of next-30-day purchase likelihood — use it to prioritize who gets a paid-media retarget versus an organic touch.`,
  },
  {
    id: 'kb-engage-02',
    category: 'audience-engagement',
    title: 'Channel Cadence Guardrails',
    summary: 'Default send/post frequency by channel so engagement programs don\'t fatigue the audience.',
    readMinutes: 3,
    tags: ['cadence', 'email', 'social'],
    body: `Defaults — override only with a documented reason in the campaign brief:

| Channel | Max frequency | Cool-down after conversion |
|---|---|---|
| Email | 3x / week | 5 days (send a thank-you/care series instead) |
| Paid social retargeting | Always-on, capped impressions/day | 3 days |
| SMS | 2x / week | 7 days |
| In-store NFC prompts | Event-triggered, not scheduled | n/a |

Segments with an engagement score under 15 should be moved to a re-engagement track (lighter cadence, higher-incentive offer) rather than kept on the standard cadence — sustained low engagement is the leading predictor of unsubscribe/opt-out.`,
  },
  {
    id: 'kb-conv-01',
    category: 'conversion',
    title: 'The Five Conversion Levers',
    summary: 'Where to look first when a product page or campaign underperforms on conversion rate.',
    readMinutes: 4,
    tags: ['cro', 'checkout'],
    body: `In priority order of typical impact for AxonRing:

1. **Size confidence** — the #1 blocker for ring purchases. The size guide landing page converts at ~4x the blog average; make sure every PDP links to it above the fold.
2. **Social proof density** — review count and rating visible without scrolling. Products with 100+ reviews convert meaningfully higher than under-100.
3. **Price framing** — lead with the outcome (NFC payments, health tracking) before the price; anchor against the Elite tier so mid-tier products read as accessible.
4. **Checkout friction** — every additional required field costs conversion. Guest checkout should always be the default path.
5. **Urgency/incentive** — a real, limited offer (not evergreen "10% off") outperforms a permanent discount that trains audiences to wait.

Test one lever at a time. Stacking multiple changes in one release makes it impossible to attribute the lift.`,
  },
  {
    id: 'kb-conv-02',
    category: 'conversion',
    title: 'Attribution: First Touch vs. Last Touch',
    summary: 'How campaign attribution works in DB 360 and when to trust which model.',
    readMinutes: 3,
    tags: ['attribution', 'analytics'],
    body: `Each profile's \`campaignHistory\` records every touch (delivered → opened → clicked → converted) per campaign. Two ways to read it:

- **Last touch** — the campaign immediately before conversion. Good for evaluating bottom-funnel/retargeting campaigns.
- **First touch** — the campaign that originally brought the person into DB 360. Good for evaluating top-funnel/awareness spend, which last-touch models systematically undervalue.

Rule of thumb: use last-touch to decide whether to keep a conversion campaign running today; use first-touch (plus the acquisition-channel breakdown on the Overview tab) to decide where next quarter's awareness budget goes.`,
  },
  {
    id: 'kb-outcome-01',
    category: 'outcome-based-marketing',
    title: 'No Campaign Without an Outcome',
    summary: 'The rule that governs everything in the Campaign Builder: pick the business outcome before the creative.',
    readMinutes: 4,
    tags: ['strategy', 'kpi'],
    body: `Outcome-based marketing means every campaign is built backward from a business result, not forward from a creative idea. In the Campaign Builder, that means choosing, in order:

1. **Objective** — Awareness, Engagement, Conversion, or Retention. This is a business outcome, not a vanity metric ("go viral" is not an objective).
2. **Target segment** — pulled from DB 360, not a guess. The builder pre-fills expected reach and baseline engagement from real profile data.
3. **KPI target** — a number, tied to the objective (e.g. Conversion → checkout-starts and CAC; Retention → repeat-purchase rate).
4. **Budget** — sized to the KPI target and current channel performance (see Ad Campaigns & Scaling), not a round number picked in advance.

Only after those four are locked does the builder generate ad copy and channel recommendations. This ordering is deliberate — creative built before the outcome is defined tends to optimize for engagement-that-doesn't-convert.`,
  },
  {
    id: 'kb-outcome-02',
    category: 'outcome-based-marketing',
    title: 'Mapping Objectives to KPIs',
    summary: 'The default KPI each campaign objective is measured against inside the Growth Hub.',
    readMinutes: 2,
    tags: ['kpi'],
    body: `- **Awareness** → reach, video watch-through rate, cost per 1,000 reached.
- **Engagement** → content view rate, email open/click rate, session depth.
- **Conversion** → checkout-start rate, conversion rate, customer acquisition cost (CAC).
- **Retention** → repeat purchase rate within 90 days, NPS, lifetime value (LTV) lift.

A campaign is only "working" relative to the KPI tied to its objective — a Conversion campaign with great reach but flat checkout-starts is not working, even if the dashboard looks busy.`,
  },
  {
    id: 'kb-scale-01',
    category: 'ad-campaigns-scaling',
    title: 'When to Scale a Campaign',
    summary: 'The exact thresholds the Campaign Builder uses to recommend scaling spend.',
    readMinutes: 3,
    tags: ['scaling', 'budget'],
    body: `A campaign is flagged **Ready to Scale** when, over a 7-day trailing window:

- It has hit **80%+ of its KPI target**, and
- Cost per outcome (CAC for conversion campaigns, cost-per-engagement for engagement campaigns) is **at or below the segment's average lifetime value ÷ 3**, and
- It has run long enough to exit the learning phase (7+ days, 3+ days at current budget).

When all three hold, scale budget in **20–30% increments**, not by doubling — large jumps reset ad-platform learning phases and often *raise* cost per outcome temporarily. Re-check the same three conditions 3–5 days after each increase before scaling again.

A campaign that misses the KPI threshold but has low cost per outcome should be flagged for **creative refresh**, not paused — the audience and channel are working, the message isn't landing.`,
  },
  {
    id: 'kb-scale-02',
    category: 'ad-campaigns-scaling',
    title: 'Diversifying Scale: Beyond Budget',
    summary: 'Three ways to scale a working campaign that aren\'t "spend more money."',
    readMinutes: 3,
    tags: ['scaling', 'channels'],
    body: `Budget increases are the fastest lever but not the only one, and they have diminishing returns within a single channel/audience combination. Once a campaign is flagged Ready to Scale, also consider:

1. **Audience expansion** — widen the DB 360 segment definition (e.g. from "NFC-affinity + engaged" to "NFC-affinity + engaged-or-lead") before raising budget in the original narrow segment.
2. **Channel expansion** — take a winning Instagram creative concept to TikTok/YouTube rather than only increasing Instagram spend.
3. **Format expansion** — a winning static ad concept re-cut as short-form video (or vice versa) taps a different part of the audience's attention without touching the original campaign's budget or learning phase.

Sequence: expand audience → expand format → expand channel → raise budget. This order tends to preserve cost-per-outcome longer than budget-first scaling.`,
  },
];

export function getArticlesByCategory(category: KBCategory): KBArticle[] {
  return KB_ARTICLES.filter(a => a.category === category);
}

export function getArticle(id: string): KBArticle | undefined {
  return KB_ARTICLES.find(a => a.id === id);
}

export function searchArticles(query: string): KBArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return KB_ARTICLES;
  return KB_ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q))
  );
}
