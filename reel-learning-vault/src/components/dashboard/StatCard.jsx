import Card from '../ui/Card.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import { cn } from '../../lib/cn.js';

const TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
  zinc: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
};

export default function StatCard({ label, value, icon: Icon, tone = 'brand', progress, suffix, onClick }) {
  return (
    <Card interactive={Boolean(onClick)} onClick={onClick} className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        {Icon && (
          <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', TONES[tone])}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {value}
        {suffix && <span className="text-lg font-bold text-slate-400">{suffix}</span>}
      </p>
      {typeof progress === 'number' && (
        <ProgressBar value={progress} tone="gradient" className="mt-3" />
      )}
    </Card>
  );
}
