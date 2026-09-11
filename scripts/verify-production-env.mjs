const expectedSupabaseUrl = 'https://dxofkkdmrvyizwcdyrks.supabase.co';

// Local builds may intentionally run without third-party services. Every
// Vercel preview and production build must be fully configured so a green
// deployment cannot silently ship disabled reviews, subscriptions, or checkout.
if (process.env.VERCEL === '1') {
  const failures = [];
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const stripeKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (supabaseUrl !== expectedSupabaseUrl) {
    failures.push(`VITE_SUPABASE_URL must equal ${expectedSupabaseUrl}`);
  }
  if (!supabaseKey?.startsWith('sb_publishable_') || supabaseKey.length < 30) {
    failures.push('VITE_SUPABASE_PUBLISHABLE_KEY must be an active sb_publishable_ key');
  }
  if (!stripeKey || !/^pk_(test|live)_[A-Za-z0-9_]+$/.test(stripeKey) || stripeKey.length < 20) {
    failures.push('VITE_STRIPE_PUBLISHABLE_KEY must be a Stripe pk_test_ or pk_live_ key');
  }

  if (failures.length) {
    console.error('Production environment validation failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}
