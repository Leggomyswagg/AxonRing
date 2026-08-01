// ── Supabase client ──
// Reads config from Vite env vars. Anything prefixed VITE_ is compiled into
// the browser bundle, so ONLY the publishable key belongs here — never the
// service_role key, which bypasses row level security.
//
// Local dev: put these in .env.local (git-ignored, see .env.example).
// Production: set them in Vercel → Settings → Environment Variables.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && publishableKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set — ' +
      'reviews and email capture will no-op. Copy .env.example to .env.local.'
  );
}

// Null when unconfigured so a missing env var degrades to a no-op rather than
// throwing on import and taking the whole storefront down.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, publishableKey!)
  : null;

// Checkout still runs on Base44 until payments move to Edge Functions
// (that needs the Stripe secret key, which can't live in the browser).
export const BASE44_API = 'https://tek-agent-65076290.base44.app/functions';
