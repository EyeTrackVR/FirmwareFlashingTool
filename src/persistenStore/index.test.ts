import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePersistentStore } from './index'
import { Store } from 'tauri-plugin-store-api'
import { PersistentSettings } from '@interfaces/settings/interfaces'

vi.mock('tauri-plugin-store-api', () => {
    const storeMock = {
        save: vi.fn().mockResolvedValue(undefined),
        load: vi.fn().mockResolvedValue(undefined),
        has: vi.fn().mockResolvedValue(false),
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined),
        reset: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(true),
        keys: vi.fn().mockResolvedValue([]),
        onChange: vi.fn().mockResolvedValue(() => {}),
    }

    return { Store: vi.fn(() => storeMock) }
})

describe('usePersistentStore', () => {
    let store: ReturnType<typeof usePersistentStore>
    let mockStore: Store

    beforeEach(() => {
        vi.clearAllMocks()
        store = usePersistentStore()
        mockStore = new Store('.app-settings.bin')
    })

    it('save', async () => {
        await store.save()
        expect(mockStore.save).toHaveBeenCalled()
    })

    it('load', async () => {
        await store.load()
        expect(mockStore.load).toHaveBeenCalled()
    })

    it('has key', async () => {
        vi.mocked(mockStore.has).mockResolvedValue(true)
        expect(await store.has('user')).toBe(true)
    })

    it('get value', async () => {
        const val: PersistentSettings = { user: 'testUser' }
        vi.mocked(mockStore.get).mockResolvedValue(val)
        expect(await store.get('settings')).toEqual(val)
    })

    it('get null if missing', async () => {
        vi.mocked(mockStore.get).mockResolvedValue(null)
        expect(await store.get('nonexistent')).toBeNull()
    })

    it('set value', async () => {
        const val: PersistentSettings = { user: 'newUser' }
        vi.mocked(mockStore.has).mockResolvedValue(false)
        await store.set('settings', val)
        expect(mockStore.set).toHaveBeenCalledWith('settings', val)
    })

    it('clear', async () => {
        await store.clear()
        expect(mockStore.clear).toHaveBeenCalled()
    })

    it('reset', async () => {
        await store.reset()
        expect(mockStore.reset).toHaveBeenCalled()
    })

    it('remove key', async () => {
        await store.remove('settings')
        expect(mockStore.delete).toHaveBeenCalledWith('settings')
    })

    it('keys', async () => {
        vi.mocked(mockStore.keys).mockResolvedValue(['user', 'settings'])
        expect(await store.keys()).toEqual(['user', 'settings'])
    })

    it('listen', async () => {
        const cb = vi.fn()
        const unlisten = vi.fn()
        vi.mocked(mockStore.onChange).mockResolvedValue(unlisten)
        expect(await store.listen(cb)).toBe(unlisten)
    })
})
