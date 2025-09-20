import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { isValidChannel } from '@interfaces/utils'
import DevtoolsModal from '@pages/Modals/DevtoolsModal'
import { CHANNEL_OPTIONS } from '@src/static'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { appWindow } from '@tauri-apps/api/window'

const DevtoolsModalContainer = () => {
    const { modal, setOpenModal, hideModal } = useAppUIContext()
    const { channelMode, setChannelMode } = useAppAPIContext()

    return (
        <DevtoolsModal
            channelMode={channelMode()}
            channelOptions={Object.values(CHANNEL_OPTIONS)}
            version="1.7.0"
            checked={hideModal()}
            isActive={modal().type === MODAL_TYPE.DEVTOOLS}
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
            onClickSetChannelMode={(label) => {
                if (!isValidChannel(label)) {
                    return
                }
                const elem: Element | null = document.activeElement
                setChannelMode(label)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
            }}
        />
    )
}

export default DevtoolsModalContainer
