import Header from '@components/Header'
import { TITLEBAR_ACTION } from '@src/static/types/enums'
import { appWindow } from '@tauri-apps/api/window'

export const HeaderRoot = () => {
    return (
        <Header
            appVersion={'1.7.0'}
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
