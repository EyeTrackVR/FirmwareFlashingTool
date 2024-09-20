import { getCurrent, WebviewWindow } from '@tauri-apps/api/window'
import { debug } from 'tauri-plugin-log-api'
import { detailedLogs, firmwareState } from './selectors'
import {
    clearLogs,
    setDetailedLogs,
    setInstallationProgress,
    setLogs,
    setProcessStatus,
    updateFirmwareState,
} from './terminal'
import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { espApi } from '@src/esp/api'
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

const runStep = async (step: FLASH_STEP, action: () => Promise<void>): Promise<void> => {
    updateState(step, FLASH_STATUS.UNKNOWN)

    try {
        await action()
    } catch (error) {
        if (error instanceof Error) {
            updateState(step, FLASH_STATUS.FAILED, error)
            return
        }

        if (typeof error === 'string' && error.match(/Unknown port/)) {
            updateState(
                step,
                FLASH_STATUS.FAILED,
                new Error(
                    `No port selected by the user, or the board is not connected.  error: ${error}`,
                ),
            )
            throw error
        }

        updateState(
            step,
            FLASH_STATUS.FAILED,
            typeof error === 'string' ? new Error(error) : undefined,
        )
        throw error
    }

    updateState(step, FLASH_STATUS.SUCCESS)
}

export const installOpenIris = async (
    isUsbBoard: boolean,
    portName: string,
    downloadManifest: () => Promise<void>,
    configureWifiCredentials: () => void,
) => {
    clearLogs()

    try {
        await runStep(FLASH_STEP.REQUEST_PORT, async () => {
            await espApi.testConnection(portName)
        })

        await runStep(FLASH_STEP.MANIFEST_PATH, async () => {
            await downloadManifest()
        })

        await runStep(FLASH_STEP.FLASH_FIRMWARE, async () => {
            await espApi.flash(portName, setInstallationProgress)
        })
    } catch {
        return
    }

    if (!isUsbBoard) {
        configureWifiCredentials()
    }
    setProcessStatus(false)
}

export const getFirmwareLogs = async (portName: string, signal?: AbortController) => {
    clearLogs()

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

    try {
        await runStep(FLASH_STEP.LOGS, async () => {
            await espApi.streamLogs(
                portName,
                (data) => {
                    setDetailedLogs(data)
                    processLogsInChunks(data, chunkSize)
                },
                async (err, hasOpenirisInstallation) => {
                    clearInterval(interval)
                    if (firmwareState()[FLASH_STEP.LOGS]?.status === FLASH_STATUS.SUCCESS) return
                    if (!hasOpenirisInstallation) {
                        updateState(FLASH_STEP.LOGS, FLASH_STATUS.ABORTED)
                    } else {
                        updateState(FLASH_STEP.LOGS, FLASH_STATUS.FAILED, err)
                    }
                },
                signal?.signal,
            )
        })
    } catch {
        return
    }
}
