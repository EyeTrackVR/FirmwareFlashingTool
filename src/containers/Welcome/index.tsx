import Welcome from '@pages/Welcome'
import { useNavigate } from '@solidjs/router'
import { configuredTrackersCount } from '@store/trackers/selectors'
import { setNavigationStep } from '@store/ui/ui'
import { onMount } from 'solid-js'

const WelcomeRoot = () => {
    const navigate = useNavigate()

    onMount(() => {
        setNavigationStep('')
    })

    return (
        <Welcome
            isConfigured={configuredTrackersCount() > 0}
            onClickDashboard={() => navigate('/dashboard')}
            onClickSetup={() => {
                navigate('/configureBoardWizard')
            }}
            onClickAddExisting={() => {
                navigate('/boardImportWizard')
            }}
        />
    )
}

export default WelcomeRoot
