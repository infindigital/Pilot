// Gamification badge definitions. Each badge has an `earned(stats)` predicate so
// adding new milestones is a one-line change.

import { getStats, getStreak } from './analytics.js';

export const BADGE_DEFS = [
  {
    id: 'first-implementation',
    icon: '🏆',
    title: 'First Implementation',
    description: 'Implement your first saved learning.',
    earned: ({ stats }) => stats.completed >= 1,
    progress: ({ stats }) => Math.min(stats.completed, 1) / 1,
  },
  {
    id: 'seven-day-streak',
    icon: '🔥',
    title: '7 Day Streak',
    description: 'Learn something 7 days in a row.',
    earned: ({ streak }) => streak >= 7,
    progress: ({ streak }) => Math.min(streak, 7) / 7,
  },
  {
    id: 'twentyfive-completed',
    icon: '⚡',
    title: '25 Lessons Completed',
    description: 'Complete 25 learnings.',
    earned: ({ stats }) => stats.completed >= 25,
    progress: ({ stats }) => Math.min(stats.completed, 25) / 25,
  },
  {
    id: 'hundred-mastered',
    icon: '🚀',
    title: '100 Learnings Mastered',
    description: 'Master 100 learnings.',
    earned: ({ stats }) => stats.mastered >= 100,
    progress: ({ stats }) => Math.min(stats.mastered, 100) / 100,
  },
];

export function evaluateBadges(items) {
  const ctx = { stats: getStats(items), streak: getStreak(items) };
  return BADGE_DEFS.map((b) => ({
    ...b,
    isEarned: b.earned(ctx),
    pct: Math.round(b.progress(ctx) * 100),
  }));
}
