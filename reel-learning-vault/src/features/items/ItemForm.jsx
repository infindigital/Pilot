import { useState } from 'react';
import { FormRow, Input, Textarea, Select } from '../../components/ui/Field.jsx';
import { PLATFORMS, CATEGORIES, STATUSES, PRIORITIES } from '../../lib/constants.js';

// Shared form body. `mode="quick"` hides the knowledge-base fields for fast capture.
export default function ItemForm({ id, initial = {}, onChange, mode = 'full' }) {
  const [values, setValues] = useState(() => ({
    title: '',
    creator: '',
    platform: 'instagram',
    url: '',
    notes: '',
    category: 'AI',
    priority: 'medium',
    status: 'saved',
    summary: '',
    takeaways: '',
    actionSteps: '',
    ...initial,
  }));

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    onChange?.(next);
  };

  return (
    <form id={id} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <FormRow label="Title" htmlFor="f-title">
        <Input
          id="f-title"
          value={values.title}
          onChange={set('title')}
          placeholder="e.g. The 3-second hook that doubles watch time"
          required
          autoFocus
        />
      </FormRow>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormRow label="Creator Name" htmlFor="f-creator">
          <Input id="f-creator" value={values.creator} onChange={set('creator')} placeholder="e.g. Alex Hormozi" />
        </FormRow>
        <FormRow label="Platform" htmlFor="f-platform">
          <Select id="f-platform" value={values.platform} onChange={set('platform')}>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </Select>
        </FormRow>
      </div>

      <FormRow label="URL" htmlFor="f-url" hint="optional">
        <Input id="f-url" type="url" value={values.url} onChange={set('url')} placeholder="https://…" />
      </FormRow>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormRow label="Skill Category" htmlFor="f-category">
          <Select id="f-category" value={values.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </FormRow>
        <FormRow label="Priority" htmlFor="f-priority">
          <Select id="f-priority" value={values.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </Select>
        </FormRow>
        <FormRow label="Status" htmlFor="f-status">
          <Select id="f-status" value={values.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
        </FormRow>
      </div>

      <FormRow label="Notes" htmlFor="f-notes">
        <Textarea id="f-notes" value={values.notes} onChange={set('notes')} placeholder="Quick thought on why you saved this…" />
      </FormRow>

      {mode === 'full' && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Personal Knowledge Base
          </p>
          <FormRow label="Summary" htmlFor="f-summary">
            <Textarea id="f-summary" rows={2} value={values.summary} onChange={set('summary')} placeholder="One-line summary of the idea." />
          </FormRow>
          <FormRow label="Key Takeaways" htmlFor="f-takeaways">
            <Textarea id="f-takeaways" value={values.takeaways} onChange={set('takeaways')} placeholder="The core lessons worth remembering." />
          </FormRow>
          <FormRow label="Action Steps" htmlFor="f-actions">
            <Textarea id="f-actions" value={values.actionSteps} onChange={set('actionSteps')} placeholder="What will you actually do with this?" />
          </FormRow>
        </div>
      )}
    </form>
  );
}
