import { listen } from '@tauri-apps/api/event'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import Highlight from '@components/Highlight'
import { ENotificationType } from '@static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import '@static/highlight.js/styles/atom-one-dark.css'

// TODO: Implement a device config viewer

const DeviceConfig = () => {
    const [response, setResponse] = createSignal<object>()
    const [config, setConfig] = createSignal<string>()

    const { useRequestHook } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()

    const _listen = async () => {
        const unlisten = await listen<string>('request-response', (event) => {
            const parsedResponse = JSON.parse(event.payload)
            setResponse(parsedResponse)
            debug(`[NetworkSettings]: ${JSON.stringify(parsedResponse)}`)
        })
        return unlisten
    }

    onMount(async () => {
        const unlisten = await _listen()
        onCleanup(unlisten)
    })

    const handleGetConfig = async () => {

        debug(`Response: ${response()}`)

        //* Check if there is a response from the device
        await useRequestHook('ping', '192.168.4.1')

        if (response()!['msg'] !== 'ok') {
            addNotification({
                title: 'Error',
                message:
                    'Could not connect to device, please connect your PC to the EyeTrackVR Access Point and try again.',
                type: ENotificationType.ERROR,
            })
            return
        }

        //* Make Request to set network settings
        await useRequestHook('getStoredConfig', '192.168.4.1')

        if (response()!['msg'] !== 'ok') {
            addNotification({
                title: 'Error',
                message: 'Could not get device config, please try again.',
                type: ENotificationType.ERROR,
            })
            return
        }
        setConfig(JSON.stringify(response()!['data']))
    }

    setTimeout(() => {
        handleGetConfig()
    })

    return (
        <div class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
            <h1 class="flex justify-start pb-3 text-[#f8f8f2] text-xl font-bold">Device Config</h1>
            <Highlight>{config()}</Highlight>
        </div>
    )
}

export default DeviceConfig
