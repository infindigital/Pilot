import { useMemo } from 'react';
import {
  Bookmark,
  BookOpen,
  GraduationCap,
  Rocket,
  Archive,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import ItemCard from '../features/items/ItemCard.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { getStats, getWeekActivity, getStreak } from '../lib/analytics.js';
import { STATUSES } from '../lib/constants.js';

export default function Dashboard() {
  const { items } = useVault();
  const { navigate, openEditor } = useUI();

  const stats = useMemo(() => getStats(items), [items]);
  const week = useMemo(() => getWeekActivity(items), [items]);
  const streak = useMemo(() => getStreak(items), [items]);

  const recent = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
    [items],
  );

  // Status pipeline distribution for the overview bar.
  const pipeline = STATUSES.map((s) => ({
    ...s,
    count: items.filter((i) => i.status === s.id).length,
  }));
  const maxCount = Math.max(1, ...pipeline.map((p) => p.count));

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-200">
              {streak > 0 ? `🔥 ${streak}-day learning streak` : 'Welcome back'}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              You've implemented {stats.completed} of {stats.total} saved learnings
            </h2>
            <p className="mt-1 text-brand-100">
              Turn your saved-and-forgotten pile into real skills.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="success" onClick={() => openEditor()}>
              <Plus className="h-4 w-4" /> Add Learning
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 text-white ring-white/20 hover:bg-white/20"
              onClick={() => navigate('queue')}
            >
              Start learning <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Saved" value={stats.total} icon={Bookmark} tone="brand" onClick={() => navigate('library')} />
        <StatCard label="To Learn" value={stats.toLearn} icon={BookOpen} tone="amber" onClick={() => navigate('library', { status: 'to-learn' })} />
        <StatCard label="Learning" value={stats.learning} icon={GraduationCap} tone="blue" onClick={() => navigate('library', { status: 'learning' })} />
        <StatCard label="Implemented" value={stats.implemented} icon={Rocket} tone="emerald" onClick={() => navigate('library', { status: 'implemented' })} />
        <StatCard label="Archived" value={stats.archived} icon={Archive} tone="zinc" onClick={() => navigate('library', { status: 'archived' })} />
        <StatCard label="Completion" value={stats.completionRate} suffix="%" icon={Target} tone="violet" progress={stats.completionRate} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline overview */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Learning Pipeline</h3>
            <Target className="h-5 w-5 text-slate-300" />
          </div>
          <div className="space-y-3">
            {pipeline.map((s) => (
              <div key={s.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{s.label}</span>
                  <span className="text-slate-400">{s.count}</span>
                </div>
                <ProgressBar value={(s.count / maxCount) * 100} tone="brand" />
              </div>
            ))}
          </div>
        </Card>

        {/* This week */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">This Week</h3>
            <TrendingUp className="h-5 w-5 text-slate-300" />
          </div>
          <div className="space-y-4">
            <WeekStat label="Items added" value={week.addedThisWeek} tone="text-brand-600 dark:text-brand-400" />
            <WeekStat label="Items completed" value={week.completedThisWeek} tone="text-success-600 dark:text-success-400" />
            <WeekStat label="Day streak" value={`${streak} 🔥`} tone="text-amber-600 dark:text-amber-400" />
          </div>
          <Button variant="secondary" className="mt-5 w-full" onClick={() => navigate('calendar')}>
            View calendar
          </Button>
        </Card>
      </div>

      {/* Recently added */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Recently Added</h3>
          <button
            type="button"
            onClick={() => navigate('library')}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekStat({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-2xl font-extrabold ${tone}`}>{value}</span>
    </div>
  );
}
