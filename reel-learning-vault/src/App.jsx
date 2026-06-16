import { lazy, Suspense, useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Queue from './pages/Queue.jsx';
import Library from './pages/Library.jsx';
import Categories from './pages/Categories.jsx';
import Calendar from './pages/Calendar.jsx';
import Achievements from './pages/Achievements.jsx';

// Analytics pulls in Recharts (~300kB) — load it on demand to keep the initial
// bundle small.
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
import ItemEditorModal from './features/items/ItemEditorModal.jsx';
import ItemDetailModal from './features/items/ItemDetailModal.jsx';
import QuickAddModal from './features/items/QuickAddModal.jsx';
import ImportModal from './features/items/ImportModal.jsx';
import { useUI } from './context/UIContext.jsx';

const PAGES = {
  dashboard: Dashboard,
  queue: Queue,
  library: Library,
  categories: Categories,
  calendar: Calendar,
  analytics: Analytics,
  achievements: Achievements,
};

export default function App() {
  const { page } = useUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const Page = PAGES[page] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-400">
                Loading…
              </div>
            }
          >
            <Page key={page} />
          </Suspense>
        </main>
      </div>

      {/* Global modals (rendered once, controlled via UIContext) */}
      <ItemEditorModal />
      <ItemDetailModal />
      <QuickAddModal />
      <ImportModal />
    </div>
  );
}
