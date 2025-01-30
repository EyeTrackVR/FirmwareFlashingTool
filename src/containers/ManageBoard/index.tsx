import { type IDropdownList } from '@interfaces/interfaces'
import { isValidChannel } from '@interfaces/utils'
import { BoardManagement } from '@pages/BoardManagement'
import { useNavigate } from '@solidjs/router'
import { BoardDescription, ChannelOptions, debugModes, supportedBoards, usb } from '@src/static'
import { DebugMode } from '@src/static/types'
import { MODAL_TYPE, TITLEBAR_ACTION } from '@src/static/types/enums'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppContext } from '@store/context/app'
import { useAppUIContext } from '@store/context/ui'
import { setIsSoftwareDownloaded } from '@store/terminal/terminal'
import { appWindow } from '@tauri-apps/api/window'
import { Accessor, createMemo } from 'solid-js'
import { debug, trace } from 'tauri-plugin-log-api'

export const ManageBoard = () => {
    const navigate = useNavigate()
    const { getDebugMode, setDebugMode } = useAppContext()
    const { setOpenModal } = useAppUIContext()
    const {
        getFirmwareAssets,
        getFirmwareVersion,
        confirmFirmwareSelection,
        activeBoard,
        channelMode,
        setChannelMode,
    } = useAppAPIContext()

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

    const firmwareVersion = createMemo(() => {
        return getFirmwareVersion?.() ?? ''
    })

    const debugMode = createMemo(() => {
        return getDebugMode() ?? ''
    })

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb)
    })

    return (
        <BoardManagement
            boards={boards()}
            lockButton={!activeBoard() || !firmwareVersion()}
            channelMode={channelMode()}
            channelOptions={Object.values(ChannelOptions)}
            debugMode={debugMode()}
            debugModes={debugModes.map((el) => ({
                label: el,
            }))}
            activeBoard={activeBoard()}
            firmwareVersion={firmwareVersion()}
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
            setDebugMode={(debugMode) => {
                const elem: Element | null = document.activeElement
                debug(debugMode)
                setDebugMode(debugMode as DebugMode)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
            }}
            onClickConfirm={() => {
                if (!activeBoard() || !firmwareVersion()) {
                    return
                }
                navigate(isUSBBoard() ? '/flashFirmware' : '/network')
            }}
            onSubmit={(value) => {
                const elem: Element | null = document.activeElement
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }

                if (activeBoard() === value) return
                if (value.match(/_release/)) {
                    setOpenModal({ open: true, type: MODAL_TYPE.BEFORE_SELECT_BOARD, board: value })
                    return
                }
                setIsSoftwareDownloaded(false)
                confirmFirmwareSelection(value)
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
            onClickOpenModal={(id) => {
                const el = document.getElementById(id)
                if (el instanceof HTMLDialogElement) {
                    el.showModal()
                }
            }}
        />
    )
}

export default ManageBoard
