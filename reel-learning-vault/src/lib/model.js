// Item factory + normalisation helpers. Keeping the shape in one place makes it
// trivial to add fields later (e.g. aiSummary, transcript, sourceMeta) and have
// older saved records auto-upgrade on load.

import { uid } from './storage.js';
import { PROGRESS_STEPS } from './constants.js';

export const emptyProgress = () =>
  PROGRESS_STEPS.reduce((acc, step) => {
    acc[step.id] = false;
    return acc;
  }, {});

export function createItem(partial = {}) {
  const now = new Date().toISOString();
  return {
    id: uid(),
    title: '',
    creator: '',
    platform: 'instagram',
    url: '',
    notes: '',
    category: 'AI',
    priority: 'medium',
    status: 'saved',
    favorite: false,
    reminderAt: null, // ISO date string or null
    progress: emptyProgress(),
    // Personal knowledge base fields
    summary: '',
    takeaways: '',
    actionSteps: '',
    createdAt: now,
    updatedAt: now,
    completedAt: null, // set when item reaches implemented/mastered
    ...partial,
    // Always ensure progress has every key even if partial is incomplete.
    progress: { ...emptyProgress(), ...(partial.progress || {}) },
  };
}

// Normalise an arbitrary record (e.g. from older storage or CSV import) into a
// valid item, filling in any missing keys.
export function normalizeItem(raw) {
  return createItem(raw);
}

export const progressPercent = (item) => {
  const steps = Object.values(item.progress || {});
  if (!steps.length) return 0;
  const done = steps.filter(Boolean).length;
  return Math.round((done / steps.length) * 100);
};

export const progressCount = (item) => {
  const steps = Object.values(item.progress || {});
  return {
    done: steps.filter(Boolean).length,
    total: steps.length,
  };
};
