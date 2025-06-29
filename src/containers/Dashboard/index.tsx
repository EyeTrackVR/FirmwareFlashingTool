import { ENotificationType, STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import { IUpdateTracker } from '@interfaces/services/interfaces'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import Dashboard from '@pages/Dashboard'
import StreamSettings from '@pages/StreamSettings'
import { debounce } from '@solid-primitives/scheduled'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { box } from '@src/utils'
import { addNotification } from '@store/notifications/actions'
import { canvasBoxPositions, config, getTrackers } from '@store/trackers/selectors'
import { setCanvasBoxPositions, setConfig } from '@store/trackers/trackers'
import { isStreamSettingsActive } from '@store/ui/selectors'
import { setIsStreamSettingsActive } from '@store/ui/ui'
import { createEffect, createMemo, createSignal, Match, on, Switch } from 'solid-js'

const DashboardRoot = () => {
    const [loader, setLoader] = createSignal(false)
    const [rotation, setRotation] = createSignal<Partial<Record<TRACKER_POSITION, number>>>({})
    const [toggle, setToggle] = createSignal<Partial<Record<STREAM_TOGGLE_FLIP, boolean>>>({})
    const [originalToggle, setOriginalToggle] = createSignal<
        Partial<Record<STREAM_TOGGLE_FLIP, boolean>>
    >({})

    const hasChanges = createMemo(() => {
        return (
            Object.keys(toggle()).some((key) => toggle()[key] !== originalToggle()[key]) ||
            Object.keys(originalToggle()).some((key) => toggle()[key] !== originalToggle()[key])
        )
    })

    const showErrorNotification = (title: string, message: string) => {
        addNotification({ title, message, type: ENotificationType.ERROR })
    }

    const showInfoNotification = (title: string, message: string) => {
        addNotification({ title, message, type: ENotificationType.INFO })
    }

    const updateConfig = async () => {
        try {
            const controller = getEyeTrackVrController()
            const config = await controller.getConfig(true)
            setConfig(config)
        } catch {
            showErrorNotification('Failed to update config', 'Failed to update config')
        }
    }

    const getChangedToggles = () => {
        return Object.keys(toggle())
            .filter((key) => originalToggle()[key] !== toggle()[key])
            .reduce((acc, key) => {
                const value = toggle()[key]
                if (value !== undefined) {
                    acc[key] = value
                }
                return acc
            }, {})
    }

    const trigger = debounce(async (id: string, data: Partial<IUpdateTracker>) => {
        try {
            const controller = getEyeTrackVrController()
            await controller.updateTracker(id, data)
        } catch {
            showErrorNotification('Failed to rotate camera', 'Failed to rotate camera')
        }
        await updateConfig()
    }, 250)

    const triggerUpdateSettings = debounce(async () => {
        setLoader(true)

        try {
            const trackers = config().trackers.map((tracker) => ({
                trackerPosition: tracker.tracker_position as TRACKER_POSITION,
                address: tracker.uuid,
            }))

            const controller = getEyeTrackVrController()
            await controller.updateTrackersAlgorithms(trackers, {
                camera: getChangedToggles(),
            })

            showInfoNotification('Updated config', 'Updated config')
        } catch {
            showErrorNotification('Failed to update config', 'Failed to update config')
        }

        await updateConfig()
        setLoader(false)
    }, 250)

    createEffect(
        on(config, () => {
            const rotationState = {
                [TRACKER_POSITION.LEFT_EYE]: 0,
                [TRACKER_POSITION.RIGHT_EYE]: 0,
            }

            const toggleConfig: Partial<Record<STREAM_TOGGLE_FLIP, boolean>> = {}
            const firstTracker = config().trackers[0]

            if (firstTracker) {
                toggleConfig[STREAM_TOGGLE_FLIP.FLIP_X_AXIS] = firstTracker.camera.flip_x_axis
                toggleConfig[STREAM_TOGGLE_FLIP.FLIP_Y_AXIS] = firstTracker.camera.flip_y_axis
            }

            config().trackers.forEach((tracker) => {
                rotationState[tracker.tracker_position as TRACKER_POSITION] =
                    tracker.camera.rotation

                setCanvasBoxPositions(
                    {
                        x: tracker.camera.roi_x * 2,
                        y: tracker.camera.roi_y * 2,
                        width: tracker.camera.roi_w * 2,
                        height: tracker.camera.roi_h * 2,
                    },
                    tracker.tracker_position as TRACKER_POSITION,
                )
            })
            setRotation(rotationState)
            setToggle(toggleConfig)
            setOriginalToggle(toggleConfig)
        }),
    )

    return (
        <Switch>
            <Match when={!isStreamSettingsActive()}>
                <Dashboard
                    isStreamSettingsActive={isStreamSettingsActive()}
                    trackers={getTrackers()}
                    onClickStreamSettings={() => {
                        setIsStreamSettingsActive(!isStreamSettingsActive())
                    }}
                    onClickRecalibrate={() => {}}
                    onClickRecenter={() => {}}
                />
            </Match>
            <Match when={isStreamSettingsActive()}>
                <StreamSettings
                    loader={loader()}
                    onClickUpdateSettings={triggerUpdateSettings}
                    onClickReset={() => {
                        if (hasChanges()) {
                            setToggle(originalToggle())
                        }
                    }}
                    updateAllowed={hasChanges()}
                    setCanvasBoxPositions={(boxPosition, id) => {
                        trigger(id, { camera: box(boxPosition, 2) })
                    }}
                    canvasBoxPositions={canvasBoxPositions()}
                    flipAxis={toggle()}
                    trackers={getTrackers()}
                    onRotateCamera={(tracker: TRACKER_POSITION, value: number, id: string) => {
                        setRotation((prev) => ({ ...prev, [tracker]: value }))
                        trigger(id, { camera: { rotation: value } })
                    }}
                    rotation={rotation()}
                    onClickToggle={(action: STREAM_TOGGLE_FLIP) => {
                        setToggle((prev) => ({ ...prev, [action]: !prev[action] }))
                    }}
                    isStreamSettingsActive={isStreamSettingsActive()}
                    onClickStreamSettings={() => {
                        setIsStreamSettingsActive(!isStreamSettingsActive())
                    }}
                    onClickRecalibrate={() => {}}
                    onClickRecenter={() => {}}
                />
            </Match>
        </Switch>
    )
}

export default DashboardRoot
