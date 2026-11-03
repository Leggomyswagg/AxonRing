'use client';

import { useEffect, useState } from 'react';

type Resource = 'customers' | 'campaigns' | 'content' | 'outcomes' | 'audiences';
const tabs: { key: Resource; label: string }[] = [
  { key: 'customers', label: 'Customer360' },
  { key: 'campaigns', label: 'Campaign360' },
  { key: 'content', label: 'Content360' },
  { key: 'outcomes', label: 'Outcomes' },
  { key: 'audiences', label: 'Audiences' },
];

export default function Workbench() {
  const [resource, setResource] = useState<Resource>('customers');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});

  async function load(next = resource) {
    setLoading(true); setMessage('');
    const response = await fetch(`/api/db360/${next}`, { cache: 'no-store' });
    const json = await response.json();
    if (!response.ok) setMessage(json.error || 'Unable to load data');
    setRows(json.data || []); setLoading(false);
  }
  useEffect(() => { load(resource); }, [resource]);

  const fields: Record<Resource, { key: string; label: string; type?: string }[]> = {
    customers: [
      { key: 'first_name', label: 'First name' }, { key: 'last_name', label: 'Last name' },
      { key: 'email', label: 'Email', type: 'email' }, { key: 'status', label: 'Status' }, { key: 'source', label: 'Source' },
    ],
    campaigns: [{ key: 'name', label: 'Campaign name' }, { key: 'objective', label: 'Objective' }, { key: 'status', label: 'Status' }, { key: 'budget', label: 'Budget', type: 'number' }],
    content: [{ key: 'title', label: 'Title' }, { key: 'content_type', label: 'Content type' }, { key: 'platform', label: 'Platform' }, { key: 'status', label: 'Status' }, { key: 'body', label: 'Body' }],
    outcomes: [{ key: 'name', label: 'Outcome' }, { key: 'outcome_type', label: 'Type' }, { key: 'target_value', label: 'Target', type: 'number' }, { key: 'current_value', label: 'Current', type: 'number' }, { key: 'status', label: 'Status' }],
    audiences: [{ key: 'name', label: 'Segment name' }, { key: 'description', label: 'Description' }, { key: 'estimated_size', label: 'Estimated size', type: 'number' }],
  };

  async function create(e: React.FormEvent) {
    e.preventDefault(); setMessage('Saving…');
    const payload = { ...form };
    for (const f of fields[resource]) if (f.type === 'number' && payload[f.key]) payload[f.key] = String(Number(payload[f.key]));
    const response = await fetch(`/api/db360/${resource}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const json = await response.json();
    if (!response.ok) { setMessage(json.error || 'Save failed'); return; }
    setForm({}); setMessage('Saved to DB360'); load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this record?')) return;
    const response = await fetch(`/api/db360/${resource}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const json = await response.json();
    setMessage(response.ok ? 'Deleted' : (json.error || 'Delete failed')); if (response.ok) load();
  }

  return <main className="shell"><section className="content" style={{ maxWidth: 1400, margin: '0 auto' }}>
    <header className="topbar"><div><p className="eyebrow">DB360 OPERATIONS</p><h1>Command Workbench</h1><p className="sub">Create, inspect, and manage organization-scoped commercial intelligence.</p></div><a className="gold-button" href="/dashboard">Command Center</a></header>
    <div className="tabs">{tabs.map(t => <button key={t.key} className={resource === t.key ? 'tab active' : 'tab'} onClick={() => setResource(t.key)}>{t.label}</button>)}</div>
    <section className="card" style={{ marginTop: 18, padding: 24 }}><h2>Create {tabs.find(t => t.key === resource)?.label}</h2><form onSubmit={create} className="form-grid">{fields[resource].map(f => <label key={f.key}>{f.label}<input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required={['first_name','name','title'].includes(f.key)} /></label>)}<button className="gold-button" type="submit">Create record</button></form>{message && <p className="sub" style={{ marginTop: 12 }}>{message}</p>}</section>
    <section className="card" style={{ marginTop: 18, padding: 24 }}><div className="section-head"><div><p className="eyebrow">LIVE DATA</p><h2>Records</h2></div><button className="tab" onClick={() => load()}>Refresh</button></div>{loading ? <p className="sub">Loading…</p> : rows.length === 0 ? <p className="sub">No records yet. Create the first one above.</p> : <div style={{ overflowX: 'auto' }}><table className="data-table"><thead><tr>{Object.keys(rows[0]).map(k => <th key={k}>{k.replaceAll('_',' ')}</th>)}<th /></tr></thead><tbody>{rows.map(row => <tr key={String(row.id)}>{Object.keys(rows[0]).map(k => <td key={k}>{typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k] ?? '')}</td>)}<td><button className="danger-button" onClick={() => remove(String(row.id))}>Delete</button></td></tr>)}</tbody></table></div>}</section>
  </section></main>;
}
