// Centralised domain configuration. Everything that drives dropdowns, badges,
// colours and workflow lives here so new platforms/categories/statuses can be
// added in one place (future-ready for AI tagging, new integrations, etc.).

export const STORAGE_KEY = 'rlv:data:v1';
export const THEME_KEY = 'rlv:theme';

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'twitter', label: 'Twitter/X', color: '#1D9BF0' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'other', label: 'Other', color: '#64748B' },
];

export const CATEGORIES = [
  'SEO',
  'Google Ads',
  'Meta Ads',
  'AI',
  'Automation',
  'Design',
  'Sales',
  'Copywriting',
  'Business',
  'Productivity',
];

// Status workflow — order matters, it defines the pipeline progression.
export const STATUSES = [
  { id: 'saved', label: 'Saved', color: 'slate' },
  { id: 'to-learn', label: 'To Learn', color: 'amber' },
  { id: 'learning', label: 'Learning', color: 'blue' },
  { id: 'implemented', label: 'Implemented', color: 'emerald' },
  { id: 'mastered', label: 'Mastered', color: 'violet' },
  { id: 'archived', label: 'Archived', color: 'zinc' },
];

export const PRIORITIES = [
  { id: 'high', label: 'High', color: 'rose' },
  { id: 'medium', label: 'Medium', color: 'amber' },
  { id: 'low', label: 'Low', color: 'slate' },
];

// The five progress checkpoints used to compute the per-item percentage.
export const PROGRESS_STEPS = [
  { id: 'watched', label: 'Watched' },
  { id: 'tookNotes', label: 'Took Notes' },
  { id: 'practiced', label: 'Practiced' },
  { id: 'implemented', label: 'Implemented' },
  { id: 'sharedWithTeam', label: 'Shared With Team' },
];

// Tailwind class lookups keyed by the semantic colour name above. Kept as full
// class strings so Tailwind's JIT can detect them.
export const BADGE_CLASSES = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  zinc: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'priority', label: 'Highest Priority' },
  { id: 'progress', label: 'Highest Progress' },
];

// Helper lookups
export const statusById = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];
export const priorityById = (id) => PRIORITIES.find((p) => p.id === id) || PRIORITIES[1];
export const platformById = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[5];
