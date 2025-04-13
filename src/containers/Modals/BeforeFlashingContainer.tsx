import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import BeforeFlashingModal from '@pages/Modals/BeforeFlashingModal'
import { usb } from '@src/static'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { installOpenIris } from '@store/terminal/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { hideModal, openModal, serverStatus } from '@store/ui/selectors'
import { setHideModal, setOpenModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'

const BeforeFlashingContainer = () => {
    const { downloadAsset, getFirmwareType, activeBoard, activePort } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb)
    })

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    return (
        <BeforeFlashingModal
            appVersion="1.7.0"
            connectionStatus={serverStatus()}
            checked={hideModal()}
            isActive={openModal().type === MODAL_TYPE.BEFORE_FLASHING}
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
            onClickCheckbox={() => {
                setHideModal()
            }}
            onClickInstallOpeniris={() => {
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
                if (isActiveProcess()) {
                    addNotification({
                        title: 'There is an active installation. Please wait.',
                        message: 'There is an active installation. Please wait.',
                        type: ENotificationType.INFO,
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
                        setOpenModal({ open: true, type: MODAL_TYPE.UPDATE_NETWORK })
                    },
                ).catch(() => ({}))
            }}
        />
    )
}

export default BeforeFlashingContainer
