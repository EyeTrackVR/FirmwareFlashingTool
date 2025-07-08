import { NOTIFICATION_TYPE } from '@interfaces/ui/enums'
import { usePersistentStore } from '@src/Services/persistentStore'
import { addNotification } from '@store/notifications/actions'
import { config } from '@store/trackers/selectors'
import { firstLoad } from '@store/ui/selectors'
import { createEffect, on } from 'solid-js'

export const persistentStore = () => {
    const { set } = usePersistentStore()
    createEffect(
        on(config, async () => {
            try {
                if (firstLoad()) return
                await set('config', { config: config() })
            } catch {
                addNotification({
                    title: 'Failed to save data to local storage',
                    message: 'Failed to save data to local storage',
                    type: NOTIFICATION_TYPE.ERROR,
                })
            }
        }),
    )
}
