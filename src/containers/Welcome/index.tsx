import Welcome from '@pages/Welcome'
import { useNavigate } from '@solidjs/router'

const WelcomeRoot = () => {
    const navigate = useNavigate()

    return (
        <Welcome
            onClickSetup={() => {
                navigate('/configureBoard')
            }}
            onClickAddExisting={() => {
                // coming soon
            }}
        />
    )
}

export default WelcomeRoot
