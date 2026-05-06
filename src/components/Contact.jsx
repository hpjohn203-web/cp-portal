import { useState } from 'react';

const FORMSPREE_ID = 'mzdogjjv';
const PORTAL_PREFIX = '[Certified Paralegal - ApexCert]';
const AMAZON_URL = 'https://www.amazon.com';

const STARS = [1, 2, 3, 4, 5];

function AmazonCard() {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl px-5 py-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">📦</span>
        <div>
          <p className="font-semibold text-sm text-slate-200 mb-1">Also enjoyed the study guide?</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            If our Certified Paralegal study guide helped with your preparation, we'd truly appreciate a quick review on Amazon — it means the world to our small brand and helps other candidates find the right resource. Thank you so much!
          </p>
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors active:scale-95"
          >
            ★ Leave an Amazon Review
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Contact({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) { alert('Please select a star rating.'); return; }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `${PORTAL_PREFIX} ${subject || 'New message'}`,
          name, email,
          rating: `${rating} / 5 stars`,
          subject, message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setRating(0); setSubject(''); setMessage('');
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Mobile back */}
      <button onClick={() => onNavigate('home')} className="lg:hidden flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>

      <div className="lg:grid lg:grid-cols-5 lg:gap-10">

        {/* ── Left column (desktop) ── */}
        <div className="lg:col-span-2 mb-6 lg:mb-0">
          <h2 className="text-2xl font-bold mb-2">Rate & Review</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            How is the Certified Paralegal study portal working for you? We built this to help you pass — your honest feedback helps us make it better.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { icon: '🎯', text: 'Tell us what\'s working and what isn\'t' },
              { icon: '📚', text: 'Share how the portal helped your prep' },
              { icon: '💡', text: 'Suggest features you\'d love to see' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <p className="text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Amazon card — desktop only here */}
          <div className="hidden lg:block">
            <AmazonCard />
          </div>
        </div>

        {/* ── Right column — form ── */}
        <div className="lg:col-span-3">
          {status === 'success' ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🙏</p>
              <p className="text-xl font-bold text-emerald-400 mb-2">Thank you!</p>
              <p className="text-slate-400 text-sm mb-6">Your message has been received. We appreciate you taking the time.</p>
              <button onClick={() => setStatus('idle')} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Star rating */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-4">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Overall Rating</label>
                <div className="flex gap-2 items-center">
                  {STARS.map(s => (
                    <button key={s} type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      className="text-3xl transition-transform active:scale-90">
                      <span className={(hovered || rating) >= s ? 'text-amber-400' : 'text-slate-600'}>★</span>
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-xs text-slate-400">
                      {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Name + Email row on desktop */}
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

              {/* Subject */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Subject</label>
                <input type="text" required value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Great resource, Question about content..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea required rows={6} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Share your thoughts, learning experience, suggestions, or any issues..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none" />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
              )}

              <button type="submit" disabled={status === 'sending'}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-2xl text-base active:scale-95 transition-all">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Amazon card — mobile only (below form) */}
      <div className="lg:hidden mt-6">
        <AmazonCard />
      </div>
    </div>
  );
}
