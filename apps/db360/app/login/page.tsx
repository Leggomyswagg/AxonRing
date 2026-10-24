'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [mode,setMode] = useState<'signin'|'signup'>('signin'); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(''); try { const supabase = getSupabaseClient(); const result = mode === 'signin' ? await supabase.auth.signInWithPassword({email,password}) : await supabase.auth.signUp({email,password}); setBusy(false); if(result.error) return setError(result.error.message); if(mode === 'signup' && !result.data.session) return setError('Check your email to confirm your account, then sign in.'); router.push('/dashboard'); router.refresh(); } catch (error) { setBusy(false); setError(error instanceof Error ? error.message : 'Unable to connect to DB360.'); } }
  return <main className="auth-shell"><section className="auth-card"><div className="brand"><span className="mark">A</span><span>AxonRing <b>DB360</b></span></div><p className="eyebrow">COMMERCIAL INTELLIGENCE</p><h1>{mode === 'signin' ? 'Sign in to DB360' : 'Create your DB360 account'}</h1><p className="sub">Secure access to your customer, content, campaign, and intelligence operating system.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required /></label>{error && <p className="error">{error}</p>}<button className="gold-button" disabled={busy}>{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button></form><button className="text-button" onClick={()=>setMode(mode==='signin'?'signup':'signin')}>{mode === 'signin' ? 'Create an account →' : 'Already have an account? Sign in →'}</button></section></main>;
}
