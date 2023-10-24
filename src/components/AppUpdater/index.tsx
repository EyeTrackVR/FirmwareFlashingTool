import { Progress } from '@kobalte/core'
import { relaunch } from '@tauri-apps/api/process'
import { checkUpdate, installUpdate, type UpdateResult } from '@tauri-apps/api/updater'
import { createSignal, createEffect, Show } from 'solid-js'
import './styles.css'

const Updater = () => {
    const [updating, setUpdating] = createSignal(false)
    const [updateAvailable, setUpdateAvailable] = createSignal<UpdateResult>()

    createEffect(() => {
        checkUpdate().then((updateResult) => setUpdateAvailable(updateResult))
    })

    const handleUpdate = () => {
        setUpdating(true)
        /* showNotification({
            title: t('Installing update v{{ v }}', { v: newVersion }),
            message: t('Will relaunch afterwards'),
            autoClose: false,
        }) */
        installUpdate().then(relaunch)
    }

    return (
        <div>
            <Show when={updating()}>
                <Progress.Root value={80} class="progress">
                    <div class="progress__label-container">
                        <Progress.Label class="progress__label">Loading...</Progress.Label>
                        <Progress.ValueLabel class="progress__value-label" />
                    </div>
                    <Progress.Track class="progress__track">
                        <Progress.Fill class="progress__fill" />
                    </Progress.Track>
                </Progress.Root>
            </Show>
            <Show when={updateAvailable()}>
                <button onClick={handleUpdate}>Update</button>
            </Show>
        </div>
    )
}

export default Updater
