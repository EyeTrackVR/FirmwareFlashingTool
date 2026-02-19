import { MODAL_TYPE } from '@interfaces/animation/enums'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import UpdaterModal from '@pages/Modals/UpdaterModal'
import { addNotification } from '@store/actions/notifications/addNotification'
import { appVersion, openModal } from '@store/ui/selectors'
import { setOpenModal } from '@store/ui/ui'
// import { relaunch } from '@tauri-apps/plugin-process'
// import { checkUpdate, installUpdate, onUpdaterEvent } from '@tauri-apps/plugin-updater'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { createSignal, onMount } from 'solid-js'

const UpdaterModalContainer = () => {
    const [updating, setUpdating] = createSignal(false)

    onMount(() => {
        // checkUpdate().then((response) => {
        //     if (response.shouldUpdate) {
        //         setOpenModal({ open: true, type: MODAL_TYPE.UPDATE_APP })
        //     }
        // })
    })

    const onClickUpdate = async () => {
        // setUpdating(true)
        // try {
        //     await installUpdate()
        //     await relaunch()
        // } catch {
        //     addNotification({
        //         title: 'Update failed',
        //    `     message: 'The new version could not be installed. Please try again later.',
        //         type: NOTIFICATION_TYPE.ERROR,
        //     })
        //     setUpdating(false)
        // }
    }

    return (
        <UpdaterModal
            isPrimaryButtonActive={!updating()}
            version={appVersion()}
            isSending={updating()}
            onClickUpdate={() => {
                onClickUpdate().catch(() => {})
            }}
            isActive={openModal().type === MODAL_TYPE.UPDATE_APP}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                const appWindow = getCurrentWebviewWindow()

                if (updating()) {
                    addNotification({
                        title: 'Update in progress',
                        message: 'Please wait for the update to finish',
                        type: NOTIFICATION_TYPE.INFO,
                    })
                    return
                }

                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE:
                        appWindow.close()
                        break
                    default:
                        return
                }
            }}
            onClickClose={() => {
                if (updating()) {
                    addNotification({
                        title: 'Update in progress',
                        message: 'Please wait for the update to finish',
                        type: NOTIFICATION_TYPE.INFO,
                    })
                    return
                }

                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
        />
    )
}

export default UpdaterModalContainer
