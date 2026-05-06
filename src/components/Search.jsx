import { useState, useMemo } from 'react';
import questions from '../data/questions.json';
import { GLOSSARY } from '../data/glossary.js';
import { FORMULAS } from '../data/formulas.js';

export default function Search({ onNavigate }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;

    const qs = questions.filter(item =>
      item.question.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.options.some(o => o.toLowerCase().includes(q))
    ).slice(0, 8);

    const gl = GLOSSARY.filter(item =>
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
    ).slice(0, 6);

    const fm = FORMULAS.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q)
    ).slice(0, 4);

    return { questions: qs, glossary: gl, formulas: fm, total: qs.length + gl.length + fm.length };
  }, [query]);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <h1 className="text-xl lg:text-2xl font-bold mb-5">Search Everything</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <input
          autoFocus
          type="text"
          placeholder="Search questions, glossary, formulas…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-2xl pl-11 pr-4 py-4 text-slate-200 placeholder-slate-500 focus:outline-none text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">✕</button>
        )}
      </div>

      {!query && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400 text-sm">Type at least 2 characters to search across<br />questions, glossary terms, and formulas.</p>
        </div>
      )}

      {query.length === 1 && (
        <p className="text-center text-slate-500 text-sm py-4">Keep typing…</p>
      )}

      {results && results.total === 0 && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">😕</p>
          <p className="text-slate-400 text-sm">No results for "<strong className="text-slate-300">{query}</strong>"</p>
          <p className="text-slate-500 text-xs mt-2">Try a different keyword or topic name.</p>
        </div>
      )}

      {results && results.total > 0 && (
        <div className="space-y-6">
          <p className="text-xs text-slate-500">{results.total} result{results.total !== 1 ? 's' : ''} for "{query}"</p>

          {/* Questions */}
          {results.questions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">{results.questions.length}</span>
                <button onClick={() => onNavigate('quiz')} className="ml-auto text-xs text-amber-400 hover:underline">Go to Quiz →</button>
              </div>
              <div className="space-y-2">
                {results.questions.map(q => (
                  <QuestionResult key={q.id} q={q} query={query} />
                ))}
              </div>
            </section>
          )}

          {/* Glossary */}
          {results.glossary.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Glossary</span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">{results.glossary.length}</span>
                <button onClick={() => onNavigate('glossary')} className="ml-auto text-xs text-amber-400 hover:underline">View Glossary →</button>
              </div>
              <div className="space-y-2">
                {results.glossary.map(g => (
                  <div key={g.term} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-100">{highlight(g.term, query)}</span>
                      <span className="text-xs text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">{g.topic}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{g.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formulas */}
          {results.formulas.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Formulas</span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">{results.formulas.length}</span>
                <button onClick={() => onNavigate('formulas')} className="ml-auto text-xs text-amber-400 hover:underline">View Formulas →</button>
              </div>
              <div className="space-y-2">
                {results.formulas.map(f => (
                  <div key={f.name} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-100">{f.name}</span>
                      <span className="text-xs text-sky-400/70 bg-sky-400/10 px-2 py-0.5 rounded-full">{f.topic}</span>
                    </div>
                    <p className="text-xs font-mono text-amber-300 bg-slate-900/50 px-2 py-1 rounded-lg mt-1 truncate">{f.formula}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-400/30 text-amber-200 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function QuestionResult({ q, query }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full px-4 py-3 text-left">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-amber-400 font-semibold">{q.topic}</span>
            <p className="text-sm text-slate-200 leading-relaxed mt-0.5 line-clamp-2">{q.question}</p>
          </div>
          <span className="text-slate-500 shrink-0 mt-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 border-t border-slate-700 pt-3 space-y-1.5">
          {q.options.map((opt, i) => {
            const letter = 'ABCD'[i];
            const isCorrect = letter === q.answer;
            return (
              <div key={letter} className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs ${
                isCorrect ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' : 'text-slate-400'
              }`}>
                <span className={`font-bold shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-slate-500'}`}>{letter}.</span>
                <span>{opt}</span>
                {isCorrect && <span className="ml-auto shrink-0">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
