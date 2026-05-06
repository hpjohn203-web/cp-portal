import { useMemo, useState } from 'react';
import questions from '../data/questions.json';
import { useProgress } from '../hooks/useProgress';

function exportCSV(progress, topicStats) {
  const lines = ['Topic,Attempted,Total,Correct,Accuracy%'];
  for (const [topic, s] of Object.entries(topicStats)) {
    const pct = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
    lines.push(`"${topic}",${s.attempted},${s.total},${s.correct},${pct}`);
  }
  lines.push('', 'Date,Topic,Score,Total,Accuracy%');
  for (const s of progress.sessionHistory) {
    const pct = Math.round((s.score / s.total) * 100);
    lines.push(`"${new Date(s.date).toLocaleDateString()}","${s.topic}",${s.score},${s.total},${pct}`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cp-progress-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Results({ onNavigate }) {
  const { progress, getTopicStats } = useProgress();
  const topicStats = useMemo(() => getTopicStats(questions), [progress]);
  const [detailSession, setDetailSession] = useState(null);

  const totalAnswered = Object.values(progress.cardStats).reduce((a, s) => a + s.correct + s.wrong, 0);
  const totalCorrect  = Object.values(progress.cardStats).reduce((a, s) => a + s.correct, 0);
  const overallPct    = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const attempted = Object.entries(topicStats)
    .filter(([, s]) => s.attempted > 0)
    .map(([topic, s]) => ({
      topic,
      pct:      Math.round((s.correct / s.attempted) * 100),
      attempted: s.attempted,
      total:     s.total,
      correct:   s.correct,
    }))
    .sort((a, b) => a.pct - b.pct);

  const weak       = attempted.filter(t => t.pct < 60).slice(0, 5);
  const strong     = attempted.filter(t => t.pct >= 80).slice(-5).reverse();
  const notStarted = Object.entries(topicStats).filter(([, s]) => s.attempted === 0).map(([t]) => t).slice(0, 5);
  const recentSessions = progress.sessionHistory.slice(0, 10);

  if (totalAnswered === 0) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-5xl mb-4">📊</p>
        <h2 className="text-xl font-bold mb-2">No Activity Yet</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Start studying to see your progress here.</p>
        <button onClick={() => onNavigate('study')} className="bg-amber-500 text-slate-900 font-bold px-8 py-3 rounded-2xl active:scale-95 transition-all">
          Start Studying
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">My Progress</h1>
        <button
          onClick={() => exportCSV(progress, topicStats)}
          className="flex items-center gap-2 text-xs bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-slate-300 px-3 py-2 rounded-xl transition-colors"
        >
          <span>⬇️</span> Export CSV
        </button>
      </div>

      {/* Overall stats */}
      <div className="bg-slate-800 rounded-3xl p-6 text-center mb-6 lg:flex lg:items-center lg:text-left lg:gap-8">
        <div className="lg:shrink-0">
          <div className="text-5xl font-black mb-1">
            <span className={overallPct >= 80 ? 'text-emerald-400' : overallPct >= 60 ? 'text-amber-400' : 'text-red-400'}>{overallPct}%</span>
          </div>
          <p className="text-slate-400 text-sm">Overall Accuracy</p>
          <p className="text-xs text-slate-500 mt-1">{totalCorrect} correct / {totalAnswered} answered</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 lg:mt-0 lg:flex-1">
          <MiniStat label="Studied"  value={Object.keys(progress.cardStats).length} />
          <MiniStat label="Total Qs" value={questions.length} />
          <MiniStat label="Sessions" value={progress.sessionHistory.length} />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Left column */}
        <div className="space-y-6">
          {weak.length > 0 && (
            <Section title="⚠️ Weak Areas — Focus Here">
              {weak.map(t => <TopicBar key={t.topic} {...t} />)}
              <button onClick={() => onNavigate('quiz')}
                className="w-full mt-3 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50 text-red-400 text-sm font-semibold py-3 rounded-xl active:scale-95 transition-all">
                Quiz on Weak Topics →
              </button>
            </Section>
          )}

          {strong.length > 0 && (
            <Section title="✅ Strong Areas">
              {strong.map(t => <TopicBar key={t.topic} {...t} />)}
            </Section>
          )}

          {notStarted.length > 0 && (
            <Section title="📚 Not Yet Started">
              <div className="space-y-1">
                {notStarted.map(t => (
                  <div key={t} className="text-sm text-slate-400 bg-slate-900/60 rounded-xl px-3 py-2">{t}</div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right column — Session history */}
        {recentSessions.length > 0 && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <Section title="📋 Session History">
              <div className="space-y-2 lg:max-h-[520px] lg:overflow-y-auto lg:pr-1 scrollbar-hide">
                {progress.sessionHistory.map((s, i) => {
                  const pct = Math.round((s.score / s.total) * 100);
                  const detail = (progress.sessionDetails || [])[i];
                  return (
                    <button
                      key={i}
                      onClick={() => detail?.questions?.length ? setDetailSession(detail) : null}
                      className={`w-full flex items-center justify-between bg-slate-900/60 rounded-xl px-3 py-2.5 text-left ${detail?.questions?.length ? 'hover:bg-slate-700/60 transition-colors cursor-pointer' : ''}`}
                    >
                      <div>
                        <p className="text-sm font-medium">{s.topic}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(s.date).toLocaleDateString()} · {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {detail?.questions?.length ? <span className="ml-1 text-amber-400/70">View →</span> : null}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
                        <p className="text-xs text-slate-400">{s.score}/{s.total}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>
        )}
      </div>

      {/* Session detail modal */}
      {detailSession && (
        <SessionDetailModal session={detailSession} onClose={() => setDetailSession(null)} />
      )}
    </div>
  );
}

function SessionDetailModal({ session, onClose }) {
  const pct = Math.round((session.score / session.total) * 100);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end lg:items-center lg:justify-center p-0 lg:p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-t-3xl lg:rounded-3xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <p className="font-bold">{session.topic}</p>
            <p className="text-xs text-slate-400">
              {new Date(session.date).toLocaleDateString()} · {session.score}/{session.total} ({pct}%)
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl p-1">✕</button>
        </div>

        {/* Questions list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {(session.questions || []).map((q, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 border ${
              q.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-2">
                <span className={`text-sm font-bold shrink-0 mt-0.5 ${q.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {q.correct ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-1">{q.topic}</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{q.question}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg">
                      ✓ {q.answer}. {q.correctText}
                    </span>
                    {!q.correct && q.selected && (
                      <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-lg">
                        ✗ {q.selected}. selected
                      </span>
                    )}
                    {!q.correct && !q.selected && (
                      <span className="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-lg">Timed out</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-700 rounded-xl py-2 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 lg:p-5">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TopicBar({ topic, pct, attempted, total }) {
  const color     = pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="bg-slate-900/60 rounded-xl px-3 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm flex-1 min-w-0 truncate pr-3">{topic}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{attempted}/{total}</span>
          <span className={`text-sm font-bold ${textColor}`}>{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full progress-bar-fill`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
