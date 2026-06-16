import { cn } from '../../lib/cn.js';

const baseControl =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500';

export function Label({ htmlFor, children, hint }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn(baseControl, className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn(baseControl, 'resize-y', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(baseControl, 'cursor-pointer pr-8', className)} {...props}>
      {children}
    </select>
  );
}

export function FormRow({ label, htmlFor, hint, children }) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor} hint={hint}>{label}</Label>}
      {children}
    </div>
  );
}
