import { useNavigate } from '@solidjs/router'
import { listen } from '@tauri-apps/api/event'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import { NetworkManagement } from '@pages/NetworkManagement/NetworkManagement'
import { ENotificationType } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork } = useAppAPIContext()
    const [response, setResponse] = createSignal<object>()

    const { addNotification } = useAppNotificationsContext()
    const { useRequestHook, setIsNetworkConfigured, isNetworkConfigured, loader, setLoader } =
        useAppAPIContext()

    const _listen = async () => {
        const unlisten = await listen<string>('request-response', (event) => {
            const parsedResponse = JSON.parse(event.payload)
            setResponse(parsedResponse)
            debug(`[ManageNetwork]: ${JSON.stringify(parsedResponse)}`)
        })
        return unlisten
    }

    onMount(async () => {
        const unlisten = await _listen()
        onCleanup(unlisten)
    })

    const submitNetwork = async (ssid: string, password: string) => {
        addNotification({
            title: 'Connecting to your network',
            message: 'Network configuration in progress',
            type: ENotificationType.INFO,
        })
        debug(`ssid: ${ssid}`)
        debug(`confirmPass: ${password}`)
        setLoader(true)

        await useRequestHook('ping', '192.168.4.1')

        if (!response() || response()!['msg'] !== 'ok') {
            addNotification({
                title: 'Error',
                message:
                    'Could not connect to device, please connect your PC to the EyeTrackVR Access Point and try again.',
                type: ENotificationType.ERROR,
            })
            setIsNetworkConfigured(false)
            setLoader(false)
            return
        }

        await useRequestHook(
            'wifi',
            '192.168.4.1',
            `?ssid=${ssid}&password=${password}&networkName=${ssid}&channel=1&power=52&adhoc=0`,
        )

        await useRequestHook('save', '192.168.4.1')

        setLoader(false)
        setIsNetworkConfigured(true)
        navigate('/flashFirmware')
        addNotification({
            title: 'Success',
            message: typeof response() !== 'undefined' ? response()!['msg'] : 'Success',
            type: ENotificationType.SUCCESS,
        })
    }

    return (
        <NetworkManagement
            isLoading={loader()}
            ssid={ssid()}
            password={password()}
            onClickSkip={() => {
                navigate('/')
            }}
            onSubmit={(ssid, password, areEqual) => {
                if (loader()) return
                if (areEqual && isNetworkConfigured()) {
                    navigate('/flashFirmware')
                    return
                }
                setNetwork(ssid, password)
                submitNetwork(ssid, password).catch((err) => {
                    addNotification({
                        title: ENotificationType.ERROR,
                        message: err.message,
                        type: ENotificationType.ERROR,
                    })
                })
            }}
        />
    )
}

export default ManageNetwork
