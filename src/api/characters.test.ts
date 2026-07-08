import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { saveCharacter, listCharacters, deleteCharacter, updateCharacter } from './characters'

const ROW = {
  id: 'char-1',
  system_id: 'mazes',
  name: 'Grit',
  description: 'A tired mercenary.',
  image_uri: 'data:image/svg+xml,portrait',
  data: { role: 'Fighter' },
  created_at: '2026-07-08T00:00:00Z',
}

function mockClient(opts: {
  user?: { id: string } | null
  insertRow?: unknown
  insertError?: unknown
  listRows?: unknown[]
  listError?: unknown
  deleteError?: unknown
  updateRow?: unknown
  updateError?: unknown
}) {
  const single = vi
    .fn()
    .mockResolvedValue({ data: opts.insertRow ?? ROW, error: opts.insertError ?? null })
  const selectAfterInsert = vi.fn(() => ({ single }))
  const insert = vi.fn(() => ({ select: selectAfterInsert }))

  const order = vi
    .fn()
    .mockResolvedValue({ data: opts.listRows ?? [ROW], error: opts.listError ?? null })
  const eq = vi.fn(() => ({ order }))
  const selectForList = vi.fn(() => ({ eq }))

  const deleteEq = vi.fn().mockResolvedValue({ error: opts.deleteError ?? null })
  const del = vi.fn(() => ({ eq: deleteEq }))

  const updateSingle = vi
    .fn()
    .mockResolvedValue({ data: opts.updateRow ?? ROW, error: opts.updateError ?? null })
  const updateSelect = vi.fn(() => ({ single: updateSingle }))
  const updateEq = vi.fn(() => ({ select: updateSelect }))
  const update = vi.fn(() => ({ eq: updateEq }))

  const from = vi.fn(() => ({ insert, select: selectForList, delete: del, update }))
  const user = 'user' in opts ? opts.user : { id: 'user-1' }
  const auth = {
    getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
  }

  const client = { from, auth } as unknown as SupabaseClient
  return { client, from, insert, eq, order, del, deleteEq, auth, update, updateEq }
}

describe('saveCharacter', () => {
  it('inserts with the current user id and payload, returns a mapped record', async () => {
    const { client, from, insert } = mockClient({})
    const record = await saveCharacter(
      {
        systemId: 'mazes',
        name: 'Grit',
        description: 'A tired mercenary.',
        imageUri: 'data:image/svg+xml,portrait',
        data: { role: 'Fighter' },
      },
      client,
    )

    expect(from).toHaveBeenCalledWith('characters')
    expect(insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      system_id: 'mazes',
      name: 'Grit',
      description: 'A tired mercenary.',
      image_uri: 'data:image/svg+xml,portrait',
      data: { role: 'Fighter' },
    })
    expect(record).toEqual({
      id: 'char-1',
      systemId: 'mazes',
      name: 'Grit',
      description: 'A tired mercenary.',
      imageUri: 'data:image/svg+xml,portrait',
      data: { role: 'Fighter' },
      createdAt: '2026-07-08T00:00:00Z',
    })
  })

  it('defaults optional fields to null', async () => {
    const { client, insert } = mockClient({})
    await saveCharacter({ systemId: 'mazes', name: 'Grit', data: {} }, client)
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ description: null, image_uri: null }),
    )
  })

  it('throws when nobody is signed in', async () => {
    const { client } = mockClient({ user: null })
    await expect(
      saveCharacter({ systemId: 'mazes', name: 'Grit', data: {} }, client),
    ).rejects.toThrow(/signed in/)
  })

  it('throws when the insert fails', async () => {
    const { client } = mockClient({ insertError: new Error('boom') })
    await expect(
      saveCharacter({ systemId: 'mazes', name: 'Grit', data: {} }, client),
    ).rejects.toThrow('boom')
  })
})

describe('listCharacters', () => {
  it('queries the current user rows for the system and maps them', async () => {
    const { client, from, eq, order } = mockClient({})
    const rows = await listCharacters('mazes', client)

    expect(from).toHaveBeenCalledWith('characters')
    expect(eq).toHaveBeenCalledWith('system_id', 'mazes')
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(rows).toEqual([
      {
        id: 'char-1',
        systemId: 'mazes',
        name: 'Grit',
        description: 'A tired mercenary.',
        imageUri: 'data:image/svg+xml,portrait',
        data: { role: 'Fighter' },
        createdAt: '2026-07-08T00:00:00Z',
      },
    ])
  })

  it('throws when the query fails', async () => {
    const { client } = mockClient({ listError: new Error('nope') })
    await expect(listCharacters('mazes', client)).rejects.toThrow('nope')
  })
})

describe('deleteCharacter', () => {
  it('deletes the row by id', async () => {
    const { client, from, del, deleteEq } = mockClient({})
    await deleteCharacter('char-1', client)

    expect(from).toHaveBeenCalledWith('characters')
    expect(del).toHaveBeenCalled()
    expect(deleteEq).toHaveBeenCalledWith('id', 'char-1')
  })

  it('throws when the delete fails', async () => {
    const { client } = mockClient({ deleteError: new Error('denied') })
    await expect(deleteCharacter('char-1', client)).rejects.toThrow('denied')
  })
})

describe('updateCharacter', () => {
  it('updates the row by id with the payload and returns a mapped record', async () => {
    const { client, from, update, updateEq } = mockClient({})
    const record = await updateCharacter(
      'char-1',
      {
        name: 'Grit',
        description: 'A tired mercenary.',
        imageUri: 'data:image/svg+xml,portrait',
        data: { role: 'Fighter' },
      },
      client,
    )

    expect(from).toHaveBeenCalledWith('characters')
    expect(update).toHaveBeenCalledWith({
      name: 'Grit',
      description: 'A tired mercenary.',
      image_uri: 'data:image/svg+xml,portrait',
      data: { role: 'Fighter' },
    })
    expect(updateEq).toHaveBeenCalledWith('id', 'char-1')
    expect(record).toEqual({
      id: 'char-1',
      systemId: 'mazes',
      name: 'Grit',
      description: 'A tired mercenary.',
      imageUri: 'data:image/svg+xml,portrait',
      data: { role: 'Fighter' },
      createdAt: '2026-07-08T00:00:00Z',
    })
  })

  it('defaults optional fields to null', async () => {
    const { client, update } = mockClient({})
    await updateCharacter('char-1', { name: 'Grit', data: {} }, client)
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ description: null, image_uri: null }),
    )
  })

  it('throws when the update fails', async () => {
    const { client } = mockClient({ updateError: new Error('denied') })
    await expect(
      updateCharacter('char-1', { name: 'Grit', data: {} }, client),
    ).rejects.toThrow('denied')
  })
})
