import { useNavigate } from '@solidjs/router'
import { ask } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'
import { removeFile } from '@tauri-apps/api/fs'
import { appConfigDir, appDataDir, join } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { WebviewWindow, appWindow, getCurrent } from '@tauri-apps/api/window'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { debug, error } from 'tauri-plugin-log-api'
import FlashFirmware from '@pages/FlashFirmware/FlashFirmware'
import {
    installModalClassName,
    installModalTarget,
    installationSuccess,
    portBaudRate,
    usb,
} from '@src/static'
import { ENotificationType, TITLEBAR_ACTION } from '@src/static/types/enums'
import { CustomHTMLElement, INavigator, INavigatorPort } from '@src/static/types/interfaces'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'

export const ManageFlashFirmware = () => {
    const navigate = useNavigate()
    const {
        downloadAsset,
        getFirmwareType,
        activeBoard,
        ssid,
        mdns,
        password,
        apModeStatus,
        setAPModeStatus,
        useRequestHook,
    } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()

    const [manifest, setManifest] = createSignal<string>('')
    const [port, setPort] = createSignal<Navigator | null>(null)
    const [installationConfirmed, setInstallationConfirmed] = createSignal<boolean>(false)
    const [response, setResponse] = createSignal<object>()

    const erase = async () => {
        const appConfigPath = await appConfigDir()
        const firmwarePath = await join(appConfigPath, 'merged-firmware.bin')
        const manifestPath = await join(appConfigPath, 'manifest.json')
        await removeFile(firmwarePath)
        await removeFile(manifestPath)
    }

    const isUSBBoard = createMemo(() => activeBoard().includes(usb))

    const _listen = async () => {
        const unlisten = await listen<string>('request-response', (event) => {
            const parsedResponse = JSON.parse(event.payload)
            setResponse(parsedResponse)
            debug(`[NetworkSettings]: ${JSON.stringify(parsedResponse)}`)
        })
        return unlisten
    }

    const listenToResponse = async () => {
        const unlisten = await _listen()
        onCleanup(unlisten)
    }

    const configureAPConnection = async () => {
        addNotification({
            title: 'Making request',
            message: 'Making request',
            type: ENotificationType.INFO,
        })
        debug(`ssid: ${ssid()}`)
        debug(`pass: ${password()}`)
        debug(`confirmPass: ${password()}`)

        //* Check if there is a response from the device
        await useRequestHook('ping', '192.168.4.1')

        if (response()!['msg'] !== 'ok') {
            addNotification({
                title: 'Error',
                message:
                    'Could not connect to device, please connect your PC to the EyeTrackVR Access Point and try again.',
                type: ENotificationType.ERROR,
            })
            return
        }

        //* Make Request to set network settings
        await useRequestHook(
            'wifi',
            '192.168.4.1',
            `?ssid=${ssid()}&password=${password()}&networkName=${ssid()}&channel=1&power=52&adhoc=0`,
        )

        //* Trigger save of network settings
        addNotification({
            title: 'Success',
            message: response()!['msg'],
            type: ENotificationType.SUCCESS,
        })
        await useRequestHook('save', '192.168.4.1')
    }

    createEffect(() => {
        if (apModeStatus()) {
            listenToResponse().catch(console.error)
        }
    })

    createEffect(() => {
        appDataDir()
            .then((appDataDirPath) => {
                debug(`[WebSerial]: appDataDirPath ${appDataDirPath}`)
                join(appDataDirPath, 'manifest.json').then((manifestfilePath) => {
                    debug(`[WebSerial]: manifestfilePath ${manifestfilePath}`)
                    const url = convertFileSrc(manifestfilePath)
                    debug(`[WebSerial]: url ${url}`)
                    setManifest(url)
                })
            })
            .catch(() => {
                addNotification({
                    title: 'manifest',
                    message: 'Failed to fetch manifest',
                    type: ENotificationType.ERROR,
                })
            })
    })

    const configureWifiConnection = async () => {
        // wifi config
        const wifiConfig = { command: 'set_wifi', data: { ssid: ssid(), password: password() } }

        //mdns config
        const mdnsConfig = { command: 'set_mdns', data: { hostname: mdns() } }

        const writableStream = (
            port() as unknown as { writable: WritableStream }
        ).writable.getWriter()

        const wifiConfigJSON = JSON.stringify(wifiConfig)
        const mdnsConfigJSON = JSON.stringify(mdnsConfig)
        await writableStream.write(new TextEncoder().encode(mdnsConfigJSON))
        addNotification({
            title: 'mdns configured',
            message: 'mdns has been configured',
            type: ENotificationType.SUCCESS,
        })

        await writableStream.write(new TextEncoder().encode(wifiConfigJSON))
        addNotification({
            title: 'WIFI configured',
            message: 'WIFI has been configured',
            type: ENotificationType.SUCCESS,
        })
        setInstallationConfirmed(false)

        try {
            writableStream.releaseLock()
        } catch {
            // we can ignore this error
        }

        setPort(null)
    }

    const onClickUpdateNetworkSettings = async () => {
        setInstallationConfirmed(false)
        const port: INavigatorPort | undefined = await new Promise((resolve, reject) => {
            try {
                const port = (navigator as INavigator).serial.requestPort()
                resolve(port)
            } catch {
                reject(undefined)
            }
        })

        if (!port) {
            alert('Failed to open the serial port, try again or contact us on Discord.')
            return
        }

        const wifiConfigJSON = JSON.stringify({
            command: 'set_wifi',
            data: { ssid: ssid(), password: password() },
        })
        const mdnsConfigJSON = JSON.stringify({
            command: 'set_mdns',
            data: { hostname: mdns() },
        })

        try {
            await port.open({ baudRate: portBaudRate })
            const writableStream = (
                port as unknown as { writable: WritableStream }
            ).writable.getWriter()

            await writableStream.write(new TextEncoder().encode(mdnsConfigJSON))
            addNotification({
                title: 'mdns updated',
                message: 'mdns has been updated',
                type: ENotificationType.SUCCESS,
            })

            await writableStream.write(new TextEncoder().encode(wifiConfigJSON))
            addNotification({
                title: 'WIFI updated',
                message: 'WIFI has been updated',
                type: ENotificationType.SUCCESS,
            })

            try {
                writableStream.releaseLock()
            } catch {
                // we can ignore this error
            }

            port.close()
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert('Failed to update network settings')
                port.close()
            }
            return
        }
    }

    createEffect(() => {
        if (isUSBBoard()) return
        document.addEventListener('click', (e) => {
            const targetElement = e.target as HTMLElement
            const targetValue = targetElement.innerText
            const className = targetElement.className
            if (className === installModalClassName && targetValue === installModalTarget) {
                const el: CustomHTMLElement | null = document.querySelector('[state="INSTALL"]')
                if (el?.port) setPort(el.port)
                return
            }
            if (className === installModalClassName && targetValue === 'Next') {
                setInstallationConfirmed(false)
                setPort(null)
            }
        })
    })

    createEffect(() => {
        const playInterval = port() !== null
        const intervalId = setInterval(() => {
            if (!playInterval) return
            const el: HTMLElement | null = document.querySelector('[state="INSTALL"]')
            const ewtDialog = el?.shadowRoot?.querySelector('ewt-page-message')
            const label = ewtDialog?.getAttribute('label')
            if (label === installationSuccess) {
                if (!installationConfirmed()) {
                    setInstallationConfirmed(true)
                }
                return
            }
        }, 20)
        return () => clearInterval(intervalId)
    })

    createEffect(() => {
        const handleWifiConfigurationError = () => {
            setInstallationConfirmed(false)
            setPort(null)
            addNotification({
                title: 'WIFI configuration failed',
                message: 'Failed to configure WIFI',
                type: ENotificationType.ERROR,
            })
        }
        if (installationConfirmed() && port() !== null) {
            if (!apModeStatus()) {
                configureWifiConnection().catch(handleWifiConfigurationError)
            }
        }
    })

    return (
        <FlashFirmware
            onClickESPButton={() => {
                setInstallationConfirmed(false)
                if (port()) {
                    const closePort = port() as unknown as INavigatorPort
                    closePort.close()
                }
                setPort(null)
            }}
            isAPModeActive={apModeStatus()}
            isUSBBoard={isUSBBoard()}
            manifest={manifest()}
            onClickEnableAPMode={() => setAPModeStatus(!apModeStatus())}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE:
                        appWindow.close()
                        break
                    default:
                        return
                }
            }}
            onClickUpdateNetworkSettings={() => {
                onClickUpdateNetworkSettings().catch((err) => {
                    if ((err as DOMException).name === 'NotFoundError') {
                        alert('Failed to open the serial port, try again or contact us on Discord.')
                        return
                    }
                })
            }}
            onClickConfigurAPMode={() => {
                if (!apModeStatus()) return
                configureAPConnection().catch(() => {
                    addNotification({
                        title: 'AP Mode configuration failed',
                        message: 'Failed to configure AP Mode',
                        type: ENotificationType.ERROR,
                    })
                })
            }}
            onClickOpenModal={(id) => {
                const el = document.getElementById(id)
                if (el instanceof HTMLDialogElement) {
                    el.showModal()
                }
            }}
            checkSameFirmware={(manifest, improvInfo) => {
                const manifestFirmware = manifest.name.toLowerCase()
                const deviceFirmware = improvInfo.firmware.toLowerCase()
                return manifestFirmware.includes(deviceFirmware)
            }}
            onClickBack={() => {
                navigate(isUSBBoard() ? '/' : '/network')
            }}
            onClickDownloadFirmware={() => {
                downloadAsset(getFirmwareType()).catch(() => {
                    addNotification({
                        title: 'Firmware installation',
                        message: 'Failed to download required firmware.',
                        type: ENotificationType.ERROR,
                    })
                })
            }}
            onClickEraseSoft={() => {
                ask('This action cannot be reverted. Are you sure?', {
                    title: 'EyeTrackVR Erase Firmware Assets',
                    type: 'warning',
                })
                    .then((res) => {
                        if (res) {
                            erase()
                                .then(() => {
                                    debug('[Erasing Firmware Assets]: Erased')
                                    addNotification({
                                        title: 'ETVR Firmware Assets Erased',
                                        message:
                                            'The firmware assets have been erased from your system.',
                                        type: ENotificationType.SUCCESS,
                                    })
                                })
                                .catch((err) => {
                                    error(err)
                                    addNotification({
                                        title: 'ETVR Firmware Assets Erase Failed',
                                        message:
                                            'The firmware assets could not be erased from your system.',
                                        type: ENotificationType.ERROR,
                                    })
                                })
                        }
                    })
                    .catch(() => {
                        addNotification({
                            title: 'ETVR Firmware Assets Erase Failed',
                            message: 'The firmware assets could not be erased from your system.',
                            type: ENotificationType.ERROR,
                        })
                    })
            }}
            onClickOpenDocs={() => {
                try {
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
                        webview
                            .once('tauri://created', () => {
                                debug('WebView Window Created')
                                webview.show()
                            })
                            .catch(() => {
                                addNotification({
                                    title: 'Failed to open Docs',
                                    message: 'Oops, we could not open docs',
                                    type: ENotificationType.ERROR,
                                })
                            })
                    })
                } catch {
                    addNotification({
                        title: 'Failed to open Docs',
                        message: 'Oops, we could not open docs',
                        type: ENotificationType.ERROR,
                    })
                }
            }}
        />
    )
}

export default ManageFlashFirmware
