import { WebviewWindow, getCurrent } from '@tauri-apps/api/window'
import { FaSolidGraduationCap } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import CustomButton from '@components/CustomButton'

const OpenDocs = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)

    const openDocs = () => {
        const currentMainWindow = getCurrent()
        currentMainWindow.innerPosition().then((position) => {
            debug(`[OpenDocs]: Window Position${position.x}, ${position.y}`)
            const webview = new WebviewWindow('eyetrack-docs', {
                url: 'src/windows/docs/index.html',
                resizable: true,
                decorations: false,
                titleBarStyle: 'transparent',
                hiddenTitle: true,
                width: 800,
                height: 600,
                x: position.x,
                y: position.y,
                transparent: true,
            })
            webview.once('tauri://created', () => {
                debug('WebView Window Created')
                webview.show()
            })
        })
    }
    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Open ETVR Docs"
            icon={<FaSolidGraduationCap size={45} fill="#FFFFFFe3" />}
            onClick={() => {
                setIsButtonActive(!isButtonActive())
                openDocs()
            }}
        />
    )
}

export default OpenDocs
