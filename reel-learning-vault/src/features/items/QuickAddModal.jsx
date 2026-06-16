import { useRef } from 'react';
import { Zap } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import ItemForm from './ItemForm.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useVault } from '../../context/VaultContext.jsx';

// Stripped-down capture flow — paste a link, give it a title, done.
export default function QuickAddModal() {
  const { quickAddOpen, closeQuickAdd } = useUI();
  const { addItem } = useVault();
  const draft = useRef(null);

  const handleAdd = () => {
    const values = draft.current;
    if (!values || !values.title?.trim()) return;
    addItem(values);
    closeQuickAdd();
  };

  return (
    <Modal
      open={quickAddOpen}
      onClose={closeQuickAdd}
      size="md"
      title="Quick Add"
      footer={
        <>
          <Button variant="secondary" onClick={closeQuickAdd}>Cancel</Button>
          <Button variant="success" onClick={handleAdd}>
            <Zap className="h-4 w-4" /> Save
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Capture it now, enrich it later. Add the full summary &amp; action steps when you actually sit down to learn.
      </p>
      <ItemForm id="quick-add-form" mode="quick" onChange={(v) => { draft.current = v; }} />
    </Modal>
  );
}
