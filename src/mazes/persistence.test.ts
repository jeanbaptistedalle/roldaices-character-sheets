import { describe, it, expect } from 'vitest'
import { emptyDraft, type CharacterDraft } from './rules/character'
import { draftToData, dataToDraft, summarize } from './persistence'
import type { CharacterRecord } from '../api'

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

function record(data: unknown): CharacterRecord {
  return {
    id: 'char-1',
    systemId: 'mazes',
    name: 'Grit',
    description: 'A tired mercenary.',
    imageUri: 'data:image/svg+xml,portrait',
    data,
    createdAt: '2026-07-08T00:00:00Z',
  }
}

describe('dataToDraft', () => {
  it('round-trips a plain character (draftToData ∘ dataToDraft is stable)', () => {
    const data = draftToData(fullDraft())
    expect(draftToData(dataToDraft(record(data)))).toEqual(data)
  })

  it('restores identity from the record columns, not from data', () => {
    const data = draftToData(fullDraft())
    const draft = dataToDraft(record(data))
    expect(draft.name).toBe('Grit')
    expect(draft.description).toBe('A tired mercenary.')
    expect(draft.imageUri).toBe('data:image/svg+xml,portrait')
  })

  it('recovers role, aspect, class and answer indices', () => {
    // jaded-sellsword: always well-armed, q0[0] rank, q1[1] veteran
    const draft = dataToDraft(record(draftToData(fullDraft())))
    expect(draft.role).toBe('Fighter')
    expect(draft.aspect).toBe('Sword')
    expect(draft.classId).toBe('jaded-sellsword')
    expect(draft.answers).toEqual([0, 1])
  })

  it('restores a player sub-choice but not a class preset', () => {
    // infernal-summoner: always magic PRESET "Summoning"; q1[options] include familiar with player sub-choice? use blazing-magician for player choice.
    const preset = dataToDraft(
      record(draftToData({ ...fullDraft(), classId: 'infernal-summoner', answers: [0, 0] })),
    )
    expect(preset.subChoices.always).toBeUndefined()

    const player = dataToDraft(
      record(
        draftToData({
          ...fullDraft(),
          classId: 'blazing-magician',
          answers: [0, 0],
          subChoices: { always: 'Night' },
        }),
      ),
    )
    expect(player.subChoices.always).toBe('Night')
  })

  it('round-trips a preset-bearing class', () => {
    const data = draftToData({ ...fullDraft(), classId: 'infernal-summoner', answers: [0, 0] })
    expect(draftToData(dataToDraft(record(data)))).toEqual(data)
  })

  it('throws when a stored edgeId matches no option in the class', () => {
    const data = draftToData(fullDraft()) as ReturnType<typeof draftToData>
    const broken = { ...data, edges: [{ edgeId: 'nonexistent' }, data.edges[1], data.edges[2]] }
    expect(() => dataToDraft(record(broken))).toThrow(/edgeId/)
  })
})
