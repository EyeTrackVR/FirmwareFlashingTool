import { loadPersistentStore } from './loadPersistentStore'
import { persistentStore } from './persistentStore'
import { watchUserState } from './state'

export const runWatchers = () => {
    loadPersistentStore()
    persistentStore()
    watchUserState()
}
