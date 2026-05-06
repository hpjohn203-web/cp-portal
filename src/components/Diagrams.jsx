import { useState } from 'react';
import { DIAGRAMS } from '../data/diagrams.js';
import { DIAGRAM_VISUALS } from './DiagramVisuals.jsx';

const ALL_TOPICS = ['All', ...Array.from(new Set(DIAGRAMS.map(d => d.topic))).sort()];

const TOPIC_ICONS = {
  'Civil Procedure': '🏛️', 'Contract Law': '📝', 'Torts': '⚖️',
  'Legal Ethics': '🛡️', 'Constitutional Law': '⚖️', 'Real Property': '🏠',
  'Business Organizations': '💼', 'Criminal Procedure': '🔒', 'Evidence': '📜',
  'Administrative Law': '📋', 'Family Law': '👨‍👩‍👧', 'Probate': '📜',
};

export default function Diagrams({ onNavigate }) {
  const [topicFilter, setTopicFilter] = useState('All');
  const [activeItem, setActiveItem] = useState(null);

  const filtered = topicFilter === 'All' ? DIAGRAMS : DIAGRAMS.filter(d => d.topic === topicFilter);

  if (activeItem) {
    const Visual = DIAGRAM_VISUALS[activeItem.visualKey];
    return (
      <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto">
        <button onClick={() => setActiveItem(null)} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Diagrams
        </button>
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mb-3 inline-block">
          {TOPIC_ICONS[activeItem.topic]} {activeItem.topic}
        </span>
        <h2 className="text-xl font-bold mb-2">{activeItem.title}</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">{activeItem.description}</p>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          {Visual ? <Visual /> : (
            <div className="p-8 text-center text-slate-500">
              <p className="text-3xl mb-2">{TOPIC_ICONS[activeItem.topic] || '🖼️'}</p>
              <p className="text-sm">Diagram coming soon</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">Diagrams</h1>
        <p className="text-sm text-slate-400">{DIAGRAMS.length} interactive reference diagrams</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {ALL_TOPICS.map(t => (
          <button key={t} onClick={() => setTopicFilter(t)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              topicFilter === t ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}>
            {TOPIC_ICONS[t] && <span className="mr-1">{TOPIC_ICONS[t]}</span>}{t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item, i) => {
          const Visual = DIAGRAM_VISUALS[item.visualKey];
          return (
            <button key={i} onClick={() => setActiveItem(item)}
              className="bg-slate-800 hover:bg-slate-800/80 border border-slate-700 hover:border-amber-500/40 rounded-2xl overflow-hidden text-left transition-all active:scale-[0.98] group">
              <div className="pointer-events-none p-3 max-h-48 overflow-hidden relative">
                {Visual ? <Visual /> : (
                  <div className="h-32 flex items-center justify-center text-3xl">{TOPIC_ICONS[item.topic] || '🖼️'}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent" />
              </div>
              <div className="px-4 pb-4">
                <span className="text-xs text-amber-400/80 font-semibold">{TOPIC_ICONS[item.topic]} {item.topic}</span>
                <h3 className="font-semibold text-sm text-slate-100 mt-0.5 mb-1">{item.title}</h3>
                <p className="text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">View diagram →</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
