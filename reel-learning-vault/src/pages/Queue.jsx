import { useMemo } from 'react';
import { Flame, CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Badge, PriorityBadge } from '../components/ui/Badge.jsx';
import PlatformIcon from '../features/items/PlatformIcon.jsx';
import ProgressChecklist from '../features/items/ProgressChecklist.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { progressPercent } from '../lib/model.js';
import { PRIORITIES } from '../lib/constants.js';
import { NEXT_STATUS } from '../lib/workflow.js';

const priorityRank = PRIORITIES.reduce((acc, p, i) => ({ ...acc, [p.id]: PRIORITIES.length - i }), {});
const UNFINISHED = new Set(['saved', 'to-learn', 'learning']);

export default function Queue() {
  const { items, toggleProgress, setStatus } = useVault();
  const { openDetail, navigate } = useUI();

  // Top 5 unfinished, ranked by priority then lowest progress (nudges you to
  // finish things you've already started before starting new ones... actually
  // highest priority + closest-to-done first to maximise wins).
  const queue = useMemo(() => {
    return items
      .filter((i) => UNFINISHED.has(i.status))
      .sort((a, b) => {
        const p = priorityRank[b.priority] - priorityRank[a.priority];
        if (p !== 0) return p;
        return progressPercent(b) - progressPercent(a);
      })
      .slice(0, 5);
  }, [items]);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 border-0 bg-gradient-to-br from-success-500 to-emerald-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Today's Learning</h2>
            <p className="text-emerald-50">Five focused picks. Finish them and watch your streak grow.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="bg-white/15 text-white ring-white/20 hover:bg-white/25"
          onClick={() => navigate('library')}
        >
          Browse all <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>

      {queue.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="Queue cleared! 🎉"
          description="You've worked through everything that's pending. Add more learnings or revisit the library."
          action={<Button onClick={() => navigate('library')}>Go to Library</Button>}
        />
      ) : (
        <div className="space-y-4">
          {queue.map((item, index) => {
            const pct = progressPercent(item);
            const next = NEXT_STATUS[item.status];
            return (
              <Card key={item.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex items-center gap-3 lg:w-1/2">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                      {index + 1}
                    </span>
                    <PlatformIcon platform={item.platform} className="h-10 w-10 flex-shrink-0" />
                    <button onClick={() => openDetail(item.id)} className="min-w-0 text-left">
                      <h3 className="line-clamp-1 font-bold text-slate-900 hover:text-brand-600 dark:text-white">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <PriorityBadge priority={item.priority} />
                        <Badge color="slate">{item.category}</Badge>
                      </div>
                    </button>
                  </div>

                  <div className="lg:w-1/2 lg:border-l lg:border-slate-100 lg:pl-5 lg:dark:border-slate-800">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Progress</span>
                      <span className="font-extrabold text-brand-600 dark:text-brand-400">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} tone={pct === 100 ? 'success' : 'brand'} className="mb-2" />
                    <ProgressChecklist compact progress={item.progress} onToggle={(step) => toggleProgress(item.id, step)} />
                    <Button
                      variant="success"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => setStatus(item.id, next)}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Mark as Learned
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
