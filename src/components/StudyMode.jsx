import { useState, useEffect, useRef } from 'react';
import { FLASHCARDS as questions } from '../data/flashcards.js';
import { useProgress } from '../hooks/useProgress';

const TOPICS = ['All', ...Array.from(new Set(questions.map(q => q.topic))).sort()];
const SWIPE_THRESHOLD = 60;
const TIMER_PRESETS = [10, 20, 30, 45, 60];
const RANGE_PRESETS = [
  { label: 'All', value: 'all' },
  { label: 'First 50', value: '50' },
  { label: 'First 100', value: '100' },
  { label: 'First 200', value: '200' },
  { label: 'Custom', value: 'custom' },
];

export default function StudyMode({ onNavigate }) {
  const { recordAnswer, getDueQuestions, toggleBookmark, isBookmarked } = useProgress();

  // Setup state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [setupTopic, setSetupTopic] = useState('All');
  const [setupMode, setSetupMode] = useState('all');
  const [rangeType, setRangeType] = useState('all');
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(50);
  const [shuffle, setShuffle] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [showTopicPicker, setShowTopicPicker] = useState(false);

  // Session state
  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showResult, setShowResult] = useState(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [swipeHint, setSwipeHint] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const didSwipe = useRef(false);
  const cardRef = useRef(null);
  const showResultRef = useRef(null);
  const deckRef = useRef([]);

  useEffect(() => { cardRef.current = deck[cardIndex]; }, [deck, cardIndex]);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);
  useEffect(() => { deckRef.current = deck; }, [deck]);

  // Preview count for setup screen
  function getPool() {
    let pool = setupTopic === 'All' ? [...questions] : questions.filter(q => q.topic === setupTopic);
    if (setupMode === 'due') pool = getDueQuestions(pool);
    if (rangeType === 'custom') pool = pool.slice(Math.max(0, rangeFrom - 1), rangeTo);
    else if (rangeType !== 'all') pool = pool.slice(0, parseInt(rangeType));
    return pool;
  }
  const previewCount = getPool().length;

  function startSession() {
    let pool = getPool();
    if (pool.length === 0) return;
    if (shuffle) pool = [...pool].sort(() => Math.random() - 0.5);
    setDeck(pool);
    setCardIndex(0);
    setFlipped(false);
    setShowResult(null);
    setSessionCorrect(0);
    setSessionTotal(0);
    setSessionStarted(true);
  }

  // Reset timer when card changes
  useEffect(() => {
    if (!sessionStarted || !timerEnabled) { setTimeLeft(null); return; }
    setTimeLeft(timerSeconds);
  }, [cardIndex, sessionStarted, timerEnabled, timerSeconds]);

  // Countdown tick
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Timer expired
  useEffect(() => {
    if (timeLeft !== 0 || !timerEnabled) return;
    if (showResultRef.current) return;
    const card = cardRef.current;
    if (!card) return;
    recordAnswer(card.id, false);
    setShowResult('timeout');
    setSessionTotal(t => t + 1);
    setTimeout(() => {
      setShowResult(null);
      setFlipped(false);
      setCardIndex(i => i + 1);
    }, 900);
  }, [timeLeft]);

  const card = deck[cardIndex];

  function handleFlip() { if (!flipped && !showResult) setFlipped(true); }

  function handleAnswer(correct) {
    if (!card || showResult) return;
    setTimeLeft(null);
    recordAnswer(card.id, correct);
    setShowResult(correct ? 'correct' : 'wrong');
    setSwipeHint(null);
    setSessionTotal(t => t + 1);
    if (correct) setSessionCorrect(c => c + 1);
    setTimeout(() => {
      setShowResult(null);
      setFlipped(false);
      setCardIndex(i => i + 1);
    }, 600);
  }

  function onTouchStart(e) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    didSwipe.current = false;
    setSwipeHint(null);
  }

  function onTouchMove(e) {
    if (touchStartX.current === null) return;
    const dx = e.targetTouches[0].clientX - touchStartX.current;
    const dy = e.targetTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy)) {
      if (flipped && !showResult) setSwipeHint(dx > 0 ? 'right' : 'left');
    }
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    setSwipeHint(null);
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
      didSwipe.current = true;
      if (!flipped) handleFlip();
      else if (!showResult) handleAnswer(dx > 0);
    }
    touchStartX.current = null;
  }

  function handleCardClick() {
    if (didSwipe.current) { didSwipe.current = false; return; }
    handleFlip();
  }

  // ── SETUP SCREEN ──
  if (!sessionStarted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Dashboard
        </button>

        <h2 className="text-xl font-bold mb-1">Flashcard Session</h2>
        <p className="text-slate-400 text-sm mb-6">Set up your session then hit Start.</p>

        {/* Topic */}
        <div className="mb-4">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Topic</label>
          <button onClick={() => setShowTopicPicker(true)}
            className="w-full text-left bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 flex items-center justify-between hover:border-slate-600 transition-colors">
            <span>📂 {setupTopic === 'All' ? 'All Topics' : setupTopic}</span>
            <span className="text-slate-500 text-xs">▼</span>
          </button>
        </div>

        {/* Range */}
        <div className="mb-4">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Card Range</label>
          <div className="flex flex-wrap gap-2">
            {RANGE_PRESETS.map(r => (
              <button key={r.value} onClick={() => setRangeType(r.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${rangeType === r.value ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                {r.label}
              </button>
            ))}
          </div>
          {rangeType === 'custom' && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">From card #</label>
                <input type="number" min="1" max={questions.length} value={rangeFrom}
                  onChange={e => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">To card #</label>
                <input type="number" min="1" max={questions.length} value={rangeTo}
                  onChange={e => setRangeTo(Math.min(questions.length, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          )}
        </div>

        {/* Shuffle */}
        <div className="mb-4 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium">Shuffle Cards</p>
            <p className="text-xs text-slate-500">Randomize order each session</p>
          </div>
          <button onClick={() => setShuffle(s => !s)}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${shuffle ? 'bg-amber-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform ${shuffle ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Due only */}
        <div className="mb-4 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium">Due Cards Only</p>
            <p className="text-xs text-slate-500">Spaced repetition — review overdue cards</p>
          </div>
          <button onClick={() => setSetupMode(m => m === 'all' ? 'due' : 'all')}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${setupMode === 'due' ? 'bg-amber-500' : 'bg-slate-600'}`}>
            <span className={`absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform ${setupMode === 'due' ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Timer */}
        <div className="mb-6 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Timed Mode</p>
              <p className="text-xs text-slate-500">Auto-advance card when time runs out</p>
            </div>
            <button onClick={() => setTimerEnabled(t => !t)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${timerEnabled ? 'bg-amber-500' : 'bg-slate-600'}`}>
              <span className={`absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform ${timerEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {timerEnabled && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Seconds per card</p>
              <div className="flex flex-wrap gap-2">
                {TIMER_PRESETS.map(s => (
                  <button key={s} onClick={() => setTimerSeconds(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timerSeconds === s ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {s}s
                  </button>
                ))}
                <input type="number" min="5" max="300"
                  placeholder="Custom"
                  onChange={e => { const v = parseInt(e.target.value); if (v >= 5) setTimerSeconds(v); }}
                  className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-500" />
              </div>
            </div>
          )}
        </div>

        {/* Start */}
        <p className="text-center text-sm text-slate-400 mb-3">
          {previewCount} card{previewCount !== 1 ? 's' : ''} ready
        </p>
        <button onClick={startSession} disabled={previewCount === 0}
          className="w-full bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-2xl text-base active:scale-95 transition-all">
          Start Session →
        </button>

        {showTopicPicker && (
          <TopicPicker topics={TOPICS} selected={setupTopic}
            onSelect={t => { setSetupTopic(t); setShowTopicPicker(false); }}
            onClose={() => setShowTopicPicker(false)} />
        )}
      </div>
    );
  }

  // ── DECK COMPLETE ──
  if (!card) {
    return (
      <div className="px-4 py-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-xl font-bold mb-2">Deck complete!</p>
        <p className="text-slate-400 text-sm text-center mb-1">Session score: <span className="text-amber-400 font-semibold">{sessionCorrect}/{sessionTotal}</span></p>
        <p className="text-slate-500 text-xs mb-6">({sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}% accuracy)</p>
        <div className="flex gap-3">
          <button onClick={() => setSessionStarted(false)} className="bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-2xl">Change Settings</button>
          <button onClick={startSession} className="bg-amber-500 text-slate-900 font-bold px-5 py-3 rounded-2xl">Restart</button>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(card.id);
  const timerPct = timerEnabled && timeLeft !== null ? (timeLeft / timerSeconds) * 100 : 100;
  const timerColor = timerPct > 50 ? 'bg-emerald-400' : timerPct > 25 ? 'bg-amber-400' : 'bg-red-400';

  // ── SESSION ──
  return (
    <div className="flex flex-col max-w-2xl mx-auto px-4 py-4 min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
      {/* Back to settings */}
      <button onClick={() => setSessionStarted(false)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-3 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Session Settings
      </button>

      {/* Progress row */}
      <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
        <span>{cardIndex + 1} / {deck.length}</span>
        <div className="flex items-center gap-3">
          {sessionTotal > 0 && <span>{sessionCorrect}/{sessionTotal} correct</span>}
          {timerEnabled && timeLeft !== null && (
            <span className={`font-bold tabular-nums ${timerPct <= 25 ? 'text-red-400' : timerPct <= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ⏱ {timeLeft}s
            </span>
          )}
          <button onClick={() => toggleBookmark(card.id)}
            className={`text-base transition-colors ${bookmarked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}>🔖</button>
        </div>
      </div>

      {/* Deck progress bar */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(cardIndex / deck.length) * 100}%` }} />
      </div>

      {/* Timer bar */}
      {timerEnabled && timeLeft !== null ? (
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
        </div>
      ) : <div className="mb-4" />}

      {/* Flashcard */}
      <div className="flex-1 flex flex-col pb-4">
        <div
          className="card-flip-container flex-1 cursor-pointer select-none"
          style={{ minHeight: '320px' }}
          onClick={handleCardClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`card-flip-inner transition-transform ${flipped ? 'flipped' : ''} ${
              swipeHint === 'right' ? 'rotate-1 scale-[1.01]' : swipeHint === 'left' ? '-rotate-1 scale-[1.01]' : ''
            }`}
            style={{ minHeight: '320px' }}
          >
            {/* Front */}
            <div className="card-face flex flex-col bg-slate-800 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Question</span>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full truncate max-w-[140px]">{card.topic}</span>
              </div>
              <p className="text-sm leading-relaxed flex-1">{card.question}</p>
              <div className="mt-4 text-center text-xs text-slate-500">
                Tap to reveal · <span className="lg:hidden">or swipe</span>
              </div>
            </div>
            {/* Back */}
            <div className={`card-face card-back flex flex-col bg-slate-800 rounded-3xl p-6 border transition-colors ${
              swipeHint === 'right' ? 'border-emerald-500/60 bg-emerald-500/5' :
              swipeHint === 'left'  ? 'border-red-500/60 bg-red-500/5' :
              'border-amber-500/40'
            }`}>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-3">Answer</span>
              <p className="text-sm text-slate-100 leading-relaxed flex-1 overflow-auto">{card.answer}</p>
            </div>
          </div>
        </div>

        {/* Swipe hint */}
        {flipped && !showResult && (
          <div className="lg:hidden flex items-center justify-between text-xs mt-2 mb-1 px-1 select-none">
            <span className={`font-medium transition-colors ${swipeHint === 'left' ? 'text-red-400' : 'text-red-500/40'}`}>← Wrong</span>
            <span className="text-slate-600">swipe or tap buttons</span>
            <span className={`font-medium transition-colors ${swipeHint === 'right' ? 'text-emerald-400' : 'text-emerald-500/40'}`}>Correct →</span>
          </div>
        )}

        {flipped && !showResult && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button onClick={() => handleAnswer(false)}
              className="bg-red-500/20 border border-red-500/40 text-red-400 font-semibold py-4 rounded-2xl active:scale-95 transition-all">
              ✗  Got it wrong
            </button>
            <button onClick={() => handleAnswer(true)}
              className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold py-4 rounded-2xl active:scale-95 transition-all">
              ✓  Got it right
            </button>
          </div>
        )}

        {showResult && (
          <div className={`mt-4 py-4 rounded-2xl text-center font-bold text-lg ${
            showResult === 'correct' ? 'bg-emerald-500/20 text-emerald-400' :
            showResult === 'timeout' ? 'bg-slate-700 text-slate-300' :
            'bg-red-500/20 text-red-400'
          }`}>
            {showResult === 'correct' ? '✓ Correct!' : showResult === 'timeout' ? "⏱ Time's up!" : '✗ Review this one'}
          </div>
        )}

        {!flipped && !showResult && (
          <button onClick={() => { setTimeLeft(null); setFlipped(false); setCardIndex(i => i + 1); }}
            className="mt-3 text-xs text-slate-500 hover:text-slate-400 py-2 transition-colors">
            Skip →
          </button>

        )}
      </div>
    </div>
  );
}

function TopicPicker({ topics, selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end lg:items-center lg:justify-center" onClick={onClose}>
      <div className="bg-slate-800 w-full max-w-lg mx-auto rounded-t-3xl lg:rounded-3xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-800 px-4 py-4 border-b border-slate-700">
          <p className="font-bold text-center">Select Topic</p>
        </div>
        <div className="p-2">
          {topics.map(t => (
            <button key={t} onClick={() => onSelect(t)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${selected === t ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'hover:bg-slate-700 text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
