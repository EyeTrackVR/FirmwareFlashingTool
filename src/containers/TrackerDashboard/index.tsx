import { useParams } from '@solidjs/router'

const TrackerDashboard = () => {
    const route = useParams()

    return <div>tracker uuid {route.id} </div>
}

export default TrackerDashboard
