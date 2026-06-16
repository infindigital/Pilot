import { useMemo } from 'react';
import { Flame, Rocket, Target, Lock } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { getStats, getStreak } from '../lib/analytics.js';
import { evaluateBadges } from '../lib/badges.js';
import { cn } from '../lib/cn.js';

export default function Achievements() {
  const { items } = useVault();
  const stats = useMemo(() => getStats(items), [items]);
  const streak = useMemo(() => getStreak(items), [items]);
  const badges = useMemo(() => evaluateBadges(items), [items]);
  const earnedCount = badges.filter((b) => b.isEarned).length;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col items-center justify-between gap-4 border-0 bg-gradient-to-br from-violet-600 to-brand-700 p-6 text-center text-white sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-extrabold">Keep showing up 🏅</h2>
          <p className="text-brand-100">
            You've unlocked {earnedCount} of {badges.length} badges. Consistency beats intensity.
          </p>
        </div>
        <div className="text-5xl font-black">{earnedCount}/{badges.length}</div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Learning streak" value={`${streak} 🔥`} icon={Flame} tone="amber" />
        <StatCard label="Implemented skills" value={stats.completed} icon={Rocket} tone="emerald" />
        <StatCard label="Completion rate" value={stats.completionRate} suffix="%" icon={Target} tone="violet" progress={stats.completionRate} />
      </div>

      <div>
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Badges</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={cn(
                'flex flex-col items-center p-5 text-center transition-transform',
                badge.isEarned ? 'animate-pop' : 'opacity-80',
              )}
            >
              <div
                className={cn(
                  'mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl',
                  badge.isEarned
                    ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40'
                    : 'bg-slate-100 grayscale dark:bg-slate-800',
                )}
              >
                {badge.isEarned ? badge.icon : <Lock className="h-6 w-6 text-slate-400" />}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">{badge.title}</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
              {!badge.isEarned && (
                <div className="mt-3 w-full">
                  <ProgressBar value={badge.pct} tone="brand" />
                  <p className="mt-1 text-xs font-semibold text-slate-400">{badge.pct}%</p>
                </div>
              )}
              {badge.isEarned && (
                <span className="mt-3 rounded-full bg-success-100 px-3 py-0.5 text-xs font-bold text-success-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Unlocked
                </span>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
