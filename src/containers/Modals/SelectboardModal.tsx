import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import SelectBoardModal from '@pages/Modals/SelectBoardModal'
import { logger } from '@src/logger'
import { BOARD_DESCRIPTION, RECOMMENDED_BOARDS } from '@src/static'
import { confirmFirmwareSelection } from '@store/firmware/firmware'
import { activeBoard, ghAPI } from '@store/firmware/selectors'
import { openModal } from '@store/ui/selectors'
import { setOpenModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'
import { Accessor, batch, createMemo } from 'solid-js'
import { trace } from 'tauri-plugin-log-api'
const SelectBoardModalContainer = () => {
    const boards: Accessor<IDropdownList[]> = createMemo(() => {
        if (!ghAPI().assets.length) {
            return [
                {
                    label: 'xiaosenses3_USB',
                    description: "SeedStudio's XIAO ESP32-S3 Sense (wired mode)",
                },
            ]
        }

        return ghAPI()
            .assets.map((item) => {
                trace(`${item.name}`)
                return {
                    label: item.name,
                    description: BOARD_DESCRIPTION[item.name.replace('_release', '')] ?? '--',
                }
            })
            .sort((boardA, boardB) => {
                const boardALabel = boardA.label.replace('_release', '')
                const boardBLabel = boardB.label.replace('_release', '')
                const isBoardARelease = boardA.label.includes('_release')
                const isBoardBRelease = boardB.label.includes('_release')

                const boardAIsSupported = RECOMMENDED_BOARDS.includes(boardALabel)
                const boardBIsSupported = RECOMMENDED_BOARDS.includes(boardBLabel)

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
        <SelectBoardModal
            version="1.7.0"
            boards={boards()}
            activeBoard={activeBoard()}
            isActive={openModal().type === MODAL_TYPE.SELECT_BOARD}
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
                batch(() => {
                    logger.infoStart('SelectBoardModalContainer')
                    logger.add('button: onClickConfirmBoard')
                    logger.add(`Selected board: ${board}`)
                    confirmFirmwareSelection(board)
                    setOpenModal({ open: false, type: MODAL_TYPE.NONE })
                    logger.infoEnd('SelectBoardModalContainer')
                })
            }}
        />
    )
}

export default SelectBoardModalContainer
