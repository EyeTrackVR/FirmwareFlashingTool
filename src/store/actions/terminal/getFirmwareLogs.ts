import { getApi } from '@src/esp'
import { sleep, trimLogsByTextLength } from '@src/utils'
import { clearDetailedLogs, setDetailedLogs } from '@store/terminal/terminal'
import { batch } from 'solid-js'

export const getFirmwareLogs = async (
    portName: string,
    signal: AbortController,
    callback: (status: boolean) => void,
) => {
    if (signal.signal.aborted) {
        callback(false)
        return
    }

    batch(() => {
        callback(true)
        clearDetailedLogs()
    })

    const api = getApi()

    try {
        await api.cancelStreamLogs()
    } catch {
        console.log('failed to cancel logs')
    }

    try {
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

    if (signal.signal.aborted) {
        callback(false)
        return
    }

    try {
        await api.streamLogs(
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
            signal.signal,
        )
    } catch (err) {
        if (typeof err === 'string') {
            setDetailedLogs(err)
        } else if (err instanceof Error) {
            setDetailedLogs(err.message)
        }
    }
    await sleep(200)
    callback(false)
}
