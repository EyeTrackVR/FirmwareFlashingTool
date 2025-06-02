import { ENotificationType, STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import { type TRACKER_POSITION } from '@interfaces/trackers/enums'
import Dashboard from '@pages/Dashboard'
import StreamSettings from '@pages/StreamSettings'
import { debounce } from '@solid-primitives/scheduled'
import { useNavigate } from '@solidjs/router'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { usePersistentStore } from '@src/Services/persistentStore'
import { addNotification } from '@store/notifications/actions'
import { loadState } from '@store/trackers/actions'
import { flipAxis, getTrackers, rotation } from '@store/trackers/selectors'
import { setFlipToggle, setRotation } from '@store/trackers/trackers'
import { createSignal, Match, onMount, Switch } from 'solid-js'

const DashboardRoot = () => {
    const [isStreamSettingsActive, setIsStreamSettingsActive] = createSignal(true)

    const { set } = usePersistentStore()
    const navigate = useNavigate()

    onMount(() => {
        loadState().catch(() => {})
    })

    const trigger = debounce(async (tracker: TRACKER_POSITION, value: number, id: string) => {
        setRotation(tracker, value)
        try {
            await set('rotation', { rotation: { ...rotation(), [tracker]: value } })
        } catch {}
        try {
            const controller = getEyeTrackVrController()
            await controller.updateTracker(id, {
                camera: {
                    rotation: value,
                },
            })
        } catch {
            addNotification({
                title: 'Failed to rotate camera',
                message: 'Failed to rotate camera',
                type: ENotificationType.INFO,
            })
        }
    }, 250)

    return (
        <Switch>
            <Match when={!isStreamSettingsActive()}>
                <Dashboard
                    isStreamSettingsActive={isStreamSettingsActive()}
                    trackers={getTrackers()}
                    onRotateCamera={trigger}
                    rotation={rotation()}
                    onClickAdvancedSettings={() => {
                        navigate('/advancedSettings')
                    }}
                    onClickStreamSettings={() => {
                        setIsStreamSettingsActive((prev) => !prev)
                    }}
                    onClickRecalibrate={() => {
                        //
                    }}
                    onClickRecenter={() => {
                        //
                    }}
                />
            </Match>
            <Match when={isStreamSettingsActive()}>
                <StreamSettings
                    flipAxis={flipAxis()}
                    trackers={getTrackers()}
                    onRotateCamera={trigger}
                    rotation={rotation()}
                    onClickToggle={(action) => {
                        setFlipToggle(action)
                    }}
                    onClickAdvancedSettings={() => {
                        navigate('/advancedSettings')
                    }}
                    isStreamSettingsActive={isStreamSettingsActive()}
                    onClickStreamSettings={() => {
                        setIsStreamSettingsActive((prev) => !prev)
                    }}
                    onClickRecalibrate={() => {
                        //
                    }}
                    onClickRecenter={() => {
                        //
                    }}
                />
            </Match>
        </Switch>
    )
}

export default DashboardRoot
