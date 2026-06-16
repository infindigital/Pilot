import { cn } from '../../lib/cn.js';

const TONES = {
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  gradient: 'bg-gradient-to-r from-brand-500 to-success-500',
};

export default function ProgressBar({ value = 0, tone = 'brand', className, trackClassName }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', trackClassName)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', TONES[tone], className)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
