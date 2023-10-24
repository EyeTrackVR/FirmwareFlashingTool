import { WebviewWindow, getCurrent } from '@tauri-apps/api/window'
import { debug } from 'tauri-plugin-log-api'
import Button from '..'

export const WebSerial = () => {
    const openWebSerial = () => {
        const currentMainWindow = getCurrent()
        currentMainWindow.innerPosition().then((position) => {
            debug(`[]: ${position.x}, ${position.y}`)
            const webview = new WebviewWindow('eyetrack-webserial', {
                url: 'src/windows/webserial/index.html',
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
        <Button
            color="#800080"
            shadow="0 0 10px #800080"
            text="Open Web Serial Flasher"
            onClick={openWebSerial}
        />
    )
}
