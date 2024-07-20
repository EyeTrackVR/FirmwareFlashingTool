import { getCurrent, WebviewWindow } from '@tauri-apps/api/window'
import { debug } from 'tauri-plugin-log-api'
import webManager from '../webManager/index'
import { detailedLogs, firmwareState, isSoftwareDownloaded } from './selectors'
import {
    clearLogs,
    deleteFirmwareState,
    setDetailedLogs,
    setInstallationProgress,
    setIsSoftwareDownloaded,
    setLogs,
    setProcessStatus,
    updateFirmwareState,
} from './terminal'
import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { logs as logsDescription } from '@src/static/ui/logs'
import { trimLogsByTextLength } from '@src/utils'

export const openDocs = () => {
    const currentMainWindow = getCurrent()
    currentMainWindow.innerPosition().then((position) => {
        debug(`[OpenDocs]: Window Position${position.x}, ${position.y}`)
        const webview = new WebviewWindow('eyetrack-docs', {
            url: 'src/windows/docs/index.html',
            resizable: true,
            decorations: false,
            titleBarStyle: 'transparent',
            hiddenTitle: true,
            width: 800,
            height: 600,
            x: position.x,
            y: position.y,
            transparent: true,
        })
        webview.once('tauri://created', () => {
            debug('WebView Window Created')
            webview.show()
        })
    })
}

const updateState = (step: FLASH_STEP, status: FLASH_STATUS, error?: Error) => {
    if (status === FLASH_STATUS.FAILED) {
        setProcessStatus(false)
    }

    updateFirmwareState({
        step,
        object: {
            ...logsDescription[step][status],
            errorName: error?.name ?? undefined,
        },
    })

    if (error) {
        setLogs(step, error ? [error.message] : [])
    }
}

