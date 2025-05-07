import { ENotificationType } from '@interfaces/enums'
import { type TRACKER_POSITION } from '@interfaces/trackers/enums'
import Dashboard from '@pages/Dashboard'
import { debounce } from '@solid-primitives/scheduled'
import { useNavigate } from '@solidjs/router'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { useAppNotificationsContext } from '@store/context/notifications'
import { loadState } from '@store/trackers/actions'
import { getTrackers, rotation } from '@store/trackers/selectors'
import { setRotation } from '@store/trackers/trackers'
import { onMount } from 'solid-js'

const DashboardRoot = () => {
    const { addNotification } = useAppNotificationsContext()
    const navigate = useNavigate()

    onMount(() => {
        loadState().catch(() => {})
    })

    const trigger = debounce(async (tracker: TRACKER_POSITION, value: number, id: string) => {
        setRotation(tracker, value)
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
    }, 100)

    return (
        <Dashboard
            rotation={rotation()}
            trackers={getTrackers()}
            onClickTracker={(id) => {
                navigate(`/TrackerDashboard/${id}`)
            }}
            onRotateCamera={trigger}
            onClickAdvancedSettings={() => {
                navigate('/advancedSettings')
            }}
            onClickRecalibrate={() => {
                //
            }}
            onClickRecenter={() => {
                //
            }}
        />
    )
}

export default DashboardRoot
