import { useNavigate } from '@solidjs/router'
import { NetworkManagement } from '@pages/NetworkManagement/NetworkManagement'
import { useAppAPIContext } from '@store/context/api'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork } = useAppAPIContext()
    // const [response, setResponse] = createSignal<object>()

    // const { addNotification } = useAppNotificationsContext()
    // const { useRequestHook } = useAppAPIContext()

    // const _listen = async () => {
    //     const unlisten = await listen<string>('request-response', (event) => {
    //         const parsedResponse = JSON.parse(event.payload)
    //         setResponse(parsedResponse)
    //         debug(`[ManageNetwork]: ${JSON.stringify(parsedResponse)}`)
    //     })
    //     return unlisten
    // }

    // onMount(async () => {
    //     const unlisten = await _listen()
    //     onCleanup(unlisten)
    // })

    // const submitNetwork = async (ssid: string, password: string) => {
    //     debug(`ssid: ${ssid}`)
    //     debug(`confirmPass: ${password}`)

    //     await useRequestHook('ping', '192.168.4.1')
    //     // if (response()!['msg'] !== 'ok') {
    //     //     addNotification({
    //     //         title: 'Error',
    //     //         message:
    //     //             'Could not connect to device, please connect your PC to the EyeTrackVR Access Point and try again.',
    //     //         type: ENotificationType.ERROR,
    //     //     })
    //     //     return
    //     // }

    //     await useRequestHook(
    //         'wifi',
    //         '192.168.4.1',
    //         `?ssid=${ssid}&password=${password}&networkName=${ssid}&channel=1&power=52&adhoc=0`,
    //     )

    //     await useRequestHook('save', '192.168.4.1')

    //     // addNotification({
    //     //     title: 'Success',
    //     //     message: response()!['msg'],
    //     //     type: ENotificationType.SUCCESS,
    //     // })
    // }

    return (
        <NetworkManagement
            ssid={ssid()}
            password={password()}
            onClickSkip={() => {
                navigate('/')
            }}
            onSubmit={(ssid, password, areEqual) => {
                navigate('/flashFirmware')
                if (areEqual) return
                setNetwork(ssid, password)
                // submitNetwork(ssid, password).catch((err) => {
                //     addNotification({
                //         title: ENotificationType.ERROR,
                //         message: err.message,
                //         type: ENotificationType.ERROR,
                //     })
                // })
            }}
        />
    )
}

export default ManageNetwork
