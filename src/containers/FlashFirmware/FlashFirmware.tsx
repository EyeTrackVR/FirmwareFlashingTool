import { useNavigate } from '@solidjs/router'
import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createEffect, createMemo, createSignal, onMount } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import { ENotificationType, FLASH_STATUS, MODAL_TYPE } from '@interfaces/enums'
import Terminal from '@pages/Terminal/Index'
import { BoardConnectionMethod, usb } from '@src/static'
import { download } from '@src/utils'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { getFirmwareLogs, installOpenIris, openDocs } from '@store/terminal/actions'
import {
    detailedLogs,
    firmwareState,
    isActiveProcess,
    logs,
    percentageProgress,
    simulationAbortController,
} from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'

export const ManageFlashFirmware = () => {
    const [manifestPath, setManifestPath] = createSignal<string>('----')
    const { getFirmwareVersion, activeBoard, downloadAsset, getFirmwareType } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { setOpenModal } = useAppUIContext()
    const navigate = useNavigate()

    onMount(() => {
        setAbortController()
        restartFirmwareState()
    })

    createEffect(() => {
        appDataDir()
            .then((appDataDirPath) => {
                debug(`[WebSerial]: appDataDirPath ${appDataDirPath}`)
                join(appDataDirPath, 'manifest.json').then((manifestfilePath) => {
                    debug(`[WebSerial]: manifestfilePath ${manifestfilePath}`)
                    const url = convertFileSrc(manifestfilePath)
                    debug(`[WebSerial]: url ${url}`)
                    setManifestPath(url)
                })
            })
            .catch(() => {})
    })

    const flashFirmwareState = createMemo(() => {
        return Object.keys(firmwareState()).map((key) => {
            return { step: key, ...firmwareState()[key] }
        })
    })

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb)
    })

    const notification = createMemo(() => {
        return {
            title: 'There is an active installation. Please wait.',
            message: 'There is an active installation. Please wait.',
            type: ENotificationType.INFO,
        }
    })

    const board = createMemo(() => {
        const connectionMethod = BoardConnectionMethod[activeBoard().replace('_release', '')]
        return connectionMethod ? `${activeBoard()} (${connectionMethod})` : activeBoard()
    })

    return (
        <Terminal
            board={board()}
            isUSBBoard={isUSBBoard()}
            percentageProgress={percentageProgress()}
            logs={logs()}
            isActiveProcess={isActiveProcess()}
            onClickOpenDocs={openDocs}
            firmwareVersion={`Openiris-${getFirmwareVersion()}`}
            firmwareState={flashFirmwareState().filter((el) => el?.status !== FLASH_STATUS.NONE)}
            onClickInstallOpenIris={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
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
            onClickGetLogs={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController('logs')
                getFirmwareLogs(simulationAbortController()).catch(() => {})
            }}
            onClickDownloadLogs={() => {
                if (!detailedLogs().toString()) {
                    addNotification({
                        title: 'No logs found',
                        message: 'No logs found.',
                        type: ENotificationType.INFO,
                    })
                    return
                }
                download(detailedLogs().toString(), 'esp-web-tools-logs.txt')
            }}
            onClickUpdateNetwork={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                setOpenModal({ open: true, type: MODAL_TYPE.UPDATE_NETWORK })
            }}
            onClickAPMode={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                setOpenModal({ open: true, type: MODAL_TYPE.AP_MODE })
            }}
            onClickBack={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                navigate(isUSBBoard() ? '/' : '/network')
            }}
        />
    )
}

export default ManageFlashFirmware
