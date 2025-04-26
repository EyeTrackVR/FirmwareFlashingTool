import Dashboard from '@pages/Dashboard'
import { useNavigate } from '@solidjs/router'
import { loadTrackersState } from '@store/trackers/actions'
import { getTrackers } from '@store/trackers/selectors'
import { onMount } from 'solid-js'
const DashboardRoot = () => {
    const navigate = useNavigate()

    onMount(() => {
        loadTrackersState().catch(() => {})
    })

    return (
        <Dashboard
            trackers={getTrackers()}
            onClickTracker={(id) => {
                navigate(`/TrackerDashboard/${id}`)
            }}
            onRotateCamera={(value, tracker) => {
                //
            }}
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
