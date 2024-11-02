import { appWindow } from '@tauri-apps/api/window'
import { createMemo, createSignal } from 'solid-js'
import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import WifiModal from '@pages/Modals/WifiModal'
import { type Command, espApi } from '@src/esp/api'
import { DEFAULT_PORT_NAME } from '@src/static'
import { useAppAPIContext } from '@store/api/api'
import { useAppNotificationsContext } from '@store/notifications/notifications'
import { useAppUIContext } from '@store/ui/ui'

const WifiModalContainer = () => {
    const [isSending, setIsSending] = createSignal<boolean>(false)
    const { mdns, ssid, password, activePort } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()

    const config = createMemo<Command[]>(() => {
        return [
            { command: 'set_mdns', data: { hostname: mdns() } },
            { command: 'set_wifi', data: { ssid: ssid(), password: password() } },
        ]
    })

    const notify = (title: string, type: ENotificationType) => {
        addNotification({ title, message: title, type })
    }

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    const onClickUpdateNetworkSettings = async () => {
        setIsSending(true)

        if (activePortName() === DEFAULT_PORT_NAME) {
            setTimeout(() => {
                setIsSending(false)
            }, 250)
            return
        }

        notify('sending credentials', ENotificationType.INFO)
        await espApi.sendCommands(activePortName(), config())
        notify('Sent credentials', ENotificationType.INFO)

        setIsSending(false)
        setOpenModal({ open: false, type: MODAL_TYPE.NONE })
    }

    return (
        <WifiModal
            isSending={isSending()}
            isActive={modal().type === MODAL_TYPE.UPDATE_NETWORK}
            onClickHeader={(action: TITLEBAR_ACTION) => {
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
                if (isSending()) return
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
            onClick={() => {
                if (isSending()) return
                onClickUpdateNetworkSettings().catch(async (err) => {
                    if (err instanceof Error) {
                        notify(err.message, ENotificationType.ERROR)
                    } else {
                        notify(err, ENotificationType.ERROR)
                    }
                    setIsSending(false)
                })
            }}
        />
    )
}

export default WifiModalContainer
