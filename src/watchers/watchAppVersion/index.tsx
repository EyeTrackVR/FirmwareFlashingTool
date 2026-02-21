import { setAppVersion } from '@store/ui/ui'
import { app } from '@tauri-apps/api'
import { onMount } from 'solid-js'

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
