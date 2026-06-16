import { Star, ExternalLink, Pencil, Trash2, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { Badge, StatusBadge, PriorityBadge } from '../../components/ui/Badge.jsx';
import PlatformIcon from './PlatformIcon.jsx';
import { progressPercent, progressCount } from '../../lib/model.js';
import { useVault } from '../../context/VaultContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { cn } from '../../lib/cn.js';

export default function ItemCard({ item, selectable, selected, onToggleSelect }) {
  const { toggleFavorite, deleteItem } = useVault();
  const { openDetail, openEditor } = useUI();
  const pct = progressPercent(item);
  const { done, total } = progressCount(item);

  return (
    <Card
      interactive
      className={cn(
        'group flex flex-col p-4 animate-scale-in',
        selected && 'ring-2 ring-brand-500',
      )}
      onClick={() => openDetail(item.id)}
    >
      <div className="flex items-start gap-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(item.id);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${item.title}`}
            className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
        )}
        <PlatformIcon platform={item.platform} className="h-9 w-9 flex-shrink-0" />

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-bold leading-snug text-slate-900 dark:text-white">
            {item.title || 'Untitled'}
          </h3>
          {item.creator && (
            <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{item.creator}</p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id, item.favorite);
          }}
          aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={item.favorite}
          className="rounded-lg p-1 text-slate-300 transition-colors hover:text-amber-400 dark:text-slate-600"
        >
          <Star className={cn('h-5 w-5', item.favorite && 'fill-amber-400 text-amber-400')} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={item.status} />
        <PriorityBadge priority={item.priority} />
        <Badge color="slate">{item.category}</Badge>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>
            {done}/{total} · {pct}%
          </span>
        </div>
        <ProgressBar value={pct} tone={pct === 100 ? 'success' : 'brand'} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
              aria-label="Open original"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openEditor(item);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
            aria-label="Edit item"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${item.title}"?`)) deleteItem(item.id);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            aria-label="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
          Details <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Card>
  );
}
