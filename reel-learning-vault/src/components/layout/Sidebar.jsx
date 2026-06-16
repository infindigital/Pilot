import { GraduationCap, Plus, X, LogOut } from 'lucide-react';
import { NAV_ITEMS } from './nav.js';
import { useUI } from '../../context/UIContext.jsx';
import { useVault } from '../../context/VaultContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStreak } from '../../lib/analytics.js';
import { cn } from '../../lib/cn.js';
import Button from '../ui/Button.jsx';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { page, navigate, openEditor } = useUI();
  const { items } = useVault();
  const { authEnabled, user, signOut } = useAuth();
  const streak = getStreak(items);

  const go = (id) => {
    navigate(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/40">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Reel Learning</p>
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400">Vault</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 px-1">
          <Button className="w-full" onClick={() => openEditor()}>
            <Plus className="h-4 w-4" /> Add Learning
          </Button>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-brand-600 dark:text-brand-300')} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-200">Current streak</p>
          <p className="mt-1 flex items-baseline gap-1.5 text-2xl font-extrabold">
            {streak}
            <span className="text-sm font-semibold text-brand-200">
              {streak === 1 ? 'day' : 'days'} 🔥
            </span>
          </p>
          <p className="mt-1 text-xs text-brand-200">
            {streak > 0 ? 'Keep the momentum going!' : 'Learn something today to start a streak.'}
          </p>
        </div>

        {authEnabled && user && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold uppercase text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
              {(user.email || '?').charAt(0)}
            </div>
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600 dark:text-slate-300" title={user.email}>
              {user.email}
            </p>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