export const installOpenIris = async (
    isUsbBoard: boolean,
    manifestPath: string,
    downloadManifest: () => Promise<void>,
    configureWifiCredentials: () => void,
) => {
    clearLogs()

    if (webManager.isActivePort()) {
        try {
            updateState(FLASH_STEP.BOARD_CONNECTION, FLASH_STATUS.UNKNOWN)
            await webManager.checkBoardConnection()
            deleteFirmwareState(FLASH_STEP.BOARD_CONNECTION)
        } catch (err) {
            deleteFirmwareState(FLASH_STEP.BOARD_CONNECTION)
            await webManager.reset()
        }
    }

    if (!webManager.isActivePort()) {
        try {
            updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.UNKNOWN)
            await webManager.connect()
            updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.SUCCESS)
        } catch (error: unknown) {
            if (error instanceof Error) {
                updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.FAILED, error)
            }
            await webManager.reset()
            return
        }
    } else {
        updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.SUCCESS)
    }

    try {
        updateState(FLASH_STEP.INITIALIZE, FLASH_STATUS.UNKNOWN)
        await webManager.initializeESPConnection()
        updateState(FLASH_STEP.INITIALIZE, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        await webManager.reset()
        if (error instanceof Error) {
            updateState(FLASH_STEP.INITIALIZE, FLASH_STATUS.FAILED, error)
        }
        return
    }

    try {
        updateState(FLASH_STEP.CHIP_FAMILY, FLASH_STATUS.UNKNOWN)
        await webManager.checkChipFamily()
        updateState(FLASH_STEP.CHIP_FAMILY, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        if (error instanceof Error) {
            updateState(FLASH_STEP.CHIP_FAMILY, FLASH_STATUS.FAILED, error)
        }
        return
    }

    try {
        updateState(FLASH_STEP.MANIFEST_PATH, FLASH_STATUS.UNKNOWN)
        if (!isSoftwareDownloaded()) {
            await downloadManifest()
        }
        setIsSoftwareDownloaded(true)
        await webManager.downloadManifest(manifestPath)
        updateState(FLASH_STEP.MANIFEST_PATH, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        if (error instanceof Error) {
            updateState(FLASH_STEP.MANIFEST_PATH, FLASH_STATUS.FAILED, error)
        }
        return
    }

    try {
        updateState(FLASH_STEP.BUILD, FLASH_STATUS.UNKNOWN)
        await webManager.validateManifestBuild()
        updateState(FLASH_STEP.BUILD, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        if (error instanceof Error) {
            updateState(FLASH_STEP.BUILD, FLASH_STATUS.FAILED, error)
        }
        return
    }

    try {
        updateState(FLASH_STEP.DOWNLOAD_FILES, FLASH_STATUS.UNKNOWN)
        await webManager.downloadFiles(manifestPath)
        updateState(FLASH_STEP.DOWNLOAD_FILES, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        if (error instanceof Error) {
            updateState(FLASH_STEP.DOWNLOAD_FILES, FLASH_STATUS.FAILED, error)
        }
        return
    }

    try {
        updateState(FLASH_STEP.FLASH_FIRMWARE, FLASH_STATUS.UNKNOWN)
        await webManager.flashFirmware(setInstallationProgress)
        updateState(FLASH_STEP.FLASH_FIRMWARE, FLASH_STATUS.SUCCESS)
    } catch (error: unknown) {
        if (error instanceof Error) {
            updateState(FLASH_STEP.FLASH_FIRMWARE, FLASH_STATUS.FAILED, error)
        }
        return
    }

    if (!isUsbBoard) {
        configureWifiCredentials()
    }
    setProcessStatus(false)
}

export const getFirmwareLogs = async (signal?: AbortController) => {
    clearLogs()
    if (webManager.isActivePort()) {
        try {
            updateState(FLASH_STEP.BOARD_CONNECTION, FLASH_STATUS.UNKNOWN)
            await webManager.checkBoardConnection()
            deleteFirmwareState(FLASH_STEP.BOARD_CONNECTION)
        } catch (err) {
            deleteFirmwareState(FLASH_STEP.BOARD_CONNECTION)
            await webManager.reset()
        }
    }

    if (!webManager.isActivePort()) {
        try {
            updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.UNKNOWN)
            await webManager.connect()
            updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.SUCCESS)
        } catch (error: unknown) {
            if (error instanceof Error) {
                updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.FAILED, error)
            }
            await webManager.reset()
            return
        }
        try {
            updateState(FLASH_STEP.OPEN_PORT, FLASH_STATUS.UNKNOWN)
            await webManager.openPort()
            updateState(FLASH_STEP.OPEN_PORT, FLASH_STATUS.SUCCESS)
        } catch (error: unknown) {
            if (error instanceof Error) {
                updateState(FLASH_STEP.OPEN_PORT, FLASH_STATUS.FAILED, error)
            }
            await webManager.reset()
            return
        }
    } else {
        updateState(FLASH_STEP.REQUEST_PORT, FLASH_STATUS.SUCCESS)
        updateState(FLASH_STEP.OPEN_PORT, FLASH_STATUS.SUCCESS)
    }

    updateState(FLASH_STEP.LOGS, FLASH_STATUS.UNKNOWN)

    const logs: string[] = []
    const SLICE_SIZE = 100
    let slicer = SLICE_SIZE
    const chunkSize = 10000
    let tries = 5

    function processLogsInChunks(data: string, chunkSize: number) {
        let index = 0
        function processChunk() {
            const end = Math.min(index + chunkSize, data.length)
            const chunk = data.slice(index, end)
            const trimmedChunk = trimLogsByTextLength(chunk, 106)
            logs.push(...trimmedChunk)
            index += chunkSize
            if (index < data.length) {
                requestAnimationFrame(processChunk)
            }
        }
        processChunk()
    }

    webManager
        .getLogs(
            (data) => {
                setDetailedLogs(data)
                processLogsInChunks(data, chunkSize)
            },
            async (err, hasOpenirisInstallation) => {
                clearInterval(interval)
                if (err.message.includes('port')) {
                    await webManager.reset()
                }
                if (firmwareState()[FLASH_STEP.LOGS]?.status === FLASH_STATUS.SUCCESS) return
                if (!hasOpenirisInstallation) {
                    updateState(FLASH_STEP.LOGS, FLASH_STATUS.ABORTED)
                } else {
                    updateState(FLASH_STEP.LOGS, FLASH_STATUS.FAILED, err)
                }
            },
            signal?.signal,
        )
        .catch(() => {})

    const interval = setInterval(() => {
        if (signal?.signal?.aborted) {
            slicer = SLICE_SIZE
            tries = 5
            clearInterval(interval)
            return
        }

        if (slicer >= detailedLogs().length) {
            tries--
        }

        const data = logs.slice(slicer - SLICE_SIZE, slicer)
        setLogs(FLASH_STEP.LOGS, data, true)

        if (!tries && !signal?.signal?.aborted) {
            if (!detailedLogs().length) {
                updateState(FLASH_STEP.LOGS, FLASH_STATUS.FAILED)
            } else {
                updateState(FLASH_STEP.LOGS, FLASH_STATUS.SUCCESS)
            }
            clearInterval(interval)
        }

        slicer += SLICE_SIZE
    }, 1500)
}
