import Header from '@components/Header'
import { useLocation, useNavigate } from '@solidjs/router'
import { stepStatus, usb } from '@src/static'
import { DIRECTION, ENotificationType, TITLEBAR_ACTION } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { addNotification } from '@store/notifications/actions'
import { isActiveProcess } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { getTrackersCount } from '@store/trackers/selectors'
import { serverStatus } from '@store/ui/selectors'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { createMemo } from 'solid-js'

export const HeaderRoot = () => {
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
            connectionStatus={serverStatus()}
            step={stepDetails()}
            onClickSettings={() => {
                navigate('/settings')
            }}
            onClick={async (action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE: {
                        await invoke('plugin:etvr_backend|shutdown_etvr_backend')
                        await appWindow.close()
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
