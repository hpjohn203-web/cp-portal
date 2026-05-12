const AMAZON_URL = 'https://www.amazon.com/dp/B0H1BTG9H4';
const NUDGE_KEY = 'cp_review_nudge';

function getNudgeState() {
  try {
    const raw = localStorage.getItem(NUDGE_KEY);
    if (!raw) return { sessionCount: 0, nextNudgeAt: 3 + Math.floor(Math.random() * 3), remindAfter: null, done: false };
    return JSON.parse(raw);
  } catch {
    return { sessionCount: 0, nextNudgeAt: 3, remindAfter: null, done: false };
  }
}

function saveNudgeState(state) {
  localStorage.setItem(NUDGE_KEY, JSON.stringify(state));
}

export function checkAndIncrementNudge() {
  const state = getNudgeState();
  if (state.done) return false;

  const newCount = state.sessionCount + 1;
  const updatedState = { ...state, sessionCount: newCount };

  // Clear expired remind delay
  if (state.remindAfter && Date.now() >= state.remindAfter) {
    updatedState.remindAfter = null;
  }

  saveNudgeState(updatedState);

  // Still within remind window — don't show
  if (updatedState.remindAfter && Date.now() < updatedState.remindAfter) return false;

  return newCount >= state.nextNudgeAt;
}

export default function ReviewNudge({ onClose }) {
  function handleDoItNow() {
    const state = getNudgeState();
    saveNudgeState({ ...state, done: true });
    window.open(AMAZON_URL, '_blank', 'noopener,noreferrer');
    onClose();
  }

  function handleRemindLater() {
    const state = getNudgeState();
    saveNudgeState({
      ...state,
      sessionCount: 0,
      nextNudgeAt: 3 + Math.floor(Math.random() * 3),
      remindAfter: Date.now() + 3 * 24 * 60 * 60 * 1000,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-end lg:items-center lg:justify-center px-4 pb-6 lg:pb-0"
      onClick={handleRemindLater}
    >
      <div
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Quick favour?</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            If this has been useful, an Amazon review goes a long way for our brand and helps other candidates find this resource.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDoItNow}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>★</span> Leave a Review on Amazon
          </button>
          <button
            onClick={handleRemindLater}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3.5 rounded-2xl active:scale-95 transition-all text-sm"
          >
            Remind me in 3 days
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Won't ask again once you've reviewed
        </p>
      </div>
    </div>
  );
}
