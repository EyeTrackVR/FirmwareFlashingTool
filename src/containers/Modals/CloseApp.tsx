import { MODAL_TYPE, NOTIFICATION_TYPE, TITLEBAR_ACTION } from '@interfaces/ui/enums'
import CloseApp from '@pages/Modals/CloseApp'
import { CLOSE_APP_ID } from '@src/static'
import { addNotification } from '@store/notifications/actions'
import { activeModal, serverStatus } from '@store/ui/selectors'
import { setActiveModal } from '@store/ui/ui'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { createEffect, createMemo, on } from 'solid-js'

const CloseAppRoot = () => {
    const isCloseApp = createMemo(() => {
        return activeModal().type === MODAL_TYPE.CLOSE_APP
    })

    createEffect(
        on(isCloseApp, async () => {
            try {
                await invoke('plugin:etvr_backend|shutdown_etvr_backend')
                await appWindow.close()
            } catch {
                addNotification({
                    title: 'Failed to close app',
                    message: 'Failed to close app',
                    type: NOTIFICATION_TYPE.ERROR,
                })
                setActiveModal({ open: false, type: MODAL_TYPE.NONE })
            }
        }),
    )

    return (
        <CloseApp
            id={CLOSE_APP_ID}
            appVersion="1.7.0"
            connectionStatus={serverStatus()}
            isActive={isCloseApp()}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    default:
                        return
                }
            }}
        />
    )
}

export default CloseAppRoot
