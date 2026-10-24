'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage(){ const router=useRouter(); const [name,setName]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');const slug=name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const {error}=await supabase.rpc('create_organization_for_current_user',{org_name:name,org_slug:slug});setBusy(false);if(error){setError(error.message);return;}router.push('/dashboard');router.refresh();} return <main className="auth-shell"><section className="auth-card"><div className="brand"><span className="mark">A</span><span>AxonRing <b>DB360</b></span></div><p className="eyebrow">WORKSPACE SETUP</p><h1>Create your organization</h1><p className="sub">Your organization is the security boundary for customers, campaigns, content, knowledge, and intelligence.</p><form onSubmit={submit}><label>Organization name<input value={name} onChange={e=>setName(e.target.value)} placeholder="AxonRing Holdings" required minLength={2}/></label>{error&&<p className="error">{error}</p>}<button className="gold-button" disabled={busy}>{busy?'Creating…':'Create workspace'}</button></form></section></main> }
