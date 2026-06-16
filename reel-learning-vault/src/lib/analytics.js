// Pure functions that turn the item array into the numbers, series and streaks
// the dashboard, calendar and analytics pages render. Keeping these pure makes
// them cheap to memoise and easy to unit-test later.

import { progressPercent } from './model.js';
import { PLATFORMS, CATEGORIES, platformById } from './constants.js';
import { startOfDay, startOfWeek, isThisWeek, monthKey, monthLabel } from './dates.js';

const COMPLETED_STATUSES = new Set(['implemented', 'mastered']);

export function getStats(items) {
  const total = items.length;
  const byStatus = (id) => items.filter((i) => i.status === id).length;

  const toLearn = byStatus('to-learn');
  const learning = byStatus('learning');
  const implemented = byStatus('implemented');
  const mastered = byStatus('mastered');
  const archived = byStatus('archived');

  // Completion rate = items that reached implemented or mastered, out of all
  // non-archived items (archived are intentionally parked, not failures).
  const active = items.filter((i) => i.status !== 'archived');
  const completed = active.filter((i) => COMPLETED_STATUSES.has(i.status)).length;
  const completionRate = active.length
    ? Math.round((completed / active.length) * 100)
    : 0;

  return {
    total,
    saved: byStatus('saved'),
    toLearn,
    learning,
    implemented,
    mastered,
    archived,
    completed: implemented + mastered,
    completionRate,
  };
}

// ----- Calendar / streak -----

export function getWeekActivity(items) {
  const addedThisWeek = items.filter((i) => isThisWeek(i.createdAt)).length;
  const completedThisWeek = items.filter(
    (i) => i.completedAt && isThisWeek(i.completedAt),
  ).length;
  return { addedThisWeek, completedThisWeek, weekStart: startOfWeek() };
}

// A "learning day" = a day where something was created or completed. The streak
// counts consecutive days up to today with at least one learning action.
export function getStreak(items) {
  const active = new Set();
  for (const item of items) {
    if (item.createdAt) active.add(startOfDay(item.createdAt).getTime());
    if (item.completedAt) active.add(startOfDay(item.completedAt).getTime());
  }
  let streak = 0;
  const cursor = startOfDay(new Date());
  // Allow the streak to still count if today has no activity yet but yesterday did.
  if (!active.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (active.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ----- Chart series -----

export function categorySeries(items) {
  return CATEGORIES.map((name) => ({
    name,
    total: items.filter((i) => i.category === name).length,
    completed: items.filter(
      (i) => i.category === name && COMPLETED_STATUSES.has(i.status),
    ).length,
  })).filter((row) => row.total > 0);
}

export function platformSeries(items) {
  return PLATFORMS.map((p) => ({
    name: p.label,
    value: items.filter((i) => i.platform === p.id).length,
    color: p.color,
  })).filter((row) => row.value > 0);
}

export function completionSeries(items) {
  const active = items.filter((i) => i.status !== 'archived');
  const completed = active.filter((i) => COMPLETED_STATUSES.has(i.status)).length;
  const remaining = Math.max(active.length - completed, 0);
  return [
    { name: 'Completed', value: completed, color: '#22C55E' },
    { name: 'In progress', value: remaining, color: '#C7D2FE' },
  ];
}

// Monthly trend: items added vs completed over the last 6 months.
export function monthlyTrend(items, monthsBack = 6) {
  const buckets = new Map();
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d.toISOString());
    buckets.set(key, { month: monthLabel(key), added: 0, completed: 0 });
  }
  for (const item of items) {
    const aKey = monthKey(item.createdAt);
    if (buckets.has(aKey)) buckets.get(aKey).added += 1;
    if (item.completedAt) {
      const cKey = monthKey(item.completedAt);
      if (buckets.has(cKey)) buckets.get(cKey).completed += 1;
    }
  }
  return [...buckets.values()];
}

// Category counts for the Categories page (includes top platform per category).
export function categoryGroups(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category).push(item);
  }
  return [...map.entries()]
    .map(([name, list]) => {
      const completed = list.filter((i) => COMPLETED_STATUSES.has(i.status)).length;
      const avgProgress = Math.round(
        list.reduce((sum, i) => sum + progressPercent(i), 0) / list.length,
      );
      const topPlatform = platformById(
        mode(list.map((i) => i.platform)),
      );
      return { name, count: list.length, completed, avgProgress, topPlatform };
    })
    .sort((a, b) => b.count - a.count);
}

function mode(arr) {
  const counts = {};
  let best = arr[0];
  let bestN = 0;
  for (const v of arr) {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > bestN) {
      bestN = counts[v];
      best = v;
    }
  }
  return best;
}
