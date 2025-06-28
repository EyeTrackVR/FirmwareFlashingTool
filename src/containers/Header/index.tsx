import Header from '@components/Header'
import { useLocation, useNavigate } from '@solidjs/router'
import { USB } from '@src/static'
import { DIRECTION, ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@src/static/types/enums'
import { stepStatus } from '@src/static/ui'
import { useAppAPIContext } from '@store/context/api'
import { addNotification } from '@store/notifications/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { getTrackersCount } from '@store/trackers/selectors'
import { serverStatus } from '@store/ui/selectors'
import { setActiveModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'

export const HeaderRoot = () => {
    const { activeBoard } = useAppAPIContext()

    const location = useLocation()
    const navigate = useNavigate()

    const isUSBBoardActive = createMemo(() => {
        return activeBoard().includes(USB) ? 1 : 0
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
            connectionStatus={serverStatus()}
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
                        setActiveModal({ open: true, type: MODAL_TYPE.CLOSE_APP })
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
                if (getTrackersCount() > 0) {
                    navigate('/dashboard')
                } else {
                    navigate('/')
                }
            }}
            currentStep={formattedCurrentStep()}
        />
    )
}
