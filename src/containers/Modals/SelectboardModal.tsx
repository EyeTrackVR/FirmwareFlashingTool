import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import SelectBoard from '@pages/Modals/SelectBoard'
import { BoardDescription, supportedBoards } from '@src/static'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { appWindow } from '@tauri-apps/api/window'
import { Accessor, createMemo } from 'solid-js'
import { trace } from 'tauri-plugin-log-api'
const SelectBoardModal = () => {
    const { confirmFirmwareSelection, getFirmwareAssets, activeBoard } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()

    const boards: Accessor<IDropdownList[]> = createMemo(() => {
        return getFirmwareAssets()
            .map((item) => {
                trace(`${item.name}`)
                return {
                    label: item.name,
                    description: BoardDescription[item.name.replace('_release', '')] ?? '--',
                }
            })
            .sort((boardA, boardB) => {
                const boardALabel = boardA.label.replace('_release', '')
                const boardBLabel = boardB.label.replace('_release', '')
                const isBoardARelease = boardA.label.includes('_release')
                const isBoardBRelease = boardB.label.includes('_release')

                const boardAIsSupported = supportedBoards.includes(boardALabel)
                const boardBIsSupported = supportedBoards.includes(boardBLabel)

                if (boardAIsSupported && boardBIsSupported) {
                    if (isBoardARelease && !isBoardBRelease) return 1
                    if (!isBoardARelease && isBoardBRelease) return -1
                }

                if (boardAIsSupported && !boardBIsSupported) return -1
                if (!boardAIsSupported && boardBIsSupported) return 1

                return 0
            })
    })

    return (
        <SelectBoard
            version="1.7.0"
            boards={boards()}
            activeBoard={activeBoard()}
            isActive={modal().type === MODAL_TYPE.SELECT_BOARD}
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
            onClickConfirmBoard={(board) => {
                confirmFirmwareSelection(board)
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
        />
    )
}

export default SelectBoardModal
