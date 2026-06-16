import { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, Download, Upload, Plus, X, Star } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Select } from '../components/ui/Field.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ItemCard from '../features/items/ItemCard.jsx';
import BulkBar from '../features/items/BulkBar.jsx';
import { useVault } from '../context/VaultContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useFilteredItems } from '../hooks/useFilteredItems.js';
import { downloadCSV } from '../lib/csv.js';
import { PLATFORMS, CATEGORIES, STATUSES, PRIORITIES, SORT_OPTIONS } from '../lib/constants.js';
import { cn } from '../lib/cn.js';

export default function Library() {
  const { items } = useVault();
  const { navParams, openEditor, openImport } = useUI();
  const searchRef = useRef(null);

  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState(navParams.category || 'all');
  const [status, setStatus] = useState(navParams.status || 'all');
  const [priority, setPriority] = useState('all');
  const [sort, setSort] = useState('newest');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  // React to navigation params (e.g. arriving from Dashboard / Categories).
  useEffect(() => {
    if (navParams.category) setCategory(navParams.category);
    if (navParams.status) setStatus(navParams.status);
    if (navParams.favoritesOnly) setFavoritesOnly(true);
    if (navParams.focusSearch) searchRef.current?.focus();
  }, [navParams]);

  const filtered = useFilteredItems(items, {
    query,
    platform,
    category,
    status,
    priority,
    sort,
    favoritesOnly,
  });

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  const selectAllVisible = () => setSelected(new Set(filtered.map((i) => i.id)));

  const resetFilters = () => {
    setQuery('');
    setPlatform('all');
    setCategory('all');
    setStatus('all');
    setPriority('all');
    setFavoritesOnly(false);
  };

  const hasActiveFilters =
    query || platform !== 'all' || category !== 'all' || status !== 'all' || priority !== 'all' || favoritesOnly;

  return (
    <div className="space-y-5 pb-24">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, creator or notes…"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="md" onClick={() => downloadCSV(items)}>
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="secondary" size="md" onClick={openImport}>
                <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Import</span>
              </Button>
              <Button onClick={() => openEditor()}>
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <FilterSelect value={platform} onChange={setPlatform} allLabel="All platforms" options={PLATFORMS.map((p) => [p.id, p.label])} />
            <FilterSelect value={category} onChange={setCategory} allLabel="All categories" options={CATEGORIES.map((c) => [c, c])} />
            <FilterSelect value={status} onChange={setStatus} allLabel="All statuses" options={STATUSES.map((s) => [s.id, s.label])} />
            <FilterSelect value={priority} onChange={setPriority} allLabel="All priorities" options={PRIORITIES.map((p) => [p.id, p.label])} />
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFavoritesOnly((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                  favoritesOnly
                    ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
                )}
              >
                <Star className={cn('h-4 w-4', favoritesOnly && 'fill-amber-400 text-amber-400')} /> Favorites
              </button>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-auto">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} of {items.length} items
              {hasActiveFilters && (
                <button onClick={resetFilters} className="ml-2 inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline dark:text-brand-400">
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}
            </p>
            <button
              type="button"
              onClick={() => (selectMode ? clearSelection() : setSelectMode(true))}
              className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              {selectMode ? 'Cancel selection' : 'Select items'}
            </button>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={items.length ? 'No items match your filters' : 'Your vault is empty'}
          description={items.length ? 'Try adjusting or clearing the filters above.' : 'Add your first saved reel, short, post or tweet.'}
          action={
            items.length ? (
              <Button variant="secondary" onClick={resetFilters}>Clear filters</Button>
            ) : (
              <Button onClick={() => openEditor()}><Plus className="h-4 w-4" /> Add Learning</Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selectable={selectMode}
              selected={selected.has(item.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {selectMode && selected.size > 0 && (
        <BulkBar
          count={selected.size}
          ids={[...selected]}
          onSelectAll={selectAllVisible}
          onClear={clearSelection}
        />
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, allLabel, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      <option value="all">{allLabel}</option>
      {options.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}
