import { useState } from 'react';

const NAV_GROUPS = [
  {
    items: [
      { id: 'home',      icon: '🏠', label: 'Dashboard' },
      { id: 'study',     icon: '🃏', label: 'Flashcards' },
      { id: 'quiz',      icon: '⏱️', label: 'Quiz Mode' },
      { id: 'exam',      icon: '📝', label: 'Full Exam' },
      { id: 'results',   icon: '📊', label: 'My Progress' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'videos',    icon: '📹', label: 'Video Library' },
      { id: 'glossary',  icon: '📖', label: 'Glossary' },
      { id: 'formulas',  icon: '🧮', label: 'Formulas' },
      { id: 'diagrams',  icon: '🖼️', label: 'Diagrams' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'planner',   icon: '📅', label: 'Study Planner' },
      { id: 'errorlog',  icon: '⚠️', label: 'Error Log' },
      { id: 'bookmarks', icon: '🔖', label: 'Bookmarks' },
      { id: 'search',    icon: '🔍', label: 'Search' },
      { id: 'contact',   icon: '💬', label: 'Rate & Review' },
    ],
  },
];

function Sidebar({ screen, onNavigate, onClose, lightMode, onToggleTheme, notifEnabled, onToggleNotif }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-amber-400">CP Exam Prep</h1>
          <p className="text-xs text-slate-500 mt-0.5">ApexCert Publications</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 lg:hidden">✕</button>
        )}
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.label && (
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1.5">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose?.(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    screen === item.id
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <span className="text-base">{lightMode ? '🌙' : '☀️'}</span>
          <span>{lightMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button
          onClick={onToggleNotif}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors ${notifEnabled ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span className="text-base">{notifEnabled ? '🔔' : '🔕'}</span>
          <span>{notifEnabled ? 'Reminders On' : 'Reminders Off'}</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout({ screen, onNavigate, children, lightMode, onToggleTheme, notifEnabled, onToggleNotif }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === screen)?.label || 'CP Exam Prep';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:h-screen bg-slate-950 border-r border-slate-800 z-40">
        <Sidebar screen={screen} onNavigate={onNavigate} lightMode={lightMode} onToggleTheme={onToggleTheme} notifEnabled={notifEnabled} onToggleNotif={onToggleNotif} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 bg-slate-950 border-r border-slate-800 h-full overflow-hidden flex flex-col">
            <Sidebar screen={screen} onNavigate={onNavigate} onClose={() => setDrawerOpen(false)} lightMode={lightMode} onToggleTheme={onToggleTheme} notifEnabled={notifEnabled} onToggleNotif={onToggleNotif} />
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800 flex items-center px-4 gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-200 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-slate-100 truncate">{currentLabel}</span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <button onClick={() => { onNavigate('search'); setDrawerOpen(false); }} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm">🔍</button>
            <button onClick={onToggleNotif} className={`p-2 rounded-lg text-sm ${notifEnabled ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}>{notifEnabled ? '🔔' : '🔕'}</button>
            <button onClick={onToggleTheme} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg text-sm">{lightMode ? '🌙' : '☀️'}</button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
