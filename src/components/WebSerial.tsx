import { appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { FaSolidPlug } from 'solid-icons/fa'
import { createEffect, createSignal } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import CustomButton from '@components/CustomButton'

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
    const [isButtonActive, setIsButtonActive] = createSignal(false)

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
                <div slot="activate">
                    <CustomButton
                        isButtonActive={isButtonActive()}
                        tooltip="Flash Mode"
                        icon={<FaSolidPlug size={45} fill="#FFFFFFe3" />}
                        onClick={(isActive) => {
                            setIsButtonActive(isActive)
                        }}
                    />
                </div>
                <span slot="unsupported">Ah snap, your browser doesn't work!</span>
                <span slot="not-allowed">Ah snap, you are not allowed to use this on HTTP!</span>
            </esp-web-install-button>
        </div>
    )
}

export default WebSerial
