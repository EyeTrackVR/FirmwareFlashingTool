import { ACTION, FLASH_STATUS, FLASH_STEP, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { logs as logsDescription } from '@src/static/ui/logs'
import { setAction, setStep } from '@store/animation/animation'
import { getCurrent, WebviewWindow } from '@tauri-apps/api/window'
import { debug } from 'tauri-plugin-log-api'
import {
    clearDetailedLogs,
    clearLogs,
    setDetailedLogs,
    setInstallationProgress,
    setProcessStatus,
    updateFirmwareState,
} from './terminal'
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
}

const runStep = async (step: FLASH_STEP, action: () => Promise<void>): Promise<void> => {
    updateState(step, FLASH_STATUS.UNKNOWN)

    try {
        logger.add(step)
        await action()
    } catch (error) {
        logger.infoStart('installOpenIris, runStep, ERROR')

        setAction(ACTION.NEXT)
        setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_FAILED)

        if (error instanceof Error) {
            logger.add(error.message)

            updateState(step, FLASH_STATUS.FAILED, error)
            return
        }

        if (typeof error === 'string' && error.match(/Unknown port/)) {
            logger.add(`${error}, Unknown port`)
            updateState(
                step,
                FLASH_STATUS.FAILED,
                new Error(
                    `No port selected by the user, or the board is not connected.  error: ${error}`,
                ),
            )
            throw error
        }

        logger.add(
            typeof error === 'string'
                ? new Error(error).message
                : `This message should not be seen`,
        )

        updateState(
            step,
            FLASH_STATUS.FAILED,
            typeof error === 'string' ? new Error(error) : undefined,
        )

        logger.infoEnd('installOpenIris, runStep, ERROR')
        throw error
    }

    updateState(step, FLASH_STATUS.SUCCESS)
}

export const installOpenIris = async (portName: string, downloadManifest: () => Promise<void>) => {
    clearLogs()
    try {
        logger.infoStart('installOpenIris')

        await runStep(FLASH_STEP.REQUEST_PORT, async () => {
            await getApi().validateConnection(portName)
        })

        await runStep(FLASH_STEP.MANIFEST_PATH, async () => {
            await downloadManifest()
        })

        await runStep(FLASH_STEP.FLASH_FIRMWARE, async () => {
            await getApi().flash(portName, (progress) => {
                setInstallationProgress(progress)
                if (progress >= 100) {
                    setAction(ACTION.NEXT)
                    setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS)
                }
            })
        })

        logger.infoEnd('installOpenIris')
    } catch {
        return
    }
    setProcessStatus(false)
}

export const getFirmwareLogs = async (portName: string, signal?: AbortController) => {
    clearDetailedLogs()

    try {
        const api = getApi()
        const deviceMode = await api.getDeviceMode(portName)
        if (deviceMode === 'uvc') {
            setDetailedLogs('UVC Mode, no logs available')
            return
        }
    } catch (err) {
        console.log(err)
        setDetailedLogs('Failed to determine device mode')
    }

    function processLogsInChunks(data: string, chunkSize: number) {
        let index = 0
        function processChunk() {
            const end = Math.min(index + chunkSize, data.length)
            const chunk = data.slice(index, end)
            const trimmedChunk = trimLogsByTextLength(chunk, 106)

            trimmedChunk.forEach((el) => setDetailedLogs(el))

            index += chunkSize
            if (index < data.length) {
                requestAnimationFrame(processChunk)
            }
        }
        processChunk()
    }

    try {
        await getApi().streamLogs(
            portName,
            (data) => {
                if (data.length > 1000) {
                    processLogsInChunks(data, 10000)
                } else {
                    setDetailedLogs(data)
                }
            },
            async (err) => {
                setDetailedLogs(err.message)
            },
            signal?.signal,
        )
    } catch (err) {
        if (typeof err === 'string') {
            setDetailedLogs(err)
        } else if (err instanceof Error) {
            setDetailedLogs(err.message)
        }
        return
    }
}
