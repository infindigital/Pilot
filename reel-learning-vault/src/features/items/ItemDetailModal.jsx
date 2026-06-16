import { useState, useEffect } from 'react';
import { ExternalLink, Star, Pencil, Trash2, Bell, Save } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { Badge, PriorityBadge } from '../../components/ui/Badge.jsx';
import { Select, Textarea, Label } from '../../components/ui/Field.jsx';
import PlatformIcon from './PlatformIcon.jsx';
import ProgressChecklist from './ProgressChecklist.jsx';
import { useVault } from '../../context/VaultContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { progressPercent } from '../../lib/model.js';
import { STATUSES, platformById } from '../../lib/constants.js';
import { formatDate } from '../../lib/dates.js';

export default function ItemDetailModal() {
  const { items, toggleProgress, setStatus, toggleFavorite, updateItem, deleteItem } = useVault();
  const { detailId, closeDetail, openEditor } = useUI();
  const item = items.find((i) => i.id === detailId);

  // Local editable copy of the knowledge-base fields.
  const [kb, setKb] = useState({ summary: '', takeaways: '', actionSteps: '' });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (item) {
      setKb({ summary: item.summary, takeaways: item.takeaways, actionSteps: item.actionSteps });
      setDirty(false);
    }
  }, [detailId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return null;

  const pct = progressPercent(item);
  const setField = (key) => (e) => {
    setKb((prev) => ({ ...prev, [key]: e.target.value }));
    setDirty(true);
  };
  const saveKb = () => {
    updateItem(item.id, kb);
    setDirty(false);
  };

  return (
    <Modal
      open={Boolean(detailId)}
      onClose={closeDetail}
      size="xl"
      title="Learning Detail"
      footer={
        <>
          <Button
            variant="danger-ghost"
            onClick={() => {
              if (confirm(`Delete "${item.title}"?`)) {
                deleteItem(item.id);
                closeDetail();
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" onClick={() => openEditor(item)}>
            <Pencil className="h-4 w-4" /> Edit all fields
          </Button>
          <Button onClick={saveKb} disabled={!dirty}>
            <Save className="h-4 w-4" /> Save notes
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: meta + knowledge base */}
        <div className="space-y-5 lg:col-span-3">
          <div className="flex items-start gap-3">
            <PlatformIcon platform={item.platform} className="h-11 w-11 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-extrabold leading-tight text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.creator || 'Unknown creator'} · {platformById(item.platform).label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(item.id, item.favorite)}
              aria-label="Toggle favorite"
              className="rounded-lg p-1.5 text-slate-300 hover:text-amber-400 dark:text-slate-600"
            >
              <Star className={item.favorite ? 'h-6 w-6 fill-amber-400 text-amber-400' : 'h-6 w-6'} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge color="brand">{item.category}</Badge>
            <PriorityBadge priority={item.priority} />
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-brand-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-brand-300"
              >
                <ExternalLink className="h-3 w-3" /> Open original
              </a>
            )}
          </div>

          {item.notes && (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              {item.notes}
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Personal Knowledge Base
            </p>
            <div>
              <Label htmlFor="d-summary">Summary</Label>
              <Textarea id="d-summary" rows={2} value={kb.summary} onChange={setField('summary')} placeholder="One-line summary…" />
            </div>
            <div>
              <Label htmlFor="d-takeaways">Key Takeaways</Label>
              <Textarea id="d-takeaways" value={kb.takeaways} onChange={setField('takeaways')} placeholder="Core lessons…" />
            </div>
            <div>
              <Label htmlFor="d-actions">Action Steps</Label>
              <Textarea id="d-actions" value={kb.actionSteps} onChange={setField('actionSteps')} placeholder="What you'll do with this…" />
            </div>
          </div>
        </div>

        {/* Right: status, progress, dates */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <Label htmlFor="d-status">Status</Label>
            <Select id="d-status" value={item.status} onChange={(e) => setStatus(item.id, e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </Select>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Progress</p>
              <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">{pct}%</span>
            </div>
            <ProgressBar value={pct} tone={pct === 100 ? 'success' : 'brand'} className="mb-3" />
            <ProgressChecklist progress={item.progress} onToggle={(step) => toggleProgress(item.id, step)} />
          </div>

          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Added</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Completed</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(item.completedAt)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <Bell className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={item.reminderAt ? item.reminderAt.slice(0, 10) : ''}
                onChange={(e) =>
                  updateItem(item.id, { reminderAt: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                aria-label="Set reminder date"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
