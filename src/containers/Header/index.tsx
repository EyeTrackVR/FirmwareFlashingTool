import Header from '@components/Header'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { useNavigate } from '@solidjs/router'
import { logger } from '@src/logger'
import { download } from '@src/utils'
import { setAbortController } from '@store/terminal/terminal'
import { appVersion } from '@store/ui/selectors'
import { appWindow } from '@tauri-apps/api/window'

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
                        appWindow.close()
                    }
                    default:
                        return
                }
            }}
        />
    )
}
