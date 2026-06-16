import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

// Holds lightweight app-shell state: which page is active, any navigation params
// (e.g. a category to pre-filter the library by), and the global modal stack.
export function UIProvider({ children }) {
  const [page, setPage] = useState('dashboard');
  const [navParams, setNavParams] = useState({});
  const [editor, setEditor] = useState({ open: false, item: null });
  const [detailId, setDetailId] = useState(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const navigate = useCallback((nextPage, params = {}) => {
    setPage(nextPage);
    setNavParams(params);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(
    () => ({
      page,
      navParams,
      navigate,
      // editor (add / edit)
      editor,
      openEditor: (item = null) => setEditor({ open: true, item }),
      closeEditor: () => setEditor({ open: false, item: null }),
      // detail drawer
      detailId,
      openDetail: (id) => setDetailId(id),
      closeDetail: () => setDetailId(null),
      // quick add
      quickAddOpen,
      openQuickAdd: () => setQuickAddOpen(true),
      closeQuickAdd: () => setQuickAddOpen(false),
      // import
      importOpen,
      openImport: () => setImportOpen(true),
      closeImport: () => setImportOpen(false),
    }),
    [page, navParams, navigate, editor, detailId, quickAddOpen, importOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};
