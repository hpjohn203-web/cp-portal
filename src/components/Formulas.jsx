import { useState } from 'react';
import { FORMULAS } from '../data/formulas.js';

const ALL_TOPICS = ['All', ...Array.from(new Set(FORMULAS.map(f => f.topic))).sort()];

const TOPIC_COLORS = {
  'Time of Death':    { bg: 'bg-sky-500/10',    border: 'border-sky-500/30',    text: 'text-sky-400'    },
  'Entomology':       { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  'Toxicology':       { bg: 'bg-violet-500/10',  border: 'border-violet-500/30', text: 'text-violet-400'  },
  'Wound Ballistics': { bg: 'bg-red-500/10',     border: 'border-red-500/30',    text: 'text-red-400'     },
  'Documentation':    { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',  text: 'text-amber-400'   },
};

function topicStyle(topic) {
  return TOPIC_COLORS[topic] || { bg: 'bg-slate-700/40', border: 'border-slate-600', text: 'text-slate-400' };
}

export default function Formulas({ onNavigate }) {
  const [topicFilter, setTopicFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = topicFilter === 'All' ? FORMULAS : FORMULAS.filter(f => f.topic === topicFilter);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Formulas</h1>
        <p className="text-sm text-slate-400">{FORMULAS.length} key formulas and reference equations</p>
      </div>

      {/* Topic filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
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

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((f, i) => {
          const style = topicStyle(f.topic);
          const isOpen = expanded === i;
          return (
            <div key={i} className={`${style.bg} border ${style.border} rounded-2xl overflow-hidden`}>
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full px-5 py-4 text-left flex items-start justify-between gap-3"
              >
                <div>
                  <span className={`text-xs font-semibold ${style.text} mb-1 block`}>{f.topic}</span>
                  <p className="font-semibold text-slate-100 text-sm">{f.name}</p>
                </div>
                <span className="text-slate-500 mt-1 shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Formula box — always visible */}
              <div className="mx-5 mb-4 bg-slate-900/60 rounded-xl px-4 py-3 font-mono text-sm text-amber-300 leading-relaxed border border-slate-700/50 overflow-x-auto">
                {f.formula}
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-4">
                  {/* Variables */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variables</p>
                    <div className="space-y-1.5">
                      {f.variables.map((v, vi) => (
                        <div key={vi} className="flex items-start gap-3 text-xs">
                          <span className="font-mono font-bold text-amber-400 shrink-0 w-28">{v.symbol}</span>
                          <span className="text-slate-300">{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{f.notes}</p>
                  </div>

                  {/* Example */}
                  {f.example && (
                    <div className="bg-slate-800/60 rounded-xl p-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Example</p>
                      <p className="text-xs text-slate-200 leading-relaxed">{f.example}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
