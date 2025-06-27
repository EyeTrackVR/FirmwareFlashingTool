import { ENotificationType } from '@interfaces/enums'
import { usePersistentStore } from '@src/Services/persistentStore'
import { addNotification } from '@store/notifications/actions'
import { setConfig } from '@store/trackers/trackers'
import { onMount } from 'solid-js'

export const loadPersistentStore = () => {
    const { get } = usePersistentStore()
    onMount(async () => {
        try {
            const data = await get('trackers')

            if (data?.config) {
                setConfig(data?.config)
            }
        } catch {
            addNotification({
                title: 'Failed to save data to local storage',
                message: 'Failed to save data to local storage',
                type: ENotificationType.ERROR,
            })
        }
    })
}
