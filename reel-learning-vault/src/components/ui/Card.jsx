import { cn } from '../../lib/cn.js';

export default function Card({ as: Tag = 'div', className, interactive, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900',
        interactive &&
          'cursor-pointer transition-all duration-200 hover:border-brand-300 hover:shadow-card-hover dark:hover:border-brand-700',
        className,
      )}
      {...props}
    />
  );
}
