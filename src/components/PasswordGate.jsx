import { useState } from 'react';

// ← Change PORTAL_PASSWORD to whatever you print in the CP book
const PORTAL_PASSWORD = 'CP2025';
const CREATOR_PASSWORD = 'hpJOHN2003.';
const STORAGE_KEY = 'cp_unlocked';

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (unlocked) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === PORTAL_PASSWORD || input.trim() === CREATOR_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Certified Paralegal</h1>
          <p className="text-sm text-amber-400 font-semibold tracking-wide">ApexCert Study Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Access Code
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={input}
                onChange={e => { setInput(e.target.value); setError(false); }}
                placeholder="Enter your access code"
                autoFocus
                className={`w-full bg-slate-800 border rounded-2xl px-4 py-4 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none transition-colors text-center text-lg tracking-widest ${
                  error ? 'border-red-500' : 'border-slate-700 focus:border-amber-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="h-5 mt-1.5">
              {error && <p className="text-red-400 text-xs text-center">Incorrect access code. Please try again.</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-2xl active:scale-95 transition-all text-base"
          >
            Unlock Portal
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed">
          Access code is printed inside your study guide.<br />
          Scan the QR code and enter the code once per device.
        </p>
      </div>
    </div>
  );
}
