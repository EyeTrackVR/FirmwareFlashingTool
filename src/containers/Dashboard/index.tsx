import Dashboard from '@pages/Dashboard'
import { useNavigate } from '@solidjs/router'
import { boards } from '@store/boards/selectors'
const DashboardRoot = () => {
    const navigate = useNavigate()

    return (
        <Dashboard
            boards={boards()}
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
