import { useRef } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import ItemForm from './ItemForm.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useVault } from '../../context/VaultContext.jsx';

// Full add / edit modal. Driven by UIContext's `editor` state.
export default function ItemEditorModal() {
  const { editor, closeEditor } = useUI();
  const { addItem, updateItem } = useVault();
  const draft = useRef(null);
  const isEdit = Boolean(editor.item);

  const handleSave = () => {
    const values = draft.current || editor.item;
    if (!values || !values.title?.trim()) return;
    if (isEdit) {
      updateItem(editor.item.id, values);
    } else {
      addItem(values);
    }
    closeEditor();
  };

  return (
    <Modal
      open={editor.open}
      onClose={closeEditor}
      size="lg"
      title={isEdit ? 'Edit Learning Item' : 'Add Learning Item'}
      footer={
        <>
          <Button variant="secondary" onClick={closeEditor}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add to Vault'}</Button>
        </>
      }
    >
      <ItemForm
        id="item-editor-form"
        initial={editor.item || {}}
        onChange={(v) => {
          draft.current = v;
        }}
      />
    </Modal>
  );
}
