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
    subChoices: {},
    name: 'Grit',
    description: 'A tired mercenary.',
    imageUri: 'data:image/svg+xml,portrait',
  }
}

describe('draftToData', () => {
  it('maps the class to three ordered edges: always, question 1, question 2', () => {
    const data = draftToData(fullDraft())
    expect(data).toEqual({
      role: 'Fighter',
      aspect: 'Sword',
      classId: 'jaded-sellsword',
      // jaded-sellsword: always = well-armed, q0[0] = rank, q1[1] = veteran
      edges: [{ edgeId: 'well-armed' }, { edgeId: 'rank' }, { edgeId: 'veteran' }],
    })
  })

  it('folds a class preset sub-choice into its edge', () => {
    // infernal-summoner: always = magic, preset "Summoning".
    const data = draftToData({ ...fullDraft(), classId: 'infernal-summoner', answers: [0, 0] })
    expect(data.edges[0]).toEqual({ edgeId: 'magic', subChoice: 'Summoning' })
  })

  it('folds a player sub-choice into the referring edge', () => {
    // blazing-magician: always = magic (needs a domain the player supplies).
    const data = draftToData({
      ...fullDraft(),
      classId: 'blazing-magician',
      answers: [0, 0],
      subChoices: { always: 'Night' },
    })
    expect(data.edges[0]).toEqual({ edgeId: 'magic', subChoice: 'Night' })
  })

  it('drops identity fields (they live in table columns)', () => {
    const data = draftToData(fullDraft())
    expect(data).not.toHaveProperty('name')
    expect(data).not.toHaveProperty('description')
    expect(data).not.toHaveProperty('imageUri')
  })

  it('throws when no class is chosen', () => {
    expect(() => draftToData({ ...fullDraft(), classId: undefined })).toThrow(
      /without a class/,
    )
  })

  it('throws when a class question is unanswered', () => {
    expect(() => draftToData({ ...fullDraft(), answers: [0, undefined] })).toThrow(
      /unanswered/,
    )
  })
})

describe('summarize', () => {
  const edges = [
    { edgeId: 'well-armed' },
    { edgeId: 'rank' },
    { edgeId: 'veteran' },
  ] as const

  it('renders role, aspect and class from ids', () => {
    expect(summarize(draftToData(fullDraft()))).toBe(
      'Fighter · Sword · The Jaded Sellsword',
    )
  })

  it('tolerates partial data', () => {
    expect(summarize({ role: 'Fighter', edges: [...edges] })).toBe('Fighter')
  })

  it('returns an empty string when role, aspect and class are absent', () => {
    expect(summarize({ edges: [...edges] })).toBe('')
  })
})
