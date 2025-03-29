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
import { invoke } from '@tauri-apps/api/tauri'
import { usePersistentStore } from '@store/tauriStore'

export const HeaderRoot = () => {
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
        <Header
            step={{
                ...stepStatus[DIRECTION[location.pathname]],
                step: `Step ${step()}`,
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
                navigate('/')
            }}
            currentStep={`${step()}/${Object.values(stepStatus).length - isUSBBoard()} `}
        />
    )
}
