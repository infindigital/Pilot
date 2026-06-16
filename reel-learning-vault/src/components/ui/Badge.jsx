import { cn } from '../../lib/cn.js';
import { BADGE_CLASSES, statusById, priorityById } from '../../lib/constants.js';

export function Badge({ color = 'slate', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        BADGE_CLASSES[color] || BADGE_CLASSES.slate,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }) {
  const s = statusById(status);
  return (
    <Badge color={s.color} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </Badge>
  );
}

export function PriorityBadge({ priority, className }) {
  const p = priorityById(priority);
  return (
    <Badge color={p.color} className={className}>
      {p.label}
    </Badge>
  );
}
