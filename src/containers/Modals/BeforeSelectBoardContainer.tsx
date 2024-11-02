import { appWindow } from '@tauri-apps/api/window'
import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import BeforeSelectBoard from '@pages/Modals/BeforeSelectBoard'
import { useAppAPIContext } from '@store/api/api'
import { setIsSoftwareDownloaded } from '@store/terminal/terminal'
import { useAppUIContext } from '@store/ui/ui'

const BeforeSelectBoardContainer = () => {
    const { confirmFirmwareSelection } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()

    return (
        <BeforeSelectBoard
            isActive={modal().type === MODAL_TYPE.BEFORE_SELECT_BOARD}
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
            onClickConfirmBoard={() => {
                const board = modal()?.board
                if (board) {
                    setIsSoftwareDownloaded(false)
                    confirmFirmwareSelection(board)
                }
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
        />
    )
}

export default BeforeSelectBoardContainer
