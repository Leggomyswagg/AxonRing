// ── Email capture ──
// Backed by public.subscribers, which is insert-only: the publishable key can
// add an address but cannot read the list back out.

import { supabase } from './supabase';

const DUPLICATE_EMAIL = '23505'; // unique_violation

export async function subscribeEmail(email: string, source: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: email.trim().toLowerCase(), source });

  // Already subscribed is a success from the visitor's point of view — and
  // surfacing it would leak whether an address is on the list.
  if (error && error.code !== DUPLICATE_EMAIL) throw error;
}
