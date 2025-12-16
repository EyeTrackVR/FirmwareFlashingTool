import { onMount } from 'solid-js'
import { app } from '@tauri-apps/api'
import { setAppVersion } from '@store/ui/ui'

export const watchAppVersion = () => {
    onMount(() => {
        app.getVersion()
            .then((version) => {
                setAppVersion(version)
            })
            .catch(() => {
                setAppVersion('----')
            })
    })
}
