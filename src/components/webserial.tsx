import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { createEffect, createSignal } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'

declare module 'solid-js' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'esp-web-install-button': any // replace any with the type of props
        }
    }
}

const WebSerial = () => {
    const [manifest, setManifest] = createSignal<string>('')
    createEffect(() => {
        appDataDir().then((appDataDirPath) => {
            debug(`[WebSerial]: appDataDirPath ${appDataDirPath}`)
            join(appDataDirPath, 'manifest.json').then((manifestfilePath) => {
                debug(`[WebSerial]: manifestfilePath ${manifestfilePath}`)
                const url = convertFileSrc(manifestfilePath)
                debug(`[WebSerial]: url ${url}`)
                setManifest(url)
            })
        })
    })
    const checkSameFirmware = (manifest, improvInfo) => {
        const manifestFirmware = manifest.name.toLowerCase()
        const deviceFirmware = improvInfo.firmware.toLowerCase()
        return manifestFirmware.includes(deviceFirmware)
    }
    return (
        <div>
            <esp-web-install-button overrides={checkSameFirmware} manifest={manifest()}>
                <button
                    class="rounded-[8px] bg-blue-700 p-2 text-white mt-1 hover:bg-blue-600 focus:bg-blue-500"
                    slot="activate">
                    Custom install button
                </button>
                <span slot="unsupported">Ah snap, your browser doesn't work!</span>
                <span slot="not-allowed">Ah snap, you are not allowed to use this on HTTP!</span>
            </esp-web-install-button>
        </div>
    )
}

export default WebSerial
