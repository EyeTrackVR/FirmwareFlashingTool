import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import BeforeSelectBoard from '@pages/Modals/BeforeSelectBoard'
import { useNavigate } from '@solidjs/router'
import { useAppAPIContext } from '@store/context/api'
import { setIsSoftwareDownloaded } from '@store/terminal/terminal'
import { activeModal, serverStatus } from '@store/ui/selectors'
import { setActiveModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'

const BeforeSelectBoardRoot = () => {
    const { confirmFirmwareSelection } = useAppAPIContext()
    const navigate = useNavigate()

    return (
        <BeforeSelectBoard
            appVersion="1.7.0"
            connectionStatus={serverStatus()}
            isActive={activeModal().type === MODAL_TYPE.BEFORE_SELECT_BOARD}
            onClickSettings={() => {
                navigate('/settings')
            }}
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
            onClickConfirmBoard={() => {
                const board = activeModal()?.board
                if (board) {
                    setIsSoftwareDownloaded(false)
                    confirmFirmwareSelection(board)
                }
                setActiveModal({ open: false, type: MODAL_TYPE.NONE })
            }}
        />
    )
}

export default BeforeSelectBoardRoot
