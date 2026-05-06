import { useState, useMemo } from 'react';
import { useProgress } from '../hooks/useProgress';

export default function ErrorLog({ onNavigate }) {
  const { progress, clearErrorLog } = useProgress();
  const errorLog = progress.errorLog || [];
  const [topicFilter, setTopicFilter] = useState('All');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const topics = useMemo(() => {
    const set = new Set(errorLog.map(e => e.topic));
    return ['All', ...Array.from(set).sort()];
  }, [errorLog]);

  const filtered = topicFilter === 'All' ? errorLog : errorLog.filter(e => e.topic === topicFilter);

  const topicCounts = useMemo(() => {
    const counts = {};
    for (const e of errorLog) {
      counts[e.topic] = (counts[e.topic] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [errorLog]);

  if (errorLog.length === 0) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-5xl mb-4">✅</p>
        <h2 className="text-xl font-bold mb-2">Error Log is Empty</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Wrong answers from timed quizzes appear here for review.</p>
        <button onClick={() => onNavigate('quiz')} className="bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-2xl active:scale-95 transition-all">
          Start a Quiz
        </button>
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
          <h1 className="text-xl lg:text-2xl font-bold">Error Log</h1>
          <p className="text-sm text-slate-400 mt-0.5">{errorLog.length} mistakes recorded</p>
        </div>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-xs text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Weak topics summary */}
      {topicCounts.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Most Mistakes By Topic</h2>
          <div className="space-y-2">
            {topicCounts.slice(0, 5).map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 flex-1 truncate">{topic}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${(count / topicCounts[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-red-400 font-bold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              topicFilter === t ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t}{t !== 'All' && ` (${errorLog.filter(e => e.topic === t).length})`}
          </button>
        ))}
      </div>

      {/* Error entries */}
      <div className="space-y-3">
        {filtered.map((entry, i) => (
          <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{entry.topic}</span>
              <span className="text-xs text-slate-500 shrink-0">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed mb-3">{entry.question}</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs">
                <span className="text-emerald-400 font-bold shrink-0">✓ Correct:</span>
                <span className="text-emerald-300">{entry.correctAnswer}. {entry.correctText}</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-red-400 font-bold shrink-0">✗ You chose:</span>
                <span className="text-red-300">{entry.selectedAnswer ? `${entry.selectedAnswer}. ${entry.selectedText}` : entry.selectedText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button onClick={() => onNavigate('quiz')} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-2xl active:scale-95 transition-all">
          Practice Again
        </button>
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-slate-800 rounded-3xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Clear Error Log?</h3>
            <p className="text-sm text-slate-400 mb-5">This will permanently delete all {errorLog.length} logged mistakes.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-slate-700 text-slate-200 font-semibold py-3 rounded-2xl">Cancel</button>
              <button onClick={() => { clearErrorLog(); setShowClearConfirm(false); }} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
