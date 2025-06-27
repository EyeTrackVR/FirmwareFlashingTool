import { ENotificationType } from '@interfaces/enums'
import { useNavigate } from '@solidjs/router'
import { usePersistentStore } from '@src/Services/persistentStore'
import { addNotification } from '@store/notifications/actions'
import { setConfig } from '@store/trackers/trackers'
import { setFirstLoadStatus } from '@store/ui/ui'
import { onMount } from 'solid-js'

export const loadPersistentStore = () => {
    const { get } = usePersistentStore()
    const navigate = useNavigate()
    onMount(async () => {
        setFirstLoadStatus(true)
        try {
            const data = await get('trackers')

            if (data?.config) {
                setConfig(data.config)

                const hasCameras = data.config.trackers.filter(
                    (el) => el.camera.capture_source !== '',
                ).length

                if (hasCameras > 0) {
                    navigate('/dashboard')
                }
            }
        } catch {
            addNotification({
                title: 'Failed to save data to local storage',
                message: 'Failed to save data to local storage',
                type: ENotificationType.ERROR,
            })
        }
        setFirstLoadStatus(false)
    })
}
