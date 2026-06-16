import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Flame } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { getWeekActivity, getStreak } from '../lib/analytics.js';
import { startOfDay, sameDay } from '../lib/dates.js';
import { cn } from '../lib/cn.js';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const { items } = useVault();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const week = useMemo(() => getWeekActivity(items), [items]);
  const streak = useMemo(() => getStreak(items), [items]);

  // Build a map of day-timestamp -> { added, completed }.
  const activity = useMemo(() => {
    const map = new Map();
    const bump = (iso, key) => {
      if (!iso) return;
      const t = startOfDay(iso).getTime();
      const entry = map.get(t) || { added: 0, completed: 0 };
      entry[key] += 1;
      map.set(t, entry);
    };
    for (const item of items) {
      bump(item.createdAt, 'added');
      bump(item.completedAt, 'completed');
    }
    return map;
  }, [items]);

  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const today = startOfDay(new Date());

  const move = (delta) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Added this week" value={week.addedThisWeek} icon={Plus} tone="brand" />
        <StatCard label="Completed this week" value={week.completedThisWeek} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Learning streak" value={`${streak} 🔥`} icon={Flame} tone="amber" />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{monthLabel}</h3>
          <div className="flex items-center gap-1">
            <button onClick={() => move(-1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Previous month">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30">
              Today
            </button>
            <button onClick={() => move(1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Next month">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
              {d}
            </div>
          ))}
          {grid.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const entry = activity.get(day.getTime());
            const isToday = sameDay(day, today);
            return (
              <div
                key={day.getTime()}
                className={cn(
                  'flex min-h-[64px] flex-col rounded-xl border p-1.5 transition-colors',
                  isToday
                    ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/30'
                    : 'border-slate-100 dark:border-slate-800',
                )}
              >
                <span className={cn('text-xs font-semibold', isToday ? 'text-brand-700 dark:text-brand-200' : 'text-slate-400')}>
                  {day.getDate()}
                </span>
                <div className="mt-auto flex flex-wrap gap-1">
                  {entry?.added > 0 && (
                    <span className="rounded-md bg-brand-100 px-1.5 text-[10px] font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200" title={`${entry.added} added`}>
                      +{entry.added}
                    </span>
                  )}
                  {entry?.completed > 0 && (
                    <span className="rounded-md bg-success-100 px-1.5 text-[10px] font-bold text-success-600 dark:bg-emerald-900/50 dark:text-emerald-300" title={`${entry.completed} completed`}>
                      ✓{entry.completed}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-brand-100 dark:bg-brand-900/50" /> Added
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-success-100 dark:bg-emerald-900/50" /> Completed
          </span>
        </div>
      </Card>
    </div>
  );
}

// Returns an array of Date|null aligned to a Monday-first week grid.
function buildMonthGrid(monthStart) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1);
  const lead = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(startOfDay(new Date(year, month, d)));
  return cells;
}
