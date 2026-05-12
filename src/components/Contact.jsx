import { useState } from 'react';

const FORMSPREE_ID = 'mzdogjjv';
const PORTAL_PREFIX = '[Certified Paralegal - ApexCert]';
const AMAZON_URL = 'https://www.amazon.com/dp/B0H1BTG9H4';

export default function Contact({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `${PORTAL_PREFIX} ${subject || 'Portal Support'}`,
          name, email, subject, message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>

      {/* PRIMARY — Amazon review */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold mb-3">★ Leave a Review on Amazon</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Loved the study guide? Have suggestions or criticisms? Please share your honest thoughts on Amazon — good <em>and</em> critical reviews help other students make informed choices and genuinely support our small brand.
        </p>
        <div className="space-y-2 mb-6">
          {[
            'Great experience? Tell the Amazon community — it helps others find the right resource',
            'Have suggestions or criticisms? Those are just as welcome — honest reviews matter most',
            'Takes less than 2 minutes and makes a real difference',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0 text-sm mt-0.5">→</span>
              <p className="text-xs text-slate-300">{t}</p>
            </div>
          ))}
        </div>
        <a
          href={AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-3 rounded-xl transition-colors active:scale-95"
        >
          ★ Leave a Review on Amazon
        </a>
        <p className="text-xs text-slate-500 mt-3">Your review appears publicly on Amazon — visible to all future buyers.</p>
      </div>

      {/* SECONDARY — Portal support */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-200 mb-1">📬 Portal Support & Queries</h3>
        <p className="text-xs text-slate-500 mb-5">
          Having a technical issue with the portal, found an error in a question, or have a query about exam content?
          Use this form — it goes directly to our inbox. For sharing thoughts on the study guide, please use Amazon above.
        </p>

        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center max-w-md">
            <p className="text-3xl mb-3">🙏</p>
            <p className="text-lg font-bold text-emerald-400 mb-2">Message received!</p>
            <p className="text-slate-400 text-sm mb-4">We'll get back to you if a reply is needed.</p>
            <button onClick={() => setStatus('idle')} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-5 py-2 rounded-xl text-sm transition-colors">Send Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Your Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Email <span className="text-slate-600 normal-case font-normal">(optional)</span>
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Subject</label>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Question 42 has an error, Videos not loading..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Describe Your Issue or Query</label>
              <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Describe your technical issue, content question, or query in detail..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none" />
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
            )}
            <button type="submit" disabled={status === 'sending'}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-semibold px-6 py-2.5 rounded-xl text-sm active:scale-95 transition-all">
              {status === 'sending' ? 'Sending...' : 'Send to Support'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
