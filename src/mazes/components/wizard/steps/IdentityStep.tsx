import { type Dispatch } from 'react'
import { PortraitPicker } from '../../../../shared/portraits'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { StepShell } from '../ui'

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  return (
    <StepShell
      eyebrow="Step 5"
      title="Name your character"
      intro="Give your character an identity. A name is required; the rest is up to you."
    >
      <div className="mx-auto max-w-xl space-y-6">
        {/* Name */}
        <label className="block">
          <span className="text-sm font-semibold text-stone-200">
            Name <span className="text-amber-500">*</span>
          </span>
          <input
            type="text"
            value={draft.name ?? ''}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
            placeholder="e.g. Ironwolf"
            autoFocus
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-sm font-semibold text-stone-200">Description</span>
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => dispatch({ type: 'setDescription', description: e.target.value })}
            placeholder="A short description, backstory, or notable quirk…"
            rows={4}
            className="mt-1 w-full resize-y rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </label>

        {/* Portrait gallery */}
        <PortraitPicker
          value={draft.imageUri ?? ''}
          onChange={(imageUri) => dispatch({ type: 'setImage', imageUri })}
        />
      </div>
    </StepShell>
  )
}
