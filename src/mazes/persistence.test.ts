import { describe, it, expect } from 'vitest'
import { emptyDraft, type CharacterDraft } from './rules/character'
import { draftToData, summarize } from './persistence'

function fullDraft(): CharacterDraft {
  return {
    ...emptyDraft(),
    role: 'Fighter',
    aspect: 'Sword',
    classId: 'jaded-sellsword',
    answers: [0, 1],
    subChoices: { always: 'Sworn Swords' },
    name: 'Grit',
    description: 'A tired mercenary.',
    imageUri: 'data:image/svg+xml,portrait',
  }
}

describe('draftToData', () => {
  it('keeps the mechanical ids', () => {
    const data = draftToData(fullDraft())
    expect(data).toEqual({
      role: 'Fighter',
      aspect: 'Sword',
      classId: 'jaded-sellsword',
      answers: [0, 1],
      subChoices: { always: 'Sworn Swords' },
    })
  })

  it('drops identity fields (they live in table columns)', () => {
    const data = draftToData(fullDraft())
    expect(data).not.toHaveProperty('name')
    expect(data).not.toHaveProperty('description')
    expect(data).not.toHaveProperty('imageUri')
  })
})

describe('summarize', () => {
  it('renders role, aspect and class from ids', () => {
    expect(summarize(draftToData(fullDraft()))).toBe(
      'd8 Fighter · Sword · The Jaded Sellsword',
    )
  })

  it('tolerates partial data', () => {
    expect(summarize({ role: 'Fighter', answers: [undefined, undefined], subChoices: {} })).toBe(
      'd8 Fighter',
    )
  })

  it('returns an empty string for empty data', () => {
    expect(summarize({ answers: [undefined, undefined], subChoices: {} })).toBe('')
  })
})
