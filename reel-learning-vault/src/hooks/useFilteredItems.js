import { useMemo } from 'react';
import { progressPercent } from '../lib/model.js';
import { PRIORITIES } from '../lib/constants.js';

const priorityRank = PRIORITIES.reduce((acc, p, idx) => {
  acc[p.id] = PRIORITIES.length - idx; // high = highest
  return acc;
}, {});

// Single source of truth for searching / filtering / sorting the item list.
export function useFilteredItems(items, { query, platform, category, status, priority, sort, favoritesOnly }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = items.filter((item) => {
      if (favoritesOnly && !item.favorite) return false;
      if (platform !== 'all' && item.platform !== platform) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (priority !== 'all' && item.priority !== priority) return false;
      if (q) {
        const haystack = `${item.title} ${item.creator} ${item.notes} ${item.summary} ${item.takeaways}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          return priorityRank[b.priority] - priorityRank[a.priority];
        case 'progress':
          return progressPercent(b) - progressPercent(a);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [items, query, platform, category, status, priority, sort, favoritesOnly]);
}
