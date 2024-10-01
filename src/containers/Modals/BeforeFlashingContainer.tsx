import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'
import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import BeforeFlashingModal from '@pages/Modals/BeforeFlashingModal'
import { USB_ID } from '@src/static'
import { useAppAPIContext } from '@store/api/api'
import { useAppNotificationsContext } from '@store/notifications/notifications'
import { installOpenIris } from '@store/terminal/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { useAppUIContext } from '@store/ui/ui'

const BeforeFlashingContainer = () => {
    const { downloadAsset, getFirmwareType, activeBoard, manifestPath } = useAppAPIContext()
    const { modal, setOpenModal, hideModal, setHideModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(USB_ID)
    })

    return (
        <BeforeFlashingModal
            checked={hideModal()}
            isActive={modal().type === MODAL_TYPE.BEFORE_FLASHING}
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
                    manifestPath(),
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
