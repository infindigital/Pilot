import { useState } from 'react';
import { Upload, FileCheck2, AlertTriangle } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useVault } from '../../context/VaultContext.jsx';
import { csvToItems } from '../../lib/csv.js';

export default function ImportModal() {
  const { importOpen, closeImport } = useUI();
  const { importItems } = useVault();
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('merge');

  const reset = () => {
    setParsed(null);
    setError('');
    setMode('merge');
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const items = csvToItems(text);
      if (!items.length) throw new Error('No valid rows found in the file.');
      setParsed(items);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not parse the CSV file.');
      setParsed(null);
    }
  };

  const confirmImport = () => {
    if (!parsed) return;
    importItems(parsed, mode);
    reset();
    closeImport();
  };

  return (
    <Modal
      open={importOpen}
      onClose={() => {
        reset();
        closeImport();
      }}
      size="md"
      title="Import from CSV"
      footer={
        <>
          <Button variant="secondary" onClick={() => { reset(); closeImport(); }}>Cancel</Button>
          <Button onClick={confirmImport} disabled={!parsed}>
            Import {parsed ? `${parsed.length} item${parsed.length > 1 ? 's' : ''}` : ''}
          </Button>
        </>
      }
    >
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-800/40">
        <Upload className="mb-3 h-8 w-8 text-brand-500" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Click to choose a .csv file
        </span>
        <span className="mt-1 text-xs text-slate-400">
          Use a file exported from Reel Learning Vault for best results.
        </span>
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
      </label>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      )}

      {parsed && (
        <div className="mt-4 space-y-3">
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <FileCheck2 className="h-4 w-4" /> Ready to import {parsed.length} items.
          </p>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">How should these be added?</legend>
            {[
              { id: 'merge', label: 'Merge with existing', desc: 'Keep current items, add/update imported ones.' },
              { id: 'replace', label: 'Replace everything', desc: 'Delete current items and use only the imported file.' },
            ].map((opt) => (
              <label key={opt.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <input
                  type="radio"
                  name="import-mode"
                  value={opt.id}
                  checked={mode === opt.id}
                  onChange={() => setMode(opt.id)}
                  className="mt-0.5 h-4 w-4 text-brand-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{opt.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{opt.desc}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      )}
    </Modal>
  );
}
