import Welcome from '@pages/Welcome'
import { useNavigate } from '@solidjs/router'
import { setNavigationStep } from '@store/ui/ui'
import { onMount } from 'solid-js'

const WelcomeRoot = () => {
    const navigate = useNavigate()

    onMount(() => {
        setNavigationStep('')
    })

    return (
        <Welcome
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
