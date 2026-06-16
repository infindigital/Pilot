import { Trash2, CheckCheck, X } from 'lucide-react';
import { useVault } from '../../context/VaultContext.jsx';
import { STATUSES } from '../../lib/constants.js';

// Floating action bar shown when items are selected in the Library.
export default function BulkBar({ count, ids, onSelectAll, onClear }) {
  const { bulkStatus, bulkDelete } = useVault();

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex w-full max-w-3xl flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <span className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {count} selected
        </span>

        <button onClick={onSelectAll} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-300">
          <CheckCheck className="h-4 w-4" /> Select all
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="bulk-status">Set status</label>
          <select
            id="bulk-status"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                bulkStatus(ids, e.target.value);
                onClear();
              }
            }}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="" disabled>Set status…</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={() => {
              if (confirm(`Delete ${count} item${count > 1 ? 's' : ''}?`)) {
                bulkDelete(ids);
                onClear();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>

          <button onClick={onClear} aria-label="Clear selection" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
