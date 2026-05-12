import { useMemo, useState } from 'react';
import questions from '../data/questions.json';
import { FLASHCARDS } from '../data/flashcards.js';
import { GLOSSARY } from '../data/glossary.js';
import { useProgress } from '../hooks/useProgress';

const TOTAL_CONTENT = FLASHCARDS.length + questions.length;

const HOW_TO_ITEMS = [
  { icon: '🃏', title: 'Flashcards', desc: '1,000 open-answer flashcards across all CP domains. Spaced repetition ensures cards you struggle with come back sooner.' },
  { icon: '⏱️', title: 'Quiz Mode', desc: 'Timed MCQ practice with 120 exam-style questions. Choose topic, count, and timer. Answers revealed at end with full breakdown.' },
  { icon: '📝', title: 'Full Exam', desc: '120-question, 150-minute simulation of the real Certified Paralegal exam. Navigate freely, flag questions, submit when ready.' },
  { icon: '🎯', title: 'Drill Weak Topics', desc: 'Appears on the dashboard once enough data exists. One tap auto-starts a quiz on your 3 lowest-accuracy topics.' },
  { icon: '📊', title: 'My Progress', desc: 'Full accuracy breakdown by topic, session history, and CSV export for offline review.' },
  { icon: '📖', title: 'Glossary', desc: 'Searchable key legal definitions across all CP exam domains — civil procedure, contracts, torts, ethics, and more.' },
  { icon: '🧮', title: 'Formulas', desc: 'Reference equations with variables, notes and worked examples.' },
  { icon: '🖼️', title: 'Diagrams', desc: 'Visual references for court hierarchies, litigation flow, contract elements, and key legal concepts.' },
  { icon: '📅', title: 'Study Planner', desc: 'Set your exam date, daily goal, and mark planned study days on the weekly calendar.' },
  { icon: '⚠️', title: 'Error Log', desc: 'Every wrong quiz answer is logged here by topic for targeted review.' },
  { icon: '🔖', title: 'Bookmarks', desc: 'Save any question during flashcards or quiz — review them anytime in Bookmarks.' },
];

const TOPIC_ICONS = {
  'Civil Procedure': '🏛️', 'Jurisdiction': '🏛️', 'Federal': '🏛️', 'Court': '🏛️',
  'Contract': '📝', 'UCC': '📝', 'Offer': '📝', 'Consideration': '📝',
  'Tort': '⚖️', 'Negligence': '⚖️', 'Liability': '⚖️', 'Damages': '⚖️',
  'Ethics': '🛡️', 'Professional': '🛡️', 'Conduct': '🛡️', 'ABA': '🛡️',
  'Criminal': '🔒', 'Procedure': '🔒', 'Evidence': '🔒', 'Constitutional': '🔒',
  'Property': '🏠', 'Real': '🏠', 'Easement': '🏠', 'Landlord': '🏠',
  'Business': '💼', 'Corporation': '💼', 'Partnership': '💼', 'LLC': '💼',
  'Family': '👨‍👩‍👧', 'Domestic': '👨‍👩‍👧', 'Probate': '👨‍👩‍👧',
  'Administrative': '📋', 'Regulation': '📋', 'Agency': '📋',
  'Legal': '⚖️', 'Law': '⚖️', 'Rights': '⚖️',
};

function getIcon(topic) {
  for (const [key, icon] of Object.entries(TOPIC_ICONS)) {
    if (topic.includes(key)) return icon;
  }
  return '📚';
}

