import { describe, it, expect } from 'vitest'
import { draftToData, dataToDraft, summarize, type RauksData } from './persistence'
import { emptyDraft, type CharacterDraft } from './rules/character'
import type { CharacterRecord } from '../api'

function completeDraft(): CharacterDraft {
  return {
    ...emptyDraft(),
    traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
    skillIds: ['gorilla', 'shadow', 'lawyer'],
    name: 'Arakel',
    origin: 'Vhalto',
    sex: 'F',
    birthDate: '3/2/6',
    rauksorg: 'Orsk-7',
    description: 'A weary investigator.',
    imageUri: 'https://example.test/p.svg',
  }
}

function recordFrom(draft: CharacterDraft, data: RauksData): CharacterRecord {
  return {
    id: 'id-1',
    systemId: 'rauks',
    name: draft.name ?? '',
    description: draft.description ?? null,
    imageUri: draft.imageUri ?? null,
    data,
    createdAt: '2026-07-09T00:00:00Z',
  }
}

describe('persistence', () => {
  it('draftToData keeps mechanics and Rauks identity, drops shared columns', () => {
    const data = draftToData(completeDraft())
    expect(data.traits.physical).toBe(4)
    expect(data.skillIds).toEqual(['gorilla', 'shadow', 'lawyer'])
    expect(data.origin).toBe('Vhalto')
    expect(data.rauksorg).toBe('Orsk-7')
    // name/description/imageUri are stored as columns, not in data.
    expect('name' in data).toBe(false)
  })

  it('draftToData trims traitsAndTrauma and omits the key when empty', () => {
    expect(draftToData(completeDraft()).traitsAndTrauma).toBeUndefined()
    const withTraits = { ...completeDraft(), traitsAndTrauma: [' A limp from Vhalto ', '  '] }
    expect(draftToData(withTraits).traitsAndTrauma).toEqual(['A limp from Vhalto'])
  })

  it('draftToData throws on an incomplete draft', () => {
    expect(() => draftToData(emptyDraft())).toThrow()
  })

  it('round-trips through dataToDraft', () => {
    const draft = completeDraft()
    const data = draftToData(draft)
    const restored = dataToDraft(recordFrom(draft, data))
    expect(restored.traits).toEqual(draft.traits)
    expect(restored.skillIds).toEqual(draft.skillIds)
    expect(restored.name).toBe('Arakel')
    expect(restored.origin).toBe('Vhalto')
    expect(restored.description).toBe('A weary investigator.')
    expect(restored.imageUri).toBe('https://example.test/p.svg')
    expect(restored.traitsAndTrauma).toEqual([])
  })

  it('round-trips remainingRerolls, and omits it from data when unset', () => {
    expect(draftToData(completeDraft()).remainingRerolls).toBeUndefined()
    const draft = { ...completeDraft(), remainingRerolls: 3 }
    const data = draftToData(draft)
    expect(data.remainingRerolls).toBe(3)
    expect(dataToDraft(recordFrom(draft, data)).remainingRerolls).toBe(3)
  })

  it('summarize lists the chosen skill names', () => {
    expect(summarize(draftToData(completeDraft()))).toBe('Gorilla · Shadow · Lawyer')
    const one: RauksData = {
      traits: completeDraft().traits, skillIds: ['gorilla'],
    }
    expect(summarize(one)).toBe('Gorilla')
    const anon: RauksData = { traits: completeDraft().traits, skillIds: [] }
    expect(summarize(anon)).toBe('No skills')
  })

  it('summarize localizes skill names and the empty label via the translator', () => {
    const t = (key: string) =>
      key === 'terms.skills.gorilla'
        ? 'Gorille'
        : key === 'home.noSkills'
          ? 'Aucune compétence'
          : key
    const one: RauksData = { traits: completeDraft().traits, skillIds: ['gorilla'] }
    expect(summarize(one, t)).toBe('Gorille')
    const anon: RauksData = { traits: completeDraft().traits, skillIds: [] }
    expect(summarize(anon, t)).toBe('Aucune compétence')
  })
})
