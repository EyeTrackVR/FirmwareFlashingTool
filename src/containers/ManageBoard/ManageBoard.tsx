import { useNavigate } from '@solidjs/router'
import { createMemo } from 'solid-js'
import { debug, trace } from 'tauri-plugin-log-api'
import { BoardManagement } from '@pages/BoardManagement/BoardManagement'
import { BoardDescription, debugModes } from '@src/static'
import { DebugMode } from '@src/static/types'
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
        return getFirmwareVersion?.() ?? '--'
    })

    const debugMode = createMemo(() => {
        return getDebugMode() || ''
    })

    return (
        <BoardManagement
            debugMode={debugMode()}
            debugModes={debugModes}
            setDebugMode={(debugMode) => {
                debug(debugMode)
                setDebugMode(debugMode as DebugMode)
            }}
            activeBoard={activeBoard()}
            firmwareVersion={firmwareVersion()}
            onClickSkip={() => {
                navigate('/')
            }}
            onClickConfirm={() => {
                navigate('/flashFirmware')
            }}
            onSubmit={(value) => {
                setActiveBoard(value)
                const temp = getFirmwareAssets().find((item) => item.name === value)?.name
                const msg = temp ? temp : 'Not Selected'
                debug(`[Firmware]: ${msg}`)
                setFirmwareType(msg)
            }}
            boards={boards()}
        />
    )
}

export default ManageBoard
