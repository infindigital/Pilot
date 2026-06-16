// Shared workflow rules. Statuses that count as "completed" for streaks,
// completion rate and the completedAt timestamp.

export const COMPLETED_ON_STATUS = new Set(['implemented', 'mastered']);

// Next status in the pipeline (used by the "Mark as Learned" quick action).
export const NEXT_STATUS = {
  saved: 'to-learn',
  'to-learn': 'learning',
  learning: 'implemented',
  implemented: 'mastered',
  mastered: 'mastered',
  archived: 'learning',
};
