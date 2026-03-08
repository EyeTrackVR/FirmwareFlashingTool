import Header from '@components/Header'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { useNavigate } from '@solidjs/router'
import { logger } from '@src/logger'
import { download } from '@src/utils'
import { addNotification } from '@store/actions/notifications/addNotification'
import { setAbortController } from '@store/terminal/terminal'
import { appVersion } from '@store/ui/selectors'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'

export const HeaderRoot = () => {
    const navigate = useNavigate()
    return (
        <Header
            appVersion={appVersion()}
            onClickHome={() => {
                navigate('/')
                setAbortController('logs')
            }}
            onClickDownloadLogs={() => {
                download(logger.getLogs(), 'firmwareLogs.log')
                addNotification({
                    title: 'Logs downloaded',
                    message: 'Logs downloaded',
                    type: NOTIFICATION_TYPE.INFO,
                })
            }}
            onClick={async (action: TITLEBAR_ACTION) => {
                const appWindow = getCurrentWebviewWindow()

                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE: {
                        appWindow.close()
                        break
                    }
                    default:
                        return
                }
            }}
        />
    )
}
