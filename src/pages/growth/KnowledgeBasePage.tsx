import { useMemo, useState } from 'react';
import { marked } from 'marked';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { KB_ARTICLES, KB_CATEGORIES, type KBCategory } from '@/data/knowledgeBase';

export default function KnowledgeBasePage() {
  const [category, setCategory] = useState<KBCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(KB_ARTICLES[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KB_ARTICLES.filter(a => {
      if (category !== 'all' && a.category !== category) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.summary.toLowerCase().includes(q) && !a.tags.some(t => t.includes(q))) return false;
      return true;
    });
  }, [category, query]);

  const selected = KB_ARTICLES.find(a => a.id === selectedId) ?? filtered[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <p className="text-zinc-500 mt-1">Practice-tool playbooks for content creation, audience engagement, conversion, and scaling ad campaigns.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="pl-8 bg-zinc-950 border-zinc-800 text-zinc-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${category === 'all' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
            >
              All
            </button>
            {KB_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${category === c.id ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?.id === a.id ? 'bg-zinc-800 border-rose-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <p className="text-sm font-medium text-zinc-100">{a.title}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{a.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">{a.readMinutes} min</Badge>
                  {a.tags.slice(0, 2).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-zinc-500 py-6 text-center">No articles match.</p>}
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-3 h-fit">
          {selected ? (
            <>
              <CardHeader>
                <Badge variant="info" className="w-fit mb-2 capitalize">
                  {KB_CATEGORIES.find(c => c.id === selected.category)?.label}
                </Badge>
                <CardTitle className="text-white text-xl">{selected.title}</CardTitle>
                <p className="text-sm text-zinc-500">{selected.readMinutes} min read</p>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-white prose-a:text-rose-400 prose-strong:text-white"
                  dangerouslySetInnerHTML={{ __html: marked.parse(selected.body, { async: false }) as string }}
                />
              </CardContent>
            </>
          ) : (
            <CardContent className="py-16 text-center text-zinc-500">Select an article to read it.</CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
