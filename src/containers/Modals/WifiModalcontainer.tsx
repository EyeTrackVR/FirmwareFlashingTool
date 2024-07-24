import { appWindow } from '@tauri-apps/api/window'
import { createMemo, createSignal } from 'solid-js'
import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import WifiModal from '@pages/Modals/WifiModal'
import { sleep } from '@src/utils'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import webManager from '@store/webManager/index'

const WifiModalContainer = () => {
    const [isSending, setIsSending] = createSignal<boolean>(false)
    const { mdns, ssid, password } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()

    const config = createMemo(() => {
        const wifiConfig = { command: 'set_wifi', data: { ssid: ssid(), password: password() } }
        const mdnsConfig = { command: 'set_mdns', data: { hostname: mdns() } }
        return JSON.stringify({ commands: [mdnsConfig, wifiConfig] })
    })

    const notify = (title: string, type: ENotificationType) => {
        addNotification({ title, message: title, type })
    }

    const onClickUpdateNetworkSettings = async () => {
        setIsSending(true)
        // we want to start with a new port
        if (webManager.isActivePort()) {
            await webManager.reset()
        }

        if (!webManager.isActivePort()) {
            try {
                await webManager.connect()
            } catch (error: unknown) {
                await webManager.reset()
            }
            try {
                await webManager.openPort()
            } catch (error: unknown) {
                await webManager.reset()
            }
        }

        if (!webManager.isActivePort()) {
            setIsSending(false)
            await webManager.reset()
            return
        }

        notify('preparing credentials', ENotificationType.INFO)
        await webManager.configureWifiConnection(config())

        await sleep(1000)
        notify('sending credentials', ENotificationType.INFO)
        await sleep(4000)
        notify('Sent credentials', ENotificationType.INFO)

        await webManager.reset()
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
                    await webManager.reset()
                    setIsSending(false)
                })
            }}
        />
    )
}

export default WifiModalContainer
