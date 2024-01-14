import { useNavigate } from '@solidjs/router'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'
import { debug, trace } from 'tauri-plugin-log-api'
import { BoardManagement } from '@pages/BoardManagement/BoardManagement'
import { BoardDescription, debugModes, usb } from '@src/static'
import { DebugMode } from '@src/static/types'
import { TITLEBAR_ACTION } from '@src/static/types/enums'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppContext } from '@store/context/app'

export const ManageBoard = () => {
    const navigate = useNavigate()
    const { getDebugMode, setDebugMode } = useAppContext()
    const { getFirmwareAssets, getFirmwareVersion, setFirmwareType, activeBoard, setActiveBoard } =
        useAppAPIContext()

    const boards = createMemo(() => {
        return getFirmwareAssets().map((item) => {
            trace(`${item.name}`)
            return {
                board: item.name,
                description: BoardDescription[item.name.replace('_release', '')] ?? '--',
            }
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
            debugMode={debugMode()}
            debugModes={debugModes}
            setDebugMode={(debugMode) => {
                const elem: Element | null = document.activeElement
                debug(debugMode)
                setDebugMode(debugMode as DebugMode)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
            }}
            activeBoard={activeBoard()}
            firmwareVersion={firmwareVersion()}
            onClickConfirm={() => {
                if (!activeBoard()) {
                    return
                }
                navigate(isUSBBoard() ? '/flashFirmware' : '/network')
            }}
            onSubmit={(value) => {
                const elem: Element | null = document.activeElement
                setActiveBoard(value)
                const temp = getFirmwareAssets().find((item) => item.name === value)?.name
                const msg = temp ? temp : 'Not Selected'
                debug(`[Firmware]: ${msg}`)
                setFirmwareType(msg)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
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
            boards={boards()}
        />
    )
}

export default ManageBoard
