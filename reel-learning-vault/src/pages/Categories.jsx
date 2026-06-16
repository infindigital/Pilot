import { useMemo } from 'react';
import { FolderKanban, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import PlatformIcon from '../features/items/PlatformIcon.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { categoryGroups } from '../lib/analytics.js';

export default function Categories() {
  const { items } = useVault();
  const { navigate } = useUI();
  const groups = useMemo(() => categoryGroups(items), [items]);

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No categories yet"
        description="Add learnings and they'll be grouped by skill category here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Your knowledge organised by skill. Click a category to filter the library.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.name}
            interactive
            onClick={() => navigate('library', { category: group.name })}
            className="group p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{group.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {group.count} {group.count === 1 ? 'item' : 'items'} · {group.completed} done
                </p>
              </div>
              <PlatformIcon platform={group.topPlatform.id} className="h-9 w-9" />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Avg. progress</span>
                <span>{group.avgProgress}%</span>
              </div>
              <ProgressBar value={group.avgProgress} tone="gradient" />
            </div>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
              View items <ArrowRight className="h-4 w-4" />
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
