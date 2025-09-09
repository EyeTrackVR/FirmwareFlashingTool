import {
    ACTION,
    ENotificationType,
    FLASH_WIZARD_STEPS,
    MODAL_TYPE,
    TITLEBAR_ACTION,
} from '@interfaces/enums'
import BeforeFlashingModal from '@pages/Modals/BeforeFlashingModal'
import { setAction, setStep } from '@store/animation/animation'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { installOpenIris } from '@store/terminal/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { appWindow } from '@tauri-apps/api/window'
import { batch, createMemo } from 'solid-js'

const BeforeFlashingModalContainer = () => {
    const { downloadAsset, getFirmwareType, activePort } = useAppAPIContext()
    const { modal, setOpenModal, hideModal, setHideModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    return (
        <BeforeFlashingModal
            version="1.7.0"
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
                batch(() => {
                    setAction(ACTION.NEXT)
                    setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS)
                    setOpenModal({ open: false, type: MODAL_TYPE.NONE })
                })
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
                installOpenIris(activePortName(), async () => {
                    await downloadAsset(getFirmwareType())
                }).catch(() => ({}))
            }}
        />
    )
}

export default BeforeFlashingModalContainer
