// Seed data used the first time the app runs (or via "Load sample data").
// Dates are generated relative to "now" so the calendar/streak widgets look
// alive on first launch.

import { createItem } from './model.js';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const raw = [
  {
    title: 'The 3-second hook that doubles watch time',
    creator: 'Alex Hormozi',
    platform: 'instagram',
    category: 'Copywriting',
    priority: 'high',
    status: 'implemented',
    favorite: true,
    notes: 'Open with a contrarian statement, then justify it.',
    summary: 'Strong hooks front-load tension in the first 3 seconds.',
    takeaways: 'Lead with the boldest claim. Cut the intro entirely.',
    actionSteps: 'Rewrite next 5 reel intros to start on the claim.',
    progress: { watched: true, tookNotes: true, practiced: true, implemented: true, sharedWithTeam: false },
    addedDelta: 12,
    completeDelta: 4,
  },
  {
    title: 'Programmatic SEO for service pages',
    creator: 'Marie Haynes',
    platform: 'youtube',
    category: 'SEO',
    priority: 'high',
    status: 'learning',
    notes: 'Template + dataset = hundreds of indexable pages.',
    summary: 'Generate location/feature landing pages from a single template.',
    takeaways: 'Need a clean dataset and unique intros to avoid thin content.',
    actionSteps: 'Map out 50 city pages for the travel site.',
    progress: { watched: true, tookNotes: true, practiced: false, implemented: false, sharedWithTeam: false },
    addedDelta: 3,
  },
  {
    title: 'Meta Ads creative testing framework',
    creator: 'Nick Theriot',
    platform: 'youtube',
    category: 'Meta Ads',
    priority: 'high',
    status: 'to-learn',
    notes: '3-2-2 method for scaling winning creatives.',
    addedDelta: 1,
  },
  {
    title: 'Build an n8n lead-routing workflow',
    creator: 'n8n',
    platform: 'linkedin',
    category: 'Automation',
    priority: 'medium',
    status: 'implemented',
    summary: 'Route inbound leads to the right rep automatically.',
    takeaways: 'Webhook → enrich → score → Slack notify.',
    actionSteps: 'Connect the contact form webhook this week.',
    progress: { watched: true, tookNotes: true, practiced: true, implemented: true, sharedWithTeam: true },
    addedDelta: 9,
    completeDelta: 2,
    favorite: true,
  },
  {
    title: 'Prompt patterns that actually reduce hallucination',
    creator: 'Anthropic',
    platform: 'twitter',
    category: 'AI',
    priority: 'high',
    status: 'learning',
    notes: 'Give the model an out: "say I don\'t know".',
    progress: { watched: true, tookNotes: false, practiced: false, implemented: false, sharedWithTeam: false },
    addedDelta: 2,
  },
  {
    title: 'Notion dashboard for content repurposing',
    creator: 'Thomas Frank',
    platform: 'youtube',
    category: 'Productivity',
    priority: 'medium',
    status: 'saved',
    addedDelta: 0,
  },
  {
    title: 'Color theory crash course for non-designers',
    creator: 'The Futur',
    platform: 'instagram',
    category: 'Design',
    priority: 'low',
    status: 'mastered',
    summary: '60-30-10 rule for balanced palettes.',
    takeaways: 'Pick one dominant, one secondary, one accent.',
    progress: { watched: true, tookNotes: true, practiced: true, implemented: true, sharedWithTeam: true },
    addedDelta: 20,
    completeDelta: 6,
  },
  {
    title: 'Cold email opener that books calls',
    creator: 'Jeremy Miner',
    platform: 'linkedin',
    category: 'Sales',
    priority: 'medium',
    status: 'to-learn',
    notes: 'Permission-based opener lowers resistance.',
    addedDelta: 5,
  },
  {
    title: 'Google Ads: negative keyword sculpting',
    creator: 'Surfside PPC',
    platform: 'youtube',
    category: 'Google Ads',
    priority: 'medium',
    status: 'learning',
    progress: { watched: true, tookNotes: true, practiced: false, implemented: false, sharedWithTeam: false },
    addedDelta: 6,
  },
  {
    title: 'The offer stack that makes price irrelevant',
    creator: 'Alex Hormozi',
    platform: 'instagram',
    category: 'Business',
    priority: 'high',
    status: 'saved',
    favorite: true,
    addedDelta: 1,
  },
  {
    title: 'Faceless YouTube automation channel setup',
    creator: 'Money Mike',
    platform: 'youtube',
    category: 'Automation',
    priority: 'low',
    status: 'archived',
    addedDelta: 40,
  },
  {
    title: 'Hook + retention editing in CapCut',
    creator: 'Editing Corp',
    platform: 'instagram',
    category: 'Design',
    priority: 'medium',
    status: 'to-learn',
    addedDelta: 4,
  },
];

export function getSampleItems() {
  return raw.map(({ addedDelta = 0, completeDelta, ...rest }) => {
    const createdAt = daysAgo(addedDelta);
    const completedAt =
      completeDelta != null ? daysAgo(completeDelta) : null;
    return createItem({ ...rest, createdAt, updatedAt: createdAt, completedAt });
  });
}
