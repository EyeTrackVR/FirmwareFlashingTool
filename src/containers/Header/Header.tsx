import { useLocation, useNavigate } from '@solidjs/router'
import { createMemo } from 'solid-js'
import MainHeader from '@components/Header'
import { DIRECTION, stepStatus, USB_ID } from '@src/static'
import { ENotificationType, NAVIGATION } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/api/api'
import { useAppNotificationsContext } from '@store/notifications/notifications'
import { isActiveProcess } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'

export const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { addNotification } = useAppNotificationsContext()
    const { activeBoard } = useAppAPIContext()

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(USB_ID) ? 1 : 0
    })

    const stepData = createMemo(() => {
        return stepStatus[DIRECTION[location.pathname]]
    })

    const step = createMemo(() => {
        if (!stepData()) return 0
        const index = Number(stepData()?.index ?? 0) - isUSBBoard()
        return index <= 0 ? 1 : index
    })

    return (
        <MainHeader
            hideProgressBar={typeof stepData() === 'undefined'}
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
                navigate(NAVIGATION.HOME)
            }}
            currentStep={`${step()}/${Object.values(stepStatus).length - isUSBBoard()} `}
        />
    )
}
