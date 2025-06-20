import { ENotificationType } from '@interfaces/enums'
import { TRACKING_ALGORITHM_SETTINGS_ENUM } from '@interfaces/Settings/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import AlgorithmTrackingSettings from '@pages/Settings/AlgorithmTrackingSettings'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { addNotification } from '@store/notifications/actions'
import { config } from '@store/trackers/selectors'
import { setConfig } from '@store/trackers/trackers'
import { createEffect, createMemo, createSignal, on } from 'solid-js'

const AlgorithmTrackingSettingsRoot = () => {
    const [loader, setLoader] = createSignal(false)
    const [originalInputChange, setOriginalInputChange] = createSignal(180)
    const [inputChange, setInputChange] = createSignal(180)
    const [toggle, setToggle] = createSignal<
        Partial<Record<TRACKING_ALGORITHM_SETTINGS_ENUM, boolean>>
    >({})
    const [originalToggle, setOriginalToggle] = createSignal<
        Partial<Record<TRACKING_ALGORITHM_SETTINGS_ENUM, boolean>>
    >({})

    const updateConfig = async () => {
        setLoader(true)
        try {
            const trackers = config().trackers.map((tracker) => {
                return {
                    trackerPosition: tracker.tracker_position as TRACKER_POSITION,
                    address: tracker.uuid,
                }
            })

            const controller = getEyeTrackVrController()
            await controller.updateTrackersAlgorithms(trackers, {
                algorithm: {
                    hsf: Object.fromEntries(
                        Object.entries({
                            blink_stat_frames: inputChange(),
                            skip_autoradius:
                                toggle()[TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_AUTO_RADIUS],
                            skip_blink_detection:
                                toggle()[TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_BLINK_DETECTION],
                        }).filter(([_, v]) => v !== undefined),
                    ),
                },
            })
            addNotification({
                title: 'Updated config',
                message: 'Updated config',
                type: ENotificationType.INFO,
            })
        } catch {
            addNotification({
                title: 'Failed to update config',
                message: 'Failed to update config',
                type: ENotificationType.INFO,
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
                type: ENotificationType.INFO,
            })
        }
        setLoader(false)
    }

    createEffect(
        on(config, () => {
            const tracker = config()?.trackers[0]

            if (!tracker) {
                // TODO: Add logic to fetch data in case something goes wrong
                return
            }

            const blinkStatFrames = tracker?.algorithm.hsf?.blink_stat_frames ?? 180
            const toggleConfig = {
                [TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_AUTO_RADIUS]:
                    tracker?.algorithm?.hsf?.skip_autoradius,
                [TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_BLINK_DETECTION]:
                    tracker?.algorithm?.hsf?.skip_blink_detection,
            }

            setOriginalToggle(toggleConfig)
            setToggle(toggleConfig)

            setOriginalInputChange(blinkStatFrames)
            setInputChange(blinkStatFrames)
        }),
    )

    const hasChanges = createMemo(() => {
        const toggleChanged =
            Object.keys(toggle()).some((key) => toggle()[key] !== originalToggle()[key]) ||
            Object.keys(originalToggle()).some((key) => toggle()[key] !== originalToggle()[key])

        const inputChanged =
            inputChange() !== originalInputChange() || originalInputChange() !== inputChange()

        return toggleChanged || inputChanged
    })

    return (
        <AlgorithmTrackingSettings
            loader={loader()}
            inputChange={inputChange()}
            showButtons={hasChanges()}
            toggle={toggle()}
            onInputChange={(value) => {
                setInputChange(value)
            }}
            onToggle={(toggleKey, status) => {
                setToggle((prev) => {
                    return { ...prev, [toggleKey]: status }
                })
            }}
            onClickReset={() => {
                if (hasChanges()) {
                    setToggle({ ...originalToggle() })
                    setInputChange(originalInputChange())
                }
            }}
            onClickUpdateSettings={() => {
                updateConfig().catch(() => {})
            }}
        />
    )
}

export default AlgorithmTrackingSettingsRoot
