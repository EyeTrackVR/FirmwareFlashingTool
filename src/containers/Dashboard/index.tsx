import Dashboard from '@pages/Dashboard'
import { useNavigate } from '@solidjs/router'
import { getBoards } from '@store/boards/selectors'
const DashboardRoot = () => {
    const navigate = useNavigate()

    return (
        <Dashboard
            boards={getBoards()}
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
