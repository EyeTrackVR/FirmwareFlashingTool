import { appWindow } from '@tauri-apps/api/window'
import { createMemo, createSignal } from 'solid-js'
import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import WifiModal from '@pages/Modals/WifiModal'
import { type Command, espApi } from '@src/esp/api'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'

const WifiModalContainer = () => {
    const [isSending, setIsSending] = createSignal<boolean>(false)
    const { mdns, ssid, password } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()

    const config = createMemo<Command[]>(() => {
        return [
            { command: 'set_wifi', data: { ssid: ssid(), password: password() } },
            { command: 'set_mdns', data: { hostname: mdns() } },
        ]
    })

    const notify = (title: string, type: ENotificationType) => {
        addNotification({ title, message: title, type })
    }

    const onClickUpdateNetworkSettings = async () => {
        // @todo get this from state
        const portName = '/dev/ttyACM1'

        setIsSending(true)

        notify('sending credentials', ENotificationType.INFO)
        await espApi.sendCommands(portName, config())
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
                    notify(err.message, ENotificationType.ERROR)
                    setIsSending(false)
                })
            }}
        />
    )
}

export default WifiModalContainer
