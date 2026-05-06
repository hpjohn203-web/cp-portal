import { useState, useMemo } from 'react';
import { GLOSSARY } from '../data/glossary.js';

const ALL_TOPICS = ['All', ...Array.from(new Set(GLOSSARY.map(g => g.topic))).sort()];

export default function Glossary({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GLOSSARY.filter(item => {
      const matchesTopic = topicFilter === 'All' || item.topic === topicFilter;
      const matchesSearch = !q || item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, topicFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const item of filtered) {
      const letter = item.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(item);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Glossary</h1>
        <p className="text-sm text-slate-400">{GLOSSARY.length} terms · Certified Paralegal key definitions</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search terms or definitions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">✕</button>
        )}
      </div>

      {/* Topic filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {ALL_TOPICS.map(t => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              topicFilter === t ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-slate-500 mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</p>
      )}

      {/* Grouped glossary */}
      {grouped.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-slate-400">No terms found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([letter, items]) => (
            <div key={letter}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-black text-amber-400">{letter}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.term} className="bg-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpanded(expanded === item.term ? null : item.term)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-slate-100">{item.term}</span>
                        <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full hidden sm:inline">{item.topic}</span>
                      </div>
                      <span className="text-slate-500 text-sm ml-2 shrink-0">{expanded === item.term ? '▲' : '▼'}</span>
                    </button>
                    {expanded === item.term && (
                      <div className="px-4 pb-4">
                        <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full sm:hidden inline-block mb-2">{item.topic}</span>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.definition}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
