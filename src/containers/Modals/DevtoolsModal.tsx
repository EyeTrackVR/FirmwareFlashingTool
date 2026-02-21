import { MODAL_TYPE } from '@interfaces/animation/enums'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import DevtoolsModal from '@pages/Modals/DevtoolsModal'
import { logger } from '@src/logger'
import { CHANNEL_OPTIONS } from '@static/index'
import { setChannelMode } from '@store/firmware/firmware'
import { channelMode } from '@store/firmware/selectors'
import { appVersion, openModal } from '@store/ui/selectors'
import { setOpenModal } from '@store/ui/ui'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { isValidChannel } from '@utils/index'

const DevtoolsModalContainer = () => {
    return (
        <DevtoolsModal
            channelMode={channelMode()}
            channelOptions={Object.values(CHANNEL_OPTIONS)}
            version={appVersion()}
            isActive={openModal().type === MODAL_TYPE.DEVTOOLS}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                const appWindow = getCurrentWebviewWindow()

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
                logger.infoStart('DevtoolsModalContainer')
                logger.add(`Selected release: ${label} onClickSetChannelMode`)
                if (!isValidChannel(label)) {
                    return
                }
                const elem: Element | null = document.activeElement
                setChannelMode(label)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
                logger.infoEnd('SelectPortModalContainer')
            }}
        />
    )
}

export default DevtoolsModalContainer
