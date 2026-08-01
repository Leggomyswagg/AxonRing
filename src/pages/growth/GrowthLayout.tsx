import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowLeft, BarChart3, BookOpen, Megaphone, Users } from 'lucide-react';

const NAV = [
  { to: '/growth', label: 'Overview', icon: BarChart3, end: true },
  { to: '/growth/db360', label: 'DB 360', icon: Users, end: false },
  { to: '/growth/knowledge-base', label: 'Knowledge Base', icon: BookOpen, end: false },
  { to: '/growth/campaigns', label: 'Campaign Builder', icon: Megaphone, end: false },
];

export default function GrowthLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-black/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Store
            </Link>
            <div className="h-5 w-px bg-zinc-800" />
            <span className="text-lg font-bold tracking-tight text-white">
              GROWTH<span className="text-rose-400">HUB</span>
            </span>
          </div>
          <p className="hidden md:block text-xs text-zinc-500">Data practice tool &amp; knowledge base — content, engagement &amp; conversion</p>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-rose-500 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
