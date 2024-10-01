import { useNavigate } from '@solidjs/router'
import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createEffect, createMemo, createSignal, onMount } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import { ENotificationType, FLASH_STATUS, MODAL_TYPE, NAVIGATION } from '@interfaces/enums'
import Terminal from '@pages/Terminal/Index'
import { BOARD_CONNECTION_METHOD, USB_ID } from '@src/static'
import { download } from '@src/utils'
import { useAppAPIContext } from '@store/api/api'
import { useAppNotificationsContext } from '@store/notifications/notifications'
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
import { useAppUIContext } from '@store/ui/ui'

export const ManageFlashFirmware = () => {
    const [manifestPath, setManifestPath] = createSignal<string>('----')
    const { getFirmwareVersion, activeBoard, downloadAsset, getFirmwareType, saveManifestPath } =
        useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { setOpenModal, hideModal } = useAppUIContext()
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
                    if (!hideModal()) {
                        saveManifestPath(url)
                    }
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
        return activeBoard().includes(USB_ID)
    })

    const notification = createMemo(() => {
        return {
            title: 'There is an active installation. Please wait.',
            message: 'There is an active installation. Please wait.',
            type: ENotificationType.INFO,
        }
    })

    const board = createMemo(() => {
        const connectionMethod = BOARD_CONNECTION_METHOD[activeBoard().replace('_release', '')]
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
                if (!hideModal()) {
                    setOpenModal({ open: true, type: MODAL_TYPE.BEFORE_FLASHING })
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
                navigate(isUSBBoard() ? NAVIGATION.CONFIGURE_BOARD : NAVIGATION.NETWORK)
            }}
            onClickSetup={() => {
                navigate(NAVIGATION.CONFIGURE_SETUP)
            }}
        />
    )
}

export default ManageFlashFirmware
