import Header from '@components/Header'
import { useLocation, useNavigate } from '@solidjs/router'
import { stepStatus, usb } from '@src/static'
import { DIRECTION, ENotificationType, TITLEBAR_ACTION } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { isActiveProcess } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'

export const HeaderRoot = () => {
    const { addNotification } = useAppNotificationsContext()
    const { activeBoard } = useAppAPIContext()

    const location = useLocation()
    const navigate = useNavigate()

    const isUSBBoardActive = createMemo(() => {
        return activeBoard().includes(usb) ? 1 : 0
    })

    const shouldHideStepIndicator = createMemo(() => {
        return typeof stepStatus[DIRECTION[location.pathname]] === 'undefined'
    })

    const computedStepIndex = createMemo(() => {
        if (!shouldHideStepIndicator()) {
            const index = stepStatus[DIRECTION[location.pathname]]?.index - isUSBBoardActive()
            return index <= 0 ? 1 : index
        }
        return 1
    })

    const formattedCurrentStep = createMemo(() => {
        if (shouldHideStepIndicator()) return undefined
        return `${computedStepIndex()}/${Object.values(stepStatus).length - isUSBBoardActive()}`
    })

    const stepDetails = createMemo(() => ({
        ...stepStatus[DIRECTION[location.pathname]],
        step: `Step ${computedStepIndex()}`,
    }))

    return (
        <Header
            appVersion={'1.7.0'}
            step={stepDetails()}
            onClick={async (action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE: {
                        appWindow.close()
                    }
                    default:
                        return
                }
            }}
            onClickHome={() => {
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
            currentStep={formattedCurrentStep()}
        />
    )
}
