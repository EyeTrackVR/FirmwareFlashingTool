import { ALGORITHM_ORDER_SETTINGS } from '@interfaces/Settings/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { NOTIFICATION_TYPE } from '@interfaces/ui/enums'
import AlgorithmSelectionSettings from '@pages/Settings/AlgorithmSelectionSettings'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { addNotification } from '@store/notifications/actions'
import { config } from '@store/trackers/selectors'
import { setConfig } from '@store/trackers/trackers'
import { createEffect, createMemo, createSignal, on } from 'solid-js'

const AlgorithmSelectionSettingsRoot = () => {
    const [loader, setLoader] = createSignal(false)
    const [cameraFeed, setCameraFeed] = createSignal('')
    const [toggle, setToggle] = createSignal<Partial<Record<ALGORITHM_ORDER_SETTINGS, boolean>>>({})
    const [originalToggle, setOriginalToggle] = createSignal<
        Partial<Record<ALGORITHM_ORDER_SETTINGS, boolean>>
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

            const order = Object.fromEntries(
                Object.entries(toggle()).filter(([_, v]) => v !== undefined && v !== false),
            )

            const controller = getEyeTrackVrController()
            await controller.updateTrackersAlgorithms(trackers, {
                algorithm: {
                    algorithm_order: Object.keys(order).map((el) => el.toLocaleUpperCase()),
                },
            })

            addNotification({
                title: 'Updated config',
                message: 'Updated config',
                type: NOTIFICATION_TYPE.INFO,
            })
        } catch {
            addNotification({
                title: 'Failed to update config',
                message: 'Failed to update config',
                type: NOTIFICATION_TYPE.ERROR,
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
            const tracker = config()?.trackers[0]

            if (!tracker) {
                // TODO: Add logic to fetch data in case something goes wrong
                return
            }
            const keys = Object.fromEntries(
                tracker.algorithm.algorithm_order.map((key) => [key, true]),
            )

            const options = Object.fromEntries(
                Object.keys(ALGORITHM_ORDER_SETTINGS).map((key) => [
                    key.toLocaleLowerCase(),
                    key in keys,
                ]),
            )
            const controller = getEyeTrackVrController()
            setCameraFeed(controller.getAlgorithmFeed(tracker.uuid))
            setToggle(options)
            setOriginalToggle(options)
        }),
    )

    const hasChanges = createMemo(() => {
        const toggleChanged =
            Object.keys(toggle()).some((key) => toggle()[key] !== originalToggle()[key]) ||
            Object.keys(originalToggle()).some((key) => toggle()[key] !== originalToggle()[key])
        return toggleChanged
    })

    return (
        <AlgorithmSelectionSettings
            cameraFeed={cameraFeed()}
            updateAllowed={hasChanges()}
            loader={loader()}
            toggle={toggle()}
            onClickReset={() => {
                setToggle(originalToggle())
            }}
            onClickUpdateSettings={() => {
                updateConfig().catch(() => {})
            }}
            onToggle={(toggleKey, status) => {
                setToggle((prev) => {
                    return { ...prev, [toggleKey]: status }
                })
            }}
        />
    )
}

export default AlgorithmSelectionSettingsRoot
