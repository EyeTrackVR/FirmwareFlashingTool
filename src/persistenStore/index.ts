import type { PersistentSettings } from '@interfaces/settings/interfaces'
import { LazyStore } from '@tauri-apps/plugin-store'

const lazyStore = new LazyStore('etvr-settings.json')

export const usePersistentStore = () => {
    // Lazy load underlying Store
    const ensureLoaded = async () => {
        await lazyStore.init()
    }

    const save = async () => {
        await ensureLoaded()
        await lazyStore.save()
    }

    const load = async () => {
        await ensureLoaded()
    }

    const has = async (key: string) => {
        await ensureLoaded()
        return lazyStore.has(key)
    }

    const get = async <T = any>(key: string): Promise<T | null> => {
        await ensureLoaded()
        const value = await lazyStore.get<T>(key)
        return value ?? null
    }

    const set = async <K extends keyof PersistentSettings>(
        key: K,
        value: PersistentSettings[K],
    ) => {
        await ensureLoaded()
        const current = await lazyStore.get(key)
        if (current === value) return
        await lazyStore.set(key, value)
    }

    const remove = async (key: string) => {
        await ensureLoaded()
        await lazyStore.delete(key)
    }

    const clear = async () => {
        await ensureLoaded()
        await lazyStore.clear()
    }

    const reset = async () => {
        await ensureLoaded()
        await lazyStore.reset()
    }

    const keys = async () => {
        await ensureLoaded()
        return lazyStore.keys()
    }

    const listen = async (callback: (key: string, value: any) => void) => {
        await ensureLoaded()
        return lazyStore.onChange(callback)
    }

    return {
        load,
        save,
        get,
        set,
        has,
        remove,
        clear,
        reset,
        keys,
        listen,
    }
}
