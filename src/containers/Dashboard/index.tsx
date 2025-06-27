import { ENotificationType, STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import { IUpdateTracker } from '@interfaces/services/interfaces'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import Dashboard from '@pages/Dashboard'
import StreamSettings from '@pages/StreamSettings'
import { debounce } from '@solid-primitives/scheduled'
import { useNavigate } from '@solidjs/router'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { addNotification } from '@store/notifications/actions'
import { canvasBoxPositions, config, getTrackers } from '@store/trackers/selectors'
import { setCanvasBoxPositions, setConfig } from '@store/trackers/trackers'
import { createEffect, createMemo, createSignal, Match, on, Switch } from 'solid-js'

const DashboardRoot = () => {
    const navigate = useNavigate()

    const [loader, setLoader] = createSignal(false)
    const [rotation, setRotation] = createSignal<Partial<Record<TRACKER_POSITION, number>>>({})
    const [toggle, setToggle] = createSignal<Partial<Record<STREAM_TOGGLE_FLIP, boolean>>>({})
    const [originalToggle, setOriginalToggle] = createSignal<
        Partial<Record<STREAM_TOGGLE_FLIP, boolean>>
    >({})
    const [isStreamSettingsActive, setIsStreamSettingsActive] = createSignal(false)

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

    const handleRotateCamera = (tracker: TRACKER_POSITION, value: number, id: string) => {
        setRotation((prev) => ({ ...prev, [tracker]: value }))
        trigger(id, { camera: { rotation: value } })
    }

    const handleToggleFlip = (action: STREAM_TOGGLE_FLIP) => {
        setToggle((prev) => ({ ...prev, [action]: !prev[action] }))
    }

    const handleResetSettings = () => {
        if (hasChanges()) {
            setToggle(originalToggle())
        }
    }

    const handleCanvasBoxPositions = (boxPosition: any, id: string) => {
        const x = Math.trunc(boxPosition.x / 2)
        const y = Math.trunc(boxPosition.y / 2)
        const width = Math.trunc(boxPosition.width / 2)
        const height = Math.trunc(boxPosition.height / 2)

        const config = {
            camera: {
                roi_h: Math.round(height),
                roi_w: Math.round(width),
                roi_x: Math.round(x),
                roi_y: Math.round(y),
            },
        }

        trigger(id, config)
    }

    const toggleStreamSettings = () => {
        setIsStreamSettingsActive((prev) => !prev)
    }

    const navigateToAdvancedSettings = () => {
        navigate('/advancedSettings')
    }

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
                    onClickAdvancedSettings={navigateToAdvancedSettings}
                    onClickStreamSettings={toggleStreamSettings}
                    onClickRecalibrate={() => {}}
                    onClickRecenter={() => {}}
                />
            </Match>

            <Match when={isStreamSettingsActive()}>
                <StreamSettings
                    loader={loader()}
                    onClickUpdateSettings={triggerUpdateSettings}
                    onClickReset={handleResetSettings}
                    updateAllowed={hasChanges()}
                    setCanvasBoxPositions={handleCanvasBoxPositions}
                    canvasBoxPositions={canvasBoxPositions()}
                    flipAxis={toggle()}
                    trackers={getTrackers()}
                    onRotateCamera={handleRotateCamera}
                    rotation={rotation()}
                    onClickToggle={handleToggleFlip}
                    onClickAdvancedSettings={navigateToAdvancedSettings}
                    isStreamSettingsActive={isStreamSettingsActive()}
                    onClickStreamSettings={toggleStreamSettings}
                    onClickRecalibrate={() => {}}
                    onClickRecenter={() => {}}
                />
            </Match>
        </Switch>
    )
}

export default DashboardRoot
