import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cp_progress';

const defaultProgress = () => ({
  cardStats: {},
  sessionHistory: [],
  errorLog: [],
  bookmarks: {},
  examDate: null,
  sessionDetails: [],
  studyPlan: { goalPerDay: 20, plannedDays: {} },
  dailyActivity: {},
});

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : defaultProgress();
      return { ...defaultProgress(), ...parsed, studyPlan: { ...defaultProgress().studyPlan, ...(parsed.studyPlan || {}) } };
    } catch { return defaultProgress(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function recordAnswer(questionId, correct) {
    setProgress(prev => {
      const stats = prev.cardStats[questionId] || { correct: 0, wrong: 0, interval: 1 };
      const newInterval = correct ? Math.min(stats.interval * 2, 64) : 1;
      const today = new Date().toDateString();
      const daily = { ...(prev.dailyActivity || {}) };
      daily[today] = (daily[today] || 0) + 1;
      return {
        ...prev,
        cardStats: {
          ...prev.cardStats,
          [questionId]: {
            correct: correct ? stats.correct + 1 : stats.correct,
            wrong: correct ? stats.wrong : stats.wrong + 1,
            interval: newInterval,
            nextDue: Date.now() + newInterval * 24 * 60 * 60 * 1000,
          },
        },
        dailyActivity: daily,
      };
    });
  }

  function getTodayCount() {
    const today = new Date().toDateString();
    return (progress.dailyActivity || {})[today] || 0;
  }

  function addToErrorLog(question, selectedAnswer) {
    setProgress(prev => ({
      ...prev,
      errorLog: [
        {
          questionId: question.id, question: question.question, topic: question.topic,
          correctAnswer: question.answer, correctText: question.options['ABCD'.indexOf(question.answer)],
          selectedAnswer, selectedText: selectedAnswer ? question.options['ABCD'.indexOf(selectedAnswer)] : 'No answer (timed out)',
          date: new Date().toISOString(),
        },
        ...(prev.errorLog || []).slice(0, 299),
      ],
    }));
  }

  function clearErrorLog() {
    setProgress(prev => ({ ...prev, errorLog: [] }));
  }

  function saveSession(score, total, topic, questionResults) {
    const session = { date: new Date().toISOString(), score, total, topic };
    setProgress(prev => ({
      ...prev,
      sessionHistory: [session, ...prev.sessionHistory.slice(0, 49)],
      sessionDetails: [
        { ...session, questions: questionResults || [] },
        ...(prev.sessionDetails || []).slice(0, 19),
      ],
    }));
  }

  function toggleBookmark(questionId) {
    setProgress(prev => {
      const bm = { ...(prev.bookmarks || {}) };
      if (bm[questionId]) delete bm[questionId];
      else bm[questionId] = true;
      return { ...prev, bookmarks: bm };
    });
  }

  function isBookmarked(questionId) {
    return !!(progress.bookmarks || {})[questionId];
  }

  function setExamDate(date) {
    setProgress(prev => ({ ...prev, examDate: date }));
  }

  function setGoalPerDay(n) {
    setProgress(prev => ({ ...prev, studyPlan: { ...prev.studyPlan, goalPerDay: n } }));
  }

  function togglePlannedDay(dateKey) {
    setProgress(prev => {
      const planned = { ...(prev.studyPlan?.plannedDays || {}) };
      if (planned[dateKey]) delete planned[dateKey];
      else planned[dateKey] = true;
      return { ...prev, studyPlan: { ...prev.studyPlan, plannedDays: planned } };
    });
  }

  function getTopicStats(questions) {
    const byTopic = {};
    for (const q of questions) {
      const t = q.topic || 'General';
      if (!byTopic[t]) byTopic[t] = { total: 0, attempted: 0, correct: 0 };
      byTopic[t].total++;
      const stats = progress.cardStats[q.id];
      if (stats && (stats.correct + stats.wrong) > 0) {
        byTopic[t].attempted++;
        byTopic[t].correct += stats.correct > 0 ? 1 : 0;
      }
    }
    return byTopic;
  }

  function getDueQuestions(questions) {
    const now = Date.now();
    return questions.filter(q => {
      const stats = progress.cardStats[q.id];
      return !stats || stats.nextDue <= now;
    });
  }

  function getStudyStreak() {
    if (!progress.sessionHistory.length) return 0;
    const days = new Set(progress.sessionHistory.map(s => new Date(s.date).toDateString()));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (days.has(d.toDateString())) streak++;
      else if (i > 0) break;
    }
    return streak;
  }

  function getMasteredTopics(questions) {
    const stats = getTopicStats(questions);
    return Object.entries(stats)
      .filter(([, s]) => s.attempted >= 3 && Math.round((s.correct / s.attempted) * 100) >= 80)
      .map(([topic]) => topic);
  }

  function resetProgress() { setProgress(defaultProgress()); }

  return {
    progress, recordAnswer, addToErrorLog, clearErrorLog, saveSession,
    toggleBookmark, isBookmarked, setExamDate, setGoalPerDay, togglePlannedDay,
    getTopicStats, getDueQuestions, getStudyStreak, getMasteredTopics, getTodayCount, resetProgress,
  };
}