export default function Home({ onNavigate }) {
  const { progress, getTopicStats, getStudyStreak, getMasteredTopics, getTodayCount, resetProgress } = useProgress();
  const topicStats = useMemo(() => getTopicStats(questions), [progress]);
  const masteredTopics = useMemo(() => getMasteredTopics(questions), [progress]);
  const streak = getStudyStreak();
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('cp_welcome_shown'));
  function dismissWelcome() { sessionStorage.setItem('cp_welcome_shown', '1'); setShowWelcome(false); }

  const todayCount = getTodayCount();
  const goalPerDay = progress.studyPlan?.goalPerDay || 20;
  const goalPct = Math.min(100, Math.round((todayCount / goalPerDay) * 100));
  const goalMet = todayCount >= goalPerDay;
  const dailyVocab = GLOSSARY[Math.floor(Date.now() / 86400000) % GLOSSARY.length];
  const weakTopics = useMemo(() =>
    Object.entries(topicStats)
      .filter(([, s]) => s.attempted >= 3 && Math.round((s.correct / s.attempted) * 100) < 60)
      .sort((a, b) => (a[1].correct / a[1].attempted) - (b[1].correct / b[1].attempted))
      .slice(0, 3)
      .map(([t]) => t),
    [topicStats]
  );

  const daysToExam = useMemo(() => {
    if (!progress.examDate) return null;
    return Math.ceil((new Date(progress.examDate) - new Date()) / (1000 * 60 * 60 * 24));
  }, [progress.examDate]);

  const totalAttempted = Object.values(progress.cardStats).filter(s => (s.correct + s.wrong) > 0).length;
  const totalCorrect = Object.values(progress.cardStats).reduce((acc, s) => acc + s.correct, 0);
  const totalAnswered = Object.values(progress.cardStats).reduce((acc, s) => acc + s.correct + s.wrong, 0);
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const errorCount = (progress.errorLog || []).length;

  const topics = Object.entries(topicStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 20);

  const recentSessions = progress.sessionHistory.slice(0, 3);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto">

      {/* Welcome modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6" onClick={dismissWelcome}>
          <div className="bg-slate-900 border border-slate-700 rounded-t-3xl lg:rounded-3xl w-full lg:max-w-2xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">ApexCert Publications</p>
                <h2 className="text-xl lg:text-2xl font-bold">Welcome to CP Exam Prep! 👋</h2>
                <p className="text-sm text-slate-400 mt-1">Here's everything this portal gives you:</p>
              </div>
              <button onClick={dismissWelcome} className="text-slate-400 hover:text-slate-200 text-xl p-1 shrink-0 mt-1">✕</button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {HOW_TO_ITEMS.map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-3 bg-slate-800/60 rounded-2xl p-3">
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-slate-100">{title}</p>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-3">
              <div className="bg-slate-800 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-300">Navigation:</strong> Use the <span className="text-amber-400 font-bold">sidebar</span> on desktop or tap <span className="text-amber-400 font-bold">☰</span> on mobile to switch between sections. Tap <span className="text-amber-400 font-bold">? Help</span> on the dashboard to reopen this guide anytime.
              </div>
              <button onClick={dismissWelcome} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-2xl transition-colors active:scale-95">
                Let's Get Started 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam countdown banner */}
      {daysToExam !== null && (
        <div className={`mb-5 rounded-2xl px-4 py-3 flex items-center gap-3 ${
          daysToExam <= 0 ? 'bg-emerald-500/15 border border-emerald-500/30' :
          daysToExam <= 7  ? 'bg-red-500/15 border border-red-500/30' :
          daysToExam <= 30 ? 'bg-amber-500/15 border border-amber-500/30' :
                             'bg-sky-500/15 border border-sky-500/30'
        }`}>
          <span className="text-2xl">{daysToExam <= 0 ? '🎓' : daysToExam <= 7 ? '🚨' : '📅'}</span>
          <div className="flex-1 min-w-0">
            {daysToExam <= 0
              ? <p className="font-bold text-sm text-emerald-300">Exam day — good luck! 🎉</p>
              : <p className="font-bold text-sm">
                  <span className={daysToExam <= 7 ? 'text-red-300' : daysToExam <= 30 ? 'text-amber-300' : 'text-sky-300'}>
                    {daysToExam} day{daysToExam !== 1 ? 's' : ''}
                  </span>
                  {' '}until your exam
                </p>
            }
            <p className="text-xs text-slate-400">
              {new Date(progress.examDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={() => onNavigate('planner')} className="text-xs text-slate-400 hover:text-slate-200 shrink-0">Edit →</button>
        </div>
      )}

{/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">Certified Paralegal</h1>
          <p className="text-slate-400 text-sm mt-1">CP Exam Prep Portal · ApexCert Publications</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWelcome(true)} className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-600 px-2.5 py-1.5 rounded-lg transition-colors">? Help</button>
          <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">{FLASHCARDS.length.toLocaleString()} Flashcards · {questions.length} Exam Qs</span>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-amber-400">Certified Paralegal</h1>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">{FLASHCARDS.length.toLocaleString()} Cards · {questions.length} Qs</span>
        </div>
        <p className="text-slate-400 text-sm">CP Exam Prep Portal · ApexCert Publications</p>
      </div>

      {/* Mastery badges */}
      {masteredTopics.length > 0 && (
        <div className="mb-5 bg-slate-800/50 border border-amber-500/20 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">🏆 Mastered Topics</p>
          <div className="flex flex-wrap gap-2">
            {masteredTopics.map(t => (
              <span key={t} className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                ⭐ {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Desktop: 2-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">

        {/* Left column */}
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="Studied"  value={totalAttempted} sub={`of ${questions.length} MCQ`} color="amber" />
            <StatCard label="Accuracy" value={`${overallPct}%`} color="emerald" />
            <StatCard label="Sessions" value={progress.sessionHistory.length} color="sky" />
            <StatCard label="Streak"   value={`${streak}d`} color="violet" />
          </div>

          {/* Today's Goal */}
          <div className="bg-slate-800 rounded-2xl px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{goalMet ? '✅' : '🎯'}</span>
                <p className="text-sm font-semibold">Today's Goal</p>
              </div>
              <button onClick={() => onNavigate('planner')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {goalPerDay} Qs/day ›
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full progress-bar-fill ${goalMet ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${goalPct}%` }} />
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ${goalMet ? 'text-emerald-400' : 'text-amber-400'}`}>{todayCount}/{goalPerDay}</span>
            </div>
            <p className="text-xs mt-1.5 text-slate-500">
              {goalMet ? '🎉 Goal complete! Keep the momentum going.' : todayCount === 0 ? 'Start studying to track today\'s progress.' : `${goalPerDay - todayCount} more question${goalPerDay - todayCount !== 1 ? 's' : ''} to reach your goal.`}
            </p>
          </div>

          {/* Drill Weak Topics */}
          {weakTopics.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Smart Practice</h2>
              <button
                onClick={() => { sessionStorage.setItem('drillWeakTopics', JSON.stringify(weakTopics)); onNavigate('quiz'); }}
                className="w-full bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/15 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-red-300">Drill Weak Topics</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">Focus: {weakTopics.join(' · ')}</p>
                  </div>
                  <span className="shrink-0 text-xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full">{weakTopics.length} topic{weakTopics.length > 1 ? 's' : ''}</span>
                </div>
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Start</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <ActionBtn icon="🃏" label="Flashcards"    sub="Flip to reveal"   color="amber"   onClick={() => onNavigate('study')} />
              <ActionBtn icon="⏱️" label="Quiz Mode"     sub="Timed MCQ"        color="sky"     onClick={() => onNavigate('quiz')} />
              <ActionBtn icon="📝" label="Full Exam"     sub="120q · 150 min"   color="rose"    onClick={() => onNavigate('exam')} />
              <ActionBtn icon="📊" label="My Progress"   sub="Stats & analysis" color="emerald" onClick={() => onNavigate('results')} />
              <ActionBtn icon="📹" label="Video Library" sub="Topic videos"     color="violet"  onClick={() => onNavigate('videos')} />
              <ActionBtn icon="📅" label="Study Planner" sub="Plan your week"   color="slate"   onClick={() => onNavigate('planner')} />
              <ActionBtn
                icon="⚠️"
                label="Error Log"
                sub={errorCount > 0 ? `${errorCount} to review` : 'Quiz mistakes'}
                color={errorCount > 0 ? 'orange' : 'slate'}
                onClick={() => onNavigate('errorlog')}
              />
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Reference</h2>
            <div className="grid grid-cols-3 gap-3">
              <ResourceBtn icon="📖" label="Glossary" onClick={() => onNavigate('glossary')} />
              <ResourceBtn icon="🧮" label="Formulas" onClick={() => onNavigate('formulas')} />
              <ResourceBtn icon="🖼️" label="Diagrams" onClick={() => onNavigate('diagrams')} />
            </div>
          </div>

          {/* Daily Vocab */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">📖</span>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Term</p>
              <span className="ml-auto text-xs text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">{dailyVocab.topic}</span>
            </div>
            <p className="font-bold text-sm text-amber-300 mb-1">{dailyVocab.term}</p>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{dailyVocab.definition}</p>
            <button onClick={() => onNavigate('glossary')} className="text-xs text-amber-400 hover:underline mt-2 block">View full glossary →</button>
          </div>

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Sessions</h2>
              <div className="space-y-2">
                {recentSessions.map((s, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s.topic}</p>
                      <p className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-400">{s.score}/{s.total}</p>
                      <p className="text-xs text-slate-400">{Math.round((s.score / s.total) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rate & Review widget */}
          <button
            onClick={() => onNavigate('contact')}
            className="w-full bg-amber-500/10 border border-amber-500/25 hover:border-amber-500/50 hover:bg-amber-500/15 rounded-2xl px-4 py-4 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-amber-300">Enjoying the portal?</p>
                <p className="text-xs text-slate-400 mt-0.5">Share your experience — it takes less than a minute.</p>
              </div>
              <span className="text-slate-500 text-xs shrink-0">Rate →</span>
            </div>
          </button>
        </div>

        {/* Right column — Topics */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-6 lg:mt-0">Topics</h2>
          <div className="space-y-2">
            {topics.map(([topic, stats]) => {
              const pct = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
              const prog = Math.round((stats.attempted / stats.total) * 100);
              const mastered = masteredTopics.includes(topic);
              return (
                <div key={topic} className={`bg-slate-800 rounded-xl px-4 py-3 ${mastered ? 'border border-amber-500/25' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getIcon(topic)}</span>
                      <span className="text-sm font-medium truncate max-w-[155px]">{topic}</span>
                      {mastered && <span className="text-xs shrink-0">⭐</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{stats.attempted}/{stats.total}</span>
                      {stats.attempted > 0 && (
                        <span className={`text-xs font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full progress-bar-fill" style={{ width: `${prog}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }}
            className="w-full text-xs text-slate-600 hover:text-slate-400 py-4 mt-2 transition-colors"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  const colors = { amber: 'text-amber-400', emerald: 'text-emerald-400', sky: 'text-sky-400', violet: 'text-violet-400' };
  return (
    <div className="bg-slate-800 rounded-xl p-3 text-center">
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function ActionBtn({ icon, label, sub, color, onClick }) {
  const colors = {
    amber:   'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10',
    sky:     'border-sky-500/30 hover:border-sky-500/60 hover:bg-sky-500/10',
    violet:  'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10',
    rose:    'border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/10',
    orange:  'border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/10',
    slate:   'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50',
  };
  return (
    <button onClick={onClick} className={`bg-slate-800 border ${colors[color]} rounded-2xl p-4 text-left transition-all active:scale-95`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </button>
  );
}

function ResourceBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-750 rounded-xl p-3 text-center transition-all active:scale-95 w-full">
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xs font-medium text-slate-300">{label}</p>
    </button>
  );
}
