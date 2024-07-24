import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { createEffect, createSignal, onCleanup } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import ApModeModal from '@pages/Modals/ApModeModal'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'

const ApModeContainer = () => {
    const { modal, setOpenModal } = useAppUIContext()
    const { addNotification } = useAppNotificationsContext()
    const { ssid, password, useRequestHook } = useAppAPIContext()
    const [response, setResponse] = createSignal<object>()

    const configureAPConnection = async () => {
        addNotification({
            title: 'Making request',
            message: 'Making request',
            type: ENotificationType.INFO,
        })
        debug(`ssid: ${ssid()}`)
        debug(`pass: ${password()}`)
        debug(`confirmPass: ${password()}`)

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
            `?ssid=${ssid()}&password=${password()}&networkName=${ssid()}&channel=1&power=52&adhoc=0`,
        )

        //* Trigger save of network settings
        addNotification({
            title: 'Success',
            message: response()!['msg'],
            type: ENotificationType.SUCCESS,
        })
        await useRequestHook('save', '192.168.4.1')
    }

    const _listen = async () => {
        const unlisten = await listen<string>('request-response', (event) => {
            const parsedResponse = JSON.parse(event.payload)
            setResponse(parsedResponse)
            debug(`[NetworkSettings]: ${JSON.stringify(parsedResponse)}`)
        })
        return unlisten
    }

    const listenToResponse = async () => {
        const unlisten = await _listen()
        onCleanup(unlisten)
    }

    createEffect(() => {
        if (modal().type === MODAL_TYPE.AP_MODE) {
            listenToResponse().catch(console.error)
        }
    })

    return (
        <ApModeModal
            isActive={modal().type === MODAL_TYPE.AP_MODE}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE:
                        appWindow.close()
                        break
                    default:
                        return
                }
            }}
            onClickClose={() => {
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
            onClick={() => {
                configureAPConnection().catch(() => {
                    addNotification({
                        title: 'AP Mode configuration failed',
                        message: 'Failed to configure AP Mode',
                        type: ENotificationType.ERROR,
                    })
                })
            }}
        />
    )
}

export default ApModeContainer
