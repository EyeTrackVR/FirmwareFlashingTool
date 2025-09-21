import Header from '@components/Header'
import { logger } from '@src/logger'
import { TITLEBAR_ACTION } from '@src/static/types/enums'
import { download } from '@src/utils'
import { appWindow } from '@tauri-apps/api/window'

export const HeaderRoot = () => {
    return (
        <Header
            appVersion={'1.7.0'}
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
