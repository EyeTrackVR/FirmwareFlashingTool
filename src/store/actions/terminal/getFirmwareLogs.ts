import { getApi } from '@src/esp'
import { trimLogsByTextLength } from '@src/utils'
import { clearDetailedLogs, setDetailedLogs } from '@store/terminal/terminal'

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
