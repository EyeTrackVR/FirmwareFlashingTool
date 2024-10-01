import { listen } from '@tauri-apps/api/event'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import Input from '@components/Inputs/Input/Input'
import { ENotificationType } from '@static/types/enums'
import { useAppAPIContext } from '@store/api/api'
import { useAppNotificationsContext } from '@store/notifications/notifications'

const NetworkSettings = () => {
    const [ssid, setSsid] = createSignal('')
    const [pass, setPass] = createSignal('')
    const [confirmPass, setConfirmPass] = createSignal('')
    const [response, setResponse] = createSignal<object>()

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

    const handleSave = async (e: Event) => {
        e.preventDefault()

        debug(`ssid: ${ssid()}`)
        debug(`pass: ${pass()}`)
        debug(`confirmPass: ${confirmPass()}`)

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
        await useRequestHook(
            'wifi',
            '192.168.4.1',
            `?ssid=${ssid()}&password=${pass()}&networkName=${ssid()}&channel=1&power=52&adhoc=0`,
        )

        //* Trigger save of network settings
        await useRequestHook('save', '192.168.4.1')

        addNotification({
            title: 'Success',
            message: response()!['msg'],
            type: ENotificationType.SUCCESS,
        })
    }

    return (
        <div>
            <form class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
                <div>
                    <Input
                        onChange={setSsid}
                        placeholder="ssid"
                        header="SSID"
                        type="text"
                        id="ssid"
                        required={true}
                    />
                </div>
                <div>
                    <Input
                        onChange={setPass}
                        placeholder="password"
                        header="WiFi Password"
                        type="text"
                        id="password"
                        required={true}
                    />
                </div>
                <div>
                    <Input
                        onChange={setConfirmPass}
                        placeholder="password"
                        header="Confirm Password"
                        type="text"
                        id="confirmPassword"
                        required={true}
                    />
                </div>
                <div class="flex justify-end">
                    <button
                        onClick={handleSave}
                        type="submit"
                        class="text-white max-w-40 w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ">
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}
export default NetworkSettings
