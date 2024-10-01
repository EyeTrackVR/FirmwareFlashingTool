import { useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'
import WelcomePage from '@pages/WelcomePage/Index'
import { useAppUIContext } from '@store/ui/ui'

const Welcome = () => {
    const { setResetNavigationStep, setNavigationStep } = useAppUIContext()
    const navigate = useNavigate()

    onMount(() => {
        setResetNavigationStep()
    })

    return (
        <WelcomePage
            onClick={(navigation) => {
                setNavigationStep(navigation)
                navigate(navigation)
            }}
        />
    )
}

export default Welcome
