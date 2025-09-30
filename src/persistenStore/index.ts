// https://github.com/tauri-apps/plugins-workspace/tree/dev/plugins/store

//* Global app settings stores
import { Store } from 'tauri-plugin-store-api'
import type { PersistentSettings } from '@src/static/types'

const persistentStore = new Store('.app-settings.bin')

export const usePersistentStore = () => {
    const save = async () => {
        await persistentStore.save()
    }

    const load = async () => {
        await persistentStore.load()
    }

    const has = async (key: string) => {
        return await persistentStore.has(key)
    }

    const get = async (key: string) => {
        const value = await persistentStore.get<PersistentSettings>(key)
        if (!value) return null
        return value
    }

    const set = async (key: string, value: PersistentSettings) => {
        // check if the key exists
        if (await has(key)) {
            // if it does, get the current value
            const currentValue = await get(key)
            // if the current value is the same as the new value, don't save
            if (currentValue === value[key]) return
        }

        await persistentStore.set(key, value)
    }

    const reset = async () => {
        await persistentStore.reset()
    }

    const clear = async () => {
        await persistentStore.clear()
    }

    const remove = async (key: string) => {
        await persistentStore.delete(key)
    }

    const keys = async () => {
        return await persistentStore.keys()
    }

    const listen = async (callback: (key: string, value: PersistentSettings | null) => void) => {
        return await persistentStore.onChange<PersistentSettings>(callback)
    }

    return {
        save,
        load,
        get,
        set,
        reset,
        clear,
        remove,
        has,
        keys,
        listen,
    }
}
