import { useState, useMemo } from 'react';
import questions from '../data/questions.json';
import { useProgress } from '../hooks/useProgress';

export default function Bookmarks({ onNavigate }) {
  const { progress, toggleBookmark } = useProgress();
  const bookmarks = progress.bookmarks || {};
  const [expanded, setExpanded] = useState(null);

  const bookmarked = useMemo(() =>
    questions.filter(q => bookmarks[q.id]),
    [bookmarks]
  );

  if (bookmarked.length === 0) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-5xl mb-4">🔖</p>
        <h2 className="text-xl font-bold mb-2">No Bookmarks Yet</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Star questions during flashcards or quiz to save them here.</p>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('study')} className="bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-2xl active:scale-95 transition-all text-sm">Flashcards</button>
          <button onClick={() => onNavigate('quiz')} className="bg-slate-800 text-slate-200 font-semibold px-5 py-2.5 rounded-2xl active:scale-95 transition-all text-sm">Quiz Mode</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Bookmarks</h1>
          <p className="text-sm text-slate-400 mt-0.5">{bookmarked.length} saved question{bookmarked.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-3">
        {bookmarked.map(q => (
          <div key={q.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              className="w-full px-4 py-3.5 text-left flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <span className="text-xs text-amber-400 font-semibold">{q.topic}</span>
                <p className="text-sm text-slate-200 mt-0.5 leading-relaxed line-clamp-2">{q.question}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); toggleBookmark(q.id); }}
                  className="text-amber-400 hover:text-slate-400 transition-colors p-1"
                  title="Remove bookmark"
                >
                  🔖
                </button>
                <span className="text-slate-500">{expanded === q.id ? '▲' : '▼'}</span>
              </div>
            </button>
            {expanded === q.id && (
              <div className="px-4 pb-4 space-y-2 border-t border-slate-700 pt-3">
                <p className="text-sm text-slate-200 leading-relaxed mb-3">{q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, i) => {
                    const letter = 'ABCD'[i];
                    const isCorrect = letter === q.answer;
                    return (
                      <div key={letter} className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs ${
                        isCorrect ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        <span className={`font-bold shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-slate-500'}`}>{letter}.</span>
                        <span>{opt}</span>
                        {isCorrect && <span className="ml-auto shrink-0 text-emerald-400">✓</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="bg-slate-700/40 rounded-xl p-3 mt-2">
                    <p className="text-xs text-slate-400 font-semibold mb-1">Explanation</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
