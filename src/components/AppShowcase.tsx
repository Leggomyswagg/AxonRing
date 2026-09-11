import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, CreditCard, Moon, Smartphone, Wifi } from 'lucide-react';
import {
  HEART_RATE_DAY,
  READINESS_FACTORS,
  READINESS_SCORE,
  RECENT_TAPS,
  SLEEP_STAGES,
  SLEEP_TOTAL_MINUTES,
  TAP_STATS,
} from '@/data/appDemo';

type TabId = 'today' | 'sleep' | 'payments';

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'today', label: 'Today', icon: Activity },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

function formatDuration(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

// ── Today: readiness hero number + contributing factors + HR line ──
function TodayPanel() {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Readiness</p>
        <p className="text-6xl font-bold text-white leading-none">{READINESS_SCORE}</p>
        <p className="text-sm text-emerald-400 mt-2">Primed — go for it today</p>
      </div>

      <div className="space-y-2.5">
        {READINESS_FACTORS.map(f => (
          <div key={f.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">{f.label}</span>
              <span className="text-zinc-200 font-medium">{f.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${f.weight * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Heart rate today</p>
          <p className="text-xs text-zinc-400">52 bpm resting</p>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HEART_RATE_DAY} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <XAxis dataKey="time" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} interval={2} />
              <YAxis stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} width={34} domain={[40, 130]} />
              <Tooltip
                cursor={{ stroke: '#52525b', strokeWidth: 1 }}
                contentStyle={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#a1a1aa' }}
                formatter={(v: number) => [`${v} bpm`, 'Heart rate']}
              />
              <Line type="monotone" dataKey="bpm" stroke="#fb7185" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: '#18181b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Sleep: total + stacked composition bar with direct labels ──
function SleepPanel() {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Time asleep</p>
        <p className="text-5xl font-bold text-white leading-none">{formatDuration(SLEEP_TOTAL_MINUTES - 17)}</p>
        <p className="text-sm text-zinc-400 mt-2">11:24 PM — 6:32 AM</p>
      </div>

      {/* Stacked composition: 2px surface gap between segments */}
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Stages</p>
        <div className="flex h-4 w-full gap-[2px] rounded-full overflow-hidden">
          {SLEEP_STAGES.map(s => (
            <div
              key={s.stage}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(s.minutes / SLEEP_TOTAL_MINUTES) * 100}%`, backgroundColor: s.color }}
              title={`${s.stage} — ${formatDuration(s.minutes)}`}
            />
          ))}
        </div>
      </div>

      {/* Legend doubles as the direct-label / table view — identity is never color-alone */}
      <div className="space-y-2">
        {SLEEP_STAGES.map(s => (
          <div key={s.stage} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              {s.stage}
            </span>
            <span className="text-zinc-400 tabular-nums">
              {formatDuration(s.minutes)}
              <span className="text-zinc-600 ml-2">{Math.round((s.minutes / SLEEP_TOTAL_MINUTES) * 100)}%</span>
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-3">
        <p className="text-xs text-zinc-300 leading-relaxed">
          Deep sleep was <span className="text-white font-medium">18 minutes above</span> your 30-day average. Keep your
          bedtime consistent this week.
        </p>
      </div>
    </div>
  );
}

// ── Payments: tap feed + monthly stats ──
function PaymentsPanel() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Taps', value: TAP_STATS.thisMonth },
          { label: 'Spent', value: `$${TAP_STATS.totalSpend.toFixed(0)}` },
          { label: 'Avg tap', value: TAP_STATS.avgTapTime },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 py-2.5">
            <p className="text-lg font-bold text-white leading-none">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Recent taps</p>
        <div className="space-y-1.5">
          {RECENT_TAPS.map(t => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl bg-zinc-800/40 border border-zinc-700/40 px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                <Wifi className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-100 truncate">{t.merchant}</p>
                <p className="text-[11px] text-zinc-500">{t.time}</p>
              </div>
              <p className="text-sm font-medium text-white tabular-nums">${t.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
        Payments work even at 0% battery — the NFC chip is passive.
      </p>
    </div>
  );
}

export default function AppShowcase() {
  const [tab, setTab] = useState<TabId>('today');

  return (
    <section className="py-24 lg:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">The App</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            What You'll <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">See Every Morning</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            The ring does the sensing. The app turns it into something you can act on — free, forever, with no
            subscription gating your own data.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Phone frame */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-[300px] rounded-[2.5rem] border-[10px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-800 rounded-b-2xl z-10" />

              <div className="rounded-[1.75rem] overflow-hidden bg-zinc-900">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] text-zinc-500">
                  <span>9:41</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> 100%</span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-3 pb-3">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      aria-pressed={tab === id}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                        tab === id ? 'bg-rose-500 text-white' : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Panel */}
                <div className="px-4 pb-6 min-h-[420px]">
                  {tab === 'today' && <TodayPanel />}
                  {tab === 'sleep' && <SleepPanel />}
                  {tab === 'payments' && <PaymentsPanel />}
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {[
                {
                  icon: Activity,
                  title: 'A single number to start the day',
                  body: 'Readiness blends resting heart rate, HRV, sleep, and recovery into one score — with the factors behind it shown, not hidden.',
                },
                {
                  icon: Moon,
                  title: 'Sleep you can actually read',
                  body: 'Full stage breakdown every night, compared against your own 30-day baseline instead of a generic target.',
                },
                {
                  icon: CreditCard,
                  title: 'Every tap, tracked',
                  body: 'Payment history lives beside your health data — the only ring that does both. Taps work at 0% battery.',
                },
                {
                  icon: Smartphone,
                  title: 'iOS and Android, no subscription',
                  body: 'Every feature ships with the ring. No paywall on your history, no monthly fee to keep your own data.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
