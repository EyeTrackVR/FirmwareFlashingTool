import { useLocation, useNavigate } from '@solidjs/router'
import MainHeader from '@components/Header'
import { stepStatus } from '@src/static'
import { DIRECTION } from '@src/static/types/enums'

export const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <MainHeader
            name="Welcome!"
            step={stepStatus[DIRECTION[location.pathname]]}
            onClick={() => {
                navigate('/')
            }}
            currentStep={`${stepStatus[DIRECTION[location.pathname]].index}/${
                Object.values(stepStatus).length
            } `}
        />
    )
}
