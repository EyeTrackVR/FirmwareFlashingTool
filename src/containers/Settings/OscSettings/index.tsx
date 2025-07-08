import { IEndpoints, IOSCSettings } from '@interfaces/services/interfaces'
import { OSC_SETTINGS_ENUM } from '@interfaces/Settings/enums'
import { NOTIFICATION_TYPE } from '@interfaces/ui/enums'
import OscSettings from '@pages/Settings/OscSettings'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { addNotification } from '@store/notifications/actions'
import { config } from '@store/trackers/selectors'
import { setConfig } from '@store/trackers/trackers'
import { createEffect, createMemo, createSignal, on } from 'solid-js'

const OscSettingsRoot = () => {
    const [loader, setLoader] = createSignal(false)
    const [toggle, setToggle] = createSignal<Partial<Record<OSC_SETTINGS_ENUM, boolean>>>({})
    const [inputChange, setInputChange] = createSignal<Partial<Record<OSC_SETTINGS_ENUM, string>>>(
        {},
    )
    const [originalToggle, setOriginalToggle] = createSignal<
        Partial<Record<OSC_SETTINGS_ENUM, boolean>>
    >({})
    const [originalInputChange, setOriginalInputChange] = createSignal<
        Partial<Record<OSC_SETTINGS_ENUM, string>>
    >({})

    const hasChanges = createMemo(() => {
        const toggleChanged =
            Object.keys(toggle()).some((key) => toggle()[key] !== originalToggle()[key]) ||
            Object.keys(originalToggle()).some((key) => toggle()[key] !== originalToggle()[key])

        const inputChanged =
            Object.keys(inputChange()).some((key) => {
                return inputChange()[key] !== originalInputChange()[key]
            }) ||
            Object.keys(originalInputChange()).some((key) => {
                return inputChange()[key] !== originalInputChange()[key]
            })

        return toggleChanged || inputChanged
    })

    const updateConfig = async () => {
        setLoader(true)
        try {
            const controller = getEyeTrackVrController()
            const toggles: Partial<IOSCSettings> = Object.keys(toggle())
                .filter((key) => originalToggle()[key] !== toggle()[key])
                .reduce((a, b) => {
                    a[b] = toggle()[b]
                    return a
                }, {})

            const endpoints: Partial<IEndpoints> = Object.keys(inputChange())
                .filter((key) => originalInputChange()[key] !== inputChange()[key])
                .reduce((a, b) => {
                    a[b] = inputChange()[b]
                    return a
                }, {})

            await controller.sendConfig({
                osc: Object.fromEntries(
                    Object.entries({
                        ...toggles,
                        endpoints,
                        receiver_port: endpoints?.receiver_port,
                        sending_port: endpoints?.sending_port,
                        address: endpoints?.address,
                    }).filter(([_, v]) => v !== undefined),
                ),
            })

            addNotification({
                title: 'Updated config',
                message: 'Updated config',
                type: NOTIFICATION_TYPE.INFO,
            })
        } catch (err) {
            addNotification({
                title: 'There was a problem updating the current configuration.',
                message: 'There was a problem updating the current configuration.',
                type: NOTIFICATION_TYPE.INFO,
            })
        }
        try {
            const controller = getEyeTrackVrController()
            const config = await controller.getConfig(true)
            setConfig(config)
        } catch {
            addNotification({
                title: 'Failed to update config',
                message: 'Failed to update config',
                type: NOTIFICATION_TYPE.ERROR,
            })
        }

        setLoader(false)
    }

    createEffect(
        on(config, () => {
            const inputConfig = {
                [OSC_SETTINGS_ENUM.RIGHT_EYE_BLINK]: config().osc.endpoints.right_eye_blink,
                [OSC_SETTINGS_ENUM.LEFT_EYE_BLINK]: config().osc.endpoints.left_eye_blink,
                [OSC_SETTINGS_ENUM.RECEIVER_PORT]: config().osc.receiver_port.toString(),
                [OSC_SETTINGS_ENUM.SENDING_PORT]: config().osc.sending_port.toString(),
                [OSC_SETTINGS_ENUM.RIGHT_EYE_X]: config().osc.endpoints.right_eye_x,
                [OSC_SETTINGS_ENUM.RECALIBRATE]: config().osc.endpoints.recalibrate,
                [OSC_SETTINGS_ENUM.LEFT_EYE_X]: config().osc.endpoints.left_eye_x,
                [OSC_SETTINGS_ENUM.SYNC_BLINK]: config().osc.endpoints.sync_blink,
                [OSC_SETTINGS_ENUM.RECENTER]: config().osc.endpoints.recenter,
                [OSC_SETTINGS_ENUM.EYES_Y]: config().osc.endpoints.eyes_y,
                [OSC_SETTINGS_ENUM.ADDRESS]: config().osc.address,
            }
            const toggleConfig = {
                [OSC_SETTINGS_ENUM.VRCHAT_NATIVE_TRACKING]: config().osc.vrchat_native_tracking,
                [OSC_SETTINGS_ENUM.ENABLE_RECEIVING]: config().osc.enable_receiving,
                [OSC_SETTINGS_ENUM.ENABLE_SENDING]: config().osc.enable_sending,
                [OSC_SETTINGS_ENUM.MIRROR_EYES]: config().osc.mirror_eyes,
                [OSC_SETTINGS_ENUM.SYNC_BLINK]: config().osc.sync_blink,
            }
            setOriginalToggle(toggleConfig)
            setToggle(toggleConfig)

            setOriginalInputChange(inputConfig)
            setInputChange(inputConfig)
        }),
    )

    return (
        <OscSettings
            loader={loader()}
            updateAllowed={hasChanges()}
            toggle={toggle()}
            inputChange={inputChange()}
            onClickUpdateSettings={() => {
                updateConfig().catch(() => {})
            }}
            onClickReset={() => {
                if (hasChanges()) {
                    setToggle({ ...originalToggle() })
                    setInputChange({ ...originalInputChange() })
                }
            }}
            onInputChange={(key, value) => {
                setInputChange((prev) => {
                    return { ...prev, [key]: value }
                })
            }}
            onToggle={(toggleKey, status) => {
                setToggle((prev) => {
                    return { ...prev, [toggleKey]: status }
                })
            }}
        />
    )
}

export default OscSettingsRoot
