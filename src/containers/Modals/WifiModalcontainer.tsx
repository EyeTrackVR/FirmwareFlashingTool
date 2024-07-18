import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'
import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import WifiModal from '@pages/Modals/WifiModal'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { updateNetwork } from '@store/terminal/actions'

const WifiModalContainer = () => {
    const { mdns, ssid, password } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()

    const wifiConfigFiles = createMemo(() =>
        JSON.stringify({
            commands: [
                { command: 'set_mdns', data: { hostname: mdns() } },
                { command: 'set_wifi', data: { ssid: ssid(), password: password() } },
            ],
        }),
    )

    return (
        <WifiModal
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
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
            onClick={() => {
                updateNetwork(wifiConfigFiles(), () => {
                    setOpenModal({ open: false, type: MODAL_TYPE.NONE })
                })
            }}
        />
    )
}

export default WifiModalContainer
