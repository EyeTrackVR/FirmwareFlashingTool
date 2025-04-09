import Welcome from '@pages/Welcome'
import { useNavigate } from '@solidjs/router'
import { useAppUIContext } from '@store/context/ui'
import { onMount } from 'solid-js'

const WelcomeRoot = () => {
    const { setNavigationStep } = useAppUIContext()
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
