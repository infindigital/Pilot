import { Menu, Moon, Sun, Zap, Search } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { NAV_ITEMS } from './nav.js';
import Button from '../ui/Button.jsx';

export default function Topbar({ onOpenMobile }) {
  const { page, navigate, openQuickAdd } = useUI();
  const { theme, toggleTheme } = useTheme();
  const current = NAV_ITEMS.find((n) => n.id === page);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-bold text-slate-900 dark:text-white">
        {current?.label || 'Dashboard'}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('library', { focusSearch: true })}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-slate-300 sm:flex dark:border-slate-700 dark:bg-slate-800/60"
          aria-label="Search library"
        >
          <Search className="h-4 w-4" />
          <span>Search…</span>
        </button>

        <Button variant="success" size="sm" onClick={openQuickAdd}>
          <Zap className="h-4 w-4" /> Quick Add
        </Button>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
