import { useState, useEffect, useRef } from 'react';
import questions from '../data/questions.json';
import { useProgress } from '../hooks/useProgress';
import ReviewNudge, { checkAndIncrementNudge } from './ReviewNudge';

const EXAM_Q = 120;
const EXAM_MINS = 150;
const EXAM_SECS = EXAM_MINS * 60;
const EXAM_NAME = 'Certified Paralegal (CP) Exam Simulation';

export default function ExamMode({ onNavigate }) {
  const { recordAnswer, saveSession, addToErrorLog } = useProgress();
  const [phase, setPhase] = useState('advisory');
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_SECS);
  const [reviewData, setReviewData] = useState([]);
  const [showNudge, setShowNudge] = useState(false);

  const quizRef = useRef([]);
  const selectedRef = useRef({});
  const timerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => { quizRef.current = quiz; }, [quiz]);
  useEffect(() => { selectedRef.current = selectedAnswers; }, [selectedAnswers]);

  function startExam() {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, EXAM_Q);
    setQuiz(shuffled);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlagged(new Set());
    setTimeLeft(EXAM_SECS);
    setPhase('exam');
  }

  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          doSubmit(quizRef.current, selectedRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function doSubmit(quizData, answersData) {
    const results = quizData.map((q, i) => {
      const sel = answersData[i] ?? null;
      const correct = sel === q.answer;
      recordAnswer(q.id, correct);
      if (!correct && sel) addToErrorLog(q, sel);
      return { question: q, selected: sel, correct };
    });
    const score = results.filter(r => r.correct).length;
    const questionResults = results.map(r => ({
      id: r.question.id, question: r.question.question, topic: r.question.topic,
      answer: r.question.answer, correctText: r.question.options['ABCD'.indexOf(r.question.answer)],
      selected: r.selected, correct: r.correct,
    }));
    saveSession(score, quizData.length, EXAM_NAME, questionResults);
    setReviewData(results);
    setPhase('review');
    if (checkAndIncrementNudge()) setShowNudge(true);
  }

  function handleSubmit() {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unanswered = quiz.length - answeredCount;
    const msg = unanswered > 0
      ? `You have ${unanswered} unanswered question${unanswered !== 1 ? 's' : ''}. Submit anyway?`
      : `Submit exam? You've answered all ${quiz.length} questions.`;
    if (!confirm(msg)) return;
    clearInterval(timerRef.current);
    doSubmit(quiz, selectedAnswers);
  }

  function toggleFlag(i) {
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const timerColor = timeLeft <= 300 ? 'text-red-400 animate-pulse' : timeLeft <= 600 ? 'text-amber-400' : 'text-slate-300';
  const answeredCount = Object.keys(selectedAnswers).length;

  if (phase === 'advisory') {
    return <AdvisoryScreen onStart={startExam} onBack={() => onNavigate('home')} />;
  }

  if (phase === 'review') {
    return (
      <>
        {showNudge && <ReviewNudge onClose={() => setShowNudge(false)} />}
        <ExamReviewScreen
          quiz={quiz}
          reviewData={reviewData}
          onRetry={startExam}
          onHome={() => onNavigate('home')}
          onResults={() => onNavigate('results')}
          onErrorLog={() => onNavigate('errorlog')}
        />
      </>
    );
  }

  const currentQ = quiz[currentIndex];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">

      {/* Header: timer + submit */}
      <div className="px-4 lg:px-6 py-3 border-b border-slate-800 bg-slate-950/50 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-slate-500">Full Exam · Q{currentIndex + 1}/{quiz.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">{answeredCount} answered · {quiz.length - answeredCount} remaining</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-mono font-bold ${timerColor}`}>{mins}:{secs}</p>
            <p className="text-xs text-slate-500">remaining</p>
          </div>
          <button onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors active:scale-95">
            Submit
          </button>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${(answeredCount / quiz.length) * 100}%` }} />
        </div>
      </div>

      {/* Question navigator */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
        <div className="flex gap-2 items-start">
          <div ref={gridRef} className="flex gap-1 flex-wrap max-h-[72px] overflow-y-auto scrollbar-hide flex-1">
            {quiz.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 text-xs rounded-lg font-semibold transition-colors shrink-0 ${
                  i === currentIndex ? 'bg-amber-500 text-slate-900'
                  : selectedAnswers[i] !== undefined
                  ? flagged.has(i) ? 'bg-amber-400/30 text-amber-300 ring-1 ring-amber-400/50' : 'bg-emerald-500/25 text-emerald-300'
                  : flagged.has(i) ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-800 text-slate-400'
                }`}>{i + 1}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex flex-col justify-between h-[72px] shrink-0 pl-1">
            <button onClick={() => gridRef.current?.scrollBy({ top: -36, behavior: 'smooth' })}
              className="text-slate-500 hover:text-slate-300 text-xs leading-none">▲</button>
            <button onClick={() => gridRef.current?.scrollBy({ top: 36, behavior: 'smooth' })}
              className="text-slate-500 hover:text-slate-300 text-xs leading-none">▼</button>
          </div>
        </div>
        <div className="flex gap-3 mt-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/25 inline-block" /> Answered</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/20 inline-block" /> Flagged</span>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{currentQ.topic}</span>
            <button onClick={() => toggleFlag(currentIndex)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${flagged.has(currentIndex) ? 'bg-amber-500/20 text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}>
              {flagged.has(currentIndex) ? '🚩 Flagged' : '⚑ Flag'}
            </button>
          </div>
          <p className="text-sm lg:text-base leading-relaxed mb-5 mt-1">{currentQ.question}</p>
          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const letter = 'ABCD'[i];
              const isSelected = selectedAnswers[currentIndex] === letter;
              return (
                <button key={letter}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentIndex]: letter }))}
                  className={`w-full text-left rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98] ${
                    isSelected ? 'bg-amber-500/20 border border-amber-500 text-amber-100'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-600'
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className={`font-bold text-sm shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>{letter}</span>
                    <span className="text-sm lg:text-base leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="px-4 lg:px-8 pb-3 pt-3 border-t border-slate-800 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-semibold py-3 rounded-2xl transition-colors active:scale-95">
            ← Previous
          </button>
          <button onClick={() => setCurrentIndex(i => Math.min(quiz.length - 1, i + 1))} disabled={currentIndex === quiz.length - 1}
            className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-900 font-bold py-3 rounded-2xl transition-colors active:scale-95">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function AdvisoryScreen({ onStart, onBack }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 shrink-0">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-200 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold">Full Exam Simulation</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Left: intro + readiness tip */}
        <div className="lg:flex-1 px-6 lg:px-12 py-8 flex flex-col justify-center items-center lg:items-start lg:border-r lg:border-slate-800">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2 text-center lg:text-left">{EXAM_NAME}</h2>
          <p className="text-slate-400 text-sm leading-relaxed text-center lg:text-left max-w-sm mb-6">
            Simulate real exam conditions. Find a quiet space and allow the full time.
          </p>
          <div className="w-full max-w-sm bg-violet-500/10 border border-violet-500/30 rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="text-xl shrink-0">💡</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-violet-300">Readiness tip:</strong> We recommend attempting this simulation only after you have studied the exam prep book thoroughly and feel confident across all domains. Use the flashcards, quiz mode, and glossary to reinforce your reading — then treat this full exam as your final check before the real thing.
            </p>
          </div>
        </div>

        {/* Right: exam details + begin */}
        <div className="lg:w-96 xl:w-[440px] px-6 lg:px-10 py-8 flex flex-col justify-center">
          <div className="space-y-3 mb-6">
            {[
              { icon: '📋', label: `${EXAM_Q} Questions`, desc: 'Randomly drawn from all domains' },
              { icon: '⏱️', label: `${EXAM_MINS} Minutes`, desc: 'Total countdown — auto-submits on expiry' },
              { icon: '🔀', label: 'Free Navigation', desc: 'Jump between questions, change answers anytime' },
              { icon: '🚩', label: 'Flag Questions', desc: 'Mark uncertain answers to revisit before submit' },
              { icon: '✅', label: 'Full Review at End', desc: 'All answers + explanations revealed after submit' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 bg-slate-800 rounded-2xl px-4 py-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-4 text-center">Passing score on the real exam is 70%.</p>
          <button
            onClick={onStart}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-2xl transition-colors active:scale-95 text-lg"
          >
            Begin Exam →
          </button>
        </div>

      </div>
    </div>
  );
}

function ExamReviewScreen({ quiz, reviewData, onRetry, onHome, onResults, onErrorLog }) {
  const score = reviewData.filter(r => r.correct).length;
  const pct = Math.round((score / quiz.length) * 100);
  const wrongCount = quiz.length - score;
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Score header */}
      <div className="px-4 py-5 border-b border-slate-800 text-center">
        <div className="text-5xl mb-2">{pct >= 70 ? '🏆' : '📚'}</div>
        <h2 className="text-4xl font-bold mb-1">
          <span className={pct >= 70 ? 'text-emerald-400' : 'text-red-400'}>{pct}%</span>
        </h2>
        <p className={`text-sm font-semibold mb-1 ${pct >= 70 ? 'text-emerald-300' : 'text-red-300'}`}>
          {pct >= 70 ? 'PASS — Above 70% threshold' : 'FAIL — Below 70% threshold'}
        </p>
        <p className="text-slate-400 text-sm mb-4">{score} of {quiz.length} correct</p>
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{score}</p>
            <p className="text-xs text-slate-400">Correct</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{wrongCount}</p>
            <p className="text-xs text-slate-400">Wrong / Skipped</p>
          </div>
        </div>
      </div>

      {/* Full review list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Full Exam Review</p>
        {quiz.map((q, i) => {
          const r = reviewData[i];
          const isCorrect = r?.correct;
          const isExpanded = expandedIndex === i;
          return (
            <div key={q.id} className={`rounded-2xl border overflow-hidden ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <button className="w-full text-left px-4 py-3" onClick={() => setExpandedIndex(isExpanded ? null : i)}>
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 text-sm font-bold mt-0.5 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">{q.topic} · Q{i + 1}</p>
                    <p className="text-sm text-slate-200 leading-relaxed line-clamp-2">{q.question}</p>
                    {!isExpanded && (
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          ✓ {q.answer}. {q.options['ABCD'.indexOf(q.answer)]}
                        </span>
                        {!isCorrect && r?.selected && (
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300">
                            ✗ {r.selected}. {q.options['ABCD'.indexOf(r.selected)]}
                          </span>
                        )}
                        {!isCorrect && !r?.selected && (
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-700 text-slate-400">Not answered</span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-slate-600 text-xs shrink-0 mt-0.5">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-slate-800/60">
                  <p className="text-sm text-slate-200 leading-relaxed pt-3">{q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const letter = 'ABCD'[oi];
                      const isKey = letter === q.answer;
                      const isPick = letter === r?.selected;
                      let cls = 'bg-slate-800/60 text-slate-400';
                      if (isKey) cls = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                      else if (isPick) cls = 'bg-red-500/20 text-red-300 border border-red-500/40';
                      return (
                        <div key={letter} className={`rounded-xl px-3 py-2 text-xs flex items-start gap-2 ${cls}`}>
                          <span className="font-bold shrink-0">{letter}.</span>
                          <span className="flex-1">{opt}</span>
                          {isKey && <span className="shrink-0 text-emerald-400">✓</span>}
                          {isPick && !isKey && <span className="shrink-0 text-red-400">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="bg-slate-900/60 rounded-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="text-amber-400 font-semibold">Explanation: </span>{q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-800 space-y-2">
        <button onClick={onRetry} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-2xl active:scale-95 transition-all">Retake Exam</button>
        {wrongCount > 0 && <button onClick={onErrorLog} className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 rounded-2xl active:scale-95 transition-all text-sm">⚠️ View Error Log ({wrongCount} added)</button>}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onResults} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-2xl active:scale-95 transition-all text-sm">View Progress</button>
          <button onClick={onHome} className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold py-3 rounded-2xl active:scale-95 transition-all text-sm">Home</button>
        </div>
      </div>
    </div>
  );
}
