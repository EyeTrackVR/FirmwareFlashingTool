import { useLocation, useNavigate } from '@solidjs/router'
import { createMemo } from 'solid-js'
import MainHeader from '@components/Header'
import { stepStatus, usb } from '@src/static'
import { DIRECTION, ENotificationType } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { isActiveProcess } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'

export const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { addNotification } = useAppNotificationsContext()
    const { activeBoard } = useAppAPIContext()

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb) ? 1 : 0
    })

    const step = createMemo(() => {
        const index = stepStatus[DIRECTION[location.pathname]].index - isUSBBoard()
        return index <= 0 ? 1 : index
    })

    return (
        <MainHeader
            name="Welcome!"
            step={{
                ...stepStatus[DIRECTION[location.pathname]],
                step: `Step ${step()}`,
            }}
            onClick={() => {
                if (isActiveProcess()) {
                    addNotification({
                        title: 'There is an active installation. Please wait.',
                        message: 'There is an active installation. Please wait.',
                        type: ENotificationType.INFO,
                    })
                    return true
                }
                setAbortController()
                navigate('/')
            }}
            currentStep={`${step()}/${Object.values(stepStatus).length - isUSBBoard()} `}
        />
    )
}
