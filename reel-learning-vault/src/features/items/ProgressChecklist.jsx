import { Check } from 'lucide-react';
import { PROGRESS_STEPS } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

// Reusable 5-checkpoint checklist. `compact` renders smaller rows for cards.
export default function ProgressChecklist({ progress, onToggle, compact }) {
  return (
    <ul className={cn('space-y-1', compact ? 'space-y-0.5' : 'space-y-1.5')}>
      {PROGRESS_STEPS.map((step) => {
        const done = Boolean(progress?.[step.id]);
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onToggle(step.id)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                  done
                    ? 'border-success-500 bg-success-500 text-white'
                    : 'border-slate-300 dark:border-slate-600',
                )}
              >
                {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  'font-medium',
                  done
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-300',
                )}
              >
                {step.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
