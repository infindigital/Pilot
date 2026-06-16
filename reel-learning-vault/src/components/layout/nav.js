import {
  LayoutDashboard,
  Library,
  Flame,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Trophy,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: "Today's Learning", icon: Flame },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'categories', label: 'Categories', icon: FolderKanban },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];
