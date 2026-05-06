import { useMemo } from 'react';
import { useProgress } from '../hooks/useProgress';


function getWeekDays(offset = 0) {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + offset * 7);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

const GOAL_OPTIONS = [10, 20, 30, 50, 100];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StudyPlanner({ onNavigate }) {
  const { progress, setGoalPerDay, togglePlannedDay, getStudyStreak, getTodayCount } = useProgress();
  const plan = progress.studyPlan || { goalPerDay: 20, plannedDays: {} };
  const streak = getStudyStreak();

  const weekDays = getWeekDays(0);
  const today = new Date();
  const todayKey = dateKey(today);

  const studiedDays = useMemo(() => {
    const days = new Set();
    for (const s of progress.sessionHistory) {
      days.add(new Date(s.date).toISOString().slice(0, 10));
    }
    return days;
  }, [progress.sessionHistory]);

  const weekStats = useMemo(() => {
    let studied = 0, planned = 0;
    for (const d of weekDays) {
      const k = dateKey(d);
      if (studiedDays.has(k)) studied++;
      if (plan.plannedDays?.[k]) planned++;
    }
    const weekSessions = progress.sessionHistory.filter(s => {
      const d = new Date(s.date);
      return d >= weekDays[0] && d <= weekDays[6];
    });
    const weekQuestions = weekSessions.reduce((a, s) => a + s.total, 0);
    const weekCorrect = weekSessions.reduce((a, s) => a + s.score, 0);
    return { studied, planned, weekQuestions, weekCorrect };
  }, [weekDays, studiedDays, plan.plannedDays, progress.sessionHistory]);

  const todayQuestions = getTodayCount();
  const goalProgress = Math.min(Math.round((todayQuestions / plan.goalPerDay) * 100), 100);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>
      <h1 className="text-xl lg:text-2xl font-bold mb-1">Study Planner</h1>
      <p className="text-sm text-slate-400 mb-6">Track your study schedule and daily goals</p>

      {/* Streak + weekly overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Study Streak" value={`${streak} day${streak !== 1 ? 's' : ''}`} icon="🔥" color="amber" />
        <StatCard label="This Week" value={`${weekStats.studied}/7 days`} icon="📅" color="sky" />
        <StatCard label="Week Questions" value={weekStats.weekQuestions} icon="❓" color="emerald" />
        <StatCard label="Week Accuracy" value={weekStats.weekQuestions > 0 ? `${Math.round((weekStats.weekCorrect / weekStats.weekQuestions) * 100)}%` : '—'} icon="🎯" color="violet" />
      </div>

      {/* Today's goal */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Today's Goal</h2>
          <span className="text-xs text-slate-400">{todayKey}</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>{todayQuestions} / {plan.goalPerDay} questions</span>
              <span className={goalProgress >= 100 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{goalProgress}%</span>
            </div>
            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full progress-bar-fill ${goalProgress >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
          {goalProgress >= 100 && <span className="text-2xl">🏆</span>}
        </div>
        <p className="text-xs text-slate-500 mb-4">Daily target: <span className="text-amber-400 font-semibold">{plan.goalPerDay} questions</span></p>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map(n => (
            <button key={n} onClick={() => setGoalPerDay(n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${plan.goalPerDay === n ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {n} Qs
            </button>
          ))}
        </div>
      </div>

      {/* Weekly calendar */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-6">
        <h2 className="font-semibold mb-4">This Week</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const k = dateKey(day);
            const isToday = k === todayKey;
            const hasStudied = studiedDays.has(k);
            const isPlanned = plan.plannedDays?.[k];
            const isPast = day < today && !isToday;
            return (
              <button
                key={k}
                onClick={() => togglePlannedDay(k)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  isToday
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : isPlanned
                    ? 'bg-slate-700 border border-slate-600'
                    : 'bg-slate-750 border border-transparent hover:border-slate-600'
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? 'text-amber-400' : 'text-slate-400'}`}>{DAY_LABELS[i]}</span>
                <span className={`text-sm font-bold ${isToday ? 'text-amber-300' : 'text-slate-300'}`}>{day.getDate()}</span>
                <div className="h-2 w-2 rounded-full">
                  {hasStudied
                    ? <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    : isPast && isPlanned
                    ? <div className="h-2 w-2 rounded-full bg-red-400" />
                    : isPlanned
                    ? <div className="h-2 w-2 rounded-full bg-amber-400/60" />
                    : <div className="h-2 w-2 rounded-full bg-transparent" />
                  }
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Studied</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400/60 inline-block" />Planned</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Missed</span>
          <span className="ml-auto italic">Tap day to plan</span>
        </div>
      </div>

      {/* Recent sessions */}
      {progress.sessionHistory.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">Recent Sessions</h2>
          <div className="space-y-2">
            {progress.sessionHistory.slice(0, 5).map((s, i) => {
              const pct = Math.round((s.score / s.total) * 100);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{s.topic}</p>
                    <p className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString()} · {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
                    <p className="text-xs text-slate-400">{s.score}/{s.total}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={() => onNavigate('quiz')} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-2xl active:scale-95 transition-all">
          Start Studying
        </button>
        <button onClick={() => onNavigate('results')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3.5 rounded-2xl active:scale-95 transition-all">
          View Progress
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = { amber: 'text-amber-400', sky: 'text-sky-400', emerald: 'text-emerald-400', violet: 'text-violet-400' };
  return (
    <div className="bg-slate-800 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <p className={`text-lg font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
