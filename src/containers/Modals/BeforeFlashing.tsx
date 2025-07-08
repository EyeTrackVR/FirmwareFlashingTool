import { MODAL_TYPE, NOTIFICATION_TYPE, TITLEBAR_ACTION } from '@interfaces/ui/enums'
import BeforeFlashing from '@pages/Modals/BeforeFlashing'
import { USB } from '@src/static'
import { useAppAPIContext } from '@store/context/api'
import { addNotification } from '@store/notifications/actions'
import { installOpenIris } from '@store/terminal/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { activeModal, hideModal, serverStatus } from '@store/ui/selectors'
import { setActiveModal, setHideModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'

const BeforeFlashingRoot = () => {
    const { downloadAsset, getFirmwareType, activeBoard, activePort } = useAppAPIContext()

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(USB)
    })

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    return (
        <BeforeFlashing
            appVersion="1.7.0"
            connectionStatus={serverStatus()}
            checked={hideModal()}
            isActive={activeModal().type === MODAL_TYPE.BEFORE_FLASHING}
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
                setActiveModal({ open: false, type: MODAL_TYPE.NONE })
            }}
            onClickCheckbox={() => {
                setHideModal()
            }}
            onClickInstallOpeniris={() => {
                setActiveModal({ open: false, type: MODAL_TYPE.NONE })
                if (isActiveProcess()) {
                    addNotification({
                        title: 'There is an active installation. Please wait.',
                        message: 'There is an active installation. Please wait.',
                        type: NOTIFICATION_TYPE.INFO,
                    })
                    return true
                }
                setAbortController('openiris')
                setProcessStatus(true)
                restartFirmwareState()
                installOpenIris(
                    isUSBBoard(),
                    activePortName(),
                    async () => {
                        await downloadAsset(getFirmwareType())
                    },
                    () => {
                        setActiveModal({ open: true, type: MODAL_TYPE.UPDATE_NETWORK })
                    },
                ).catch(() => ({}))
            }}
        />
    )
}

export default BeforeFlashingRoot
