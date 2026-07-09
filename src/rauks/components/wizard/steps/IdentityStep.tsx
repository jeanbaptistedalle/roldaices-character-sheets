import { type Dispatch } from 'react'
import { PortraitPicker } from '../../../../shared/portraits'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { StepShell } from '../ui'

const inputClass =
  'mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none disabled:opacity-50'

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  return (
    <StepShell
      eyebrow="Step 3"
      title="Fill in the passport"
      intro="A name is required; the rest of the passport is up to you."
    >
      <div className="mx-auto max-w-xl space-y-6">
        <label className="block">
          <span className="text-sm font-semibold text-stone-200">
            Name <span className="text-amber-500">*</span>
          </span>
          <input
            type="text"
            value={draft.name ?? ''}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
            placeholder="e.g. Arakel Sarif"
            autoFocus
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-200">Origin</span>
          <input
            type="text"
            value={draft.imperial ? 'Imperial' : draft.origin ?? ''}
            disabled={draft.imperial}
            onChange={(e) => dispatch({ type: 'setOrigin', origin: e.target.value })}
            placeholder="City or culture of origin"
            className={inputClass}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(draft.imperial)}
            onChange={(e) => dispatch({ type: 'setImperial', value: e.target.checked })}
            className="h-4 w-4 rounded border-stone-700 bg-stone-950 accent-amber-600"
          />
          <span className="text-sm text-stone-300">Imperial origin (no city — the Empire itself)</span>
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-stone-200">Sex</span>
            <input
              type="text"
              value={draft.sex ?? ''}
              onChange={(e) => dispatch({ type: 'setSex', sex: e.target.value })}
              placeholder="Declarative"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-200">Birth date</span>
            <input
              type="text"
              value={draft.birthDate ?? ''}
              onChange={(e) => dispatch({ type: 'setBirthDate', birthDate: e.target.value })}
              placeholder="Imperial calendar, e.g. 3rd of the 2nd month"
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-stone-200">Rauksorg</span>
          <input
            type="text"
            value={draft.rauksorg ?? ''}
            onChange={(e) => dispatch({ type: 'setRauksorg', rauksorg: e.target.value })}
            placeholder="The Rauks unit this character belongs to"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-200">Description</span>
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => dispatch({ type: 'setDescription', description: e.target.value })}
            placeholder="A short description, backstory, or notable quirk…"
            rows={4}
            className={inputClass + ' resize-y'}
          />
        </label>

        <PortraitPicker
          value={draft.imageUri ?? ''}
          onChange={(imageUri) => dispatch({ type: 'setImage', imageUri })}
        />
      </div>
    </StepShell>
  )
}
