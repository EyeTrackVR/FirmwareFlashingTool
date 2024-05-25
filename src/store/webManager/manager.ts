import { Transport, ESPLoader } from 'esptool-js'
import { FLASH_STATE_TYPE } from '@interfaces/enums'
import {
    type Manifest,
    type IError,
    type INavigator,
    type INavigatorPort,
    type Build,
} from '@interfaces/interfaces'
import { type chipFamilyType } from '@interfaces/types'
import { sleep } from '@src/utils'

export class WebManager {
    public error: IError = { state: FLASH_STATE_TYPE.UNKNOWN, message: null }
    private port: INavigatorPort | null = null
    readonly romBaudRate: number = 115200
    readonly baudRate: number = 115200
    public manifestPath: string | null = null

    async connect(): Promise<void> {
        try {
            const requestPort = await (navigator as INavigator).serial.requestPort()

            this.port = requestPort
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.error = {
                    state: FLASH_STATE_TYPE.ERROR,
                    message: err,
                }
                this.port = null
            }
        }
    }

    public getPort(): INavigatorPort | null {
        return this.port
    }

    async openPort(): Promise<void> {
        if (!this.port) return

        try {
            await this.port.open({ baudRate: this.baudRate })
        } catch (err: unknown) {
            // we can ignore this error
            if (err instanceof Error) {
                console.log(err)
            }
        }
    }

    public getError(): IError {
        return this.error
    }

    public closePort(): void {
        if (this.port !== null) {
            this.port.close()
            this.port = null
        }
    }

    private async restartBoard(): Promise<void> {
        if (this.port === null) return

        await this.port.setSignals({ dataTerminalReady: false, requestToSend: true })
        await sleep(250)

        await this.port.setSignals({ dataTerminalReady: false, requestToSend: false })
        await sleep(250)
    }

    private async restartTransport(transport: Transport) {
        await transport.device.setSignals({ dataTerminalReady: false, requestToSend: true })
        await sleep(250)

        await transport.device.setSignals({ dataTerminalReady: false, requestToSend: false })
        await sleep(250)
    }

    public async downloadManifest(manifestPath: string): Promise<Manifest> {
        const manifestURL = new URL(manifestPath, location.toString()).toString()
        const resp = await fetch(manifestURL)
        const manifest = await resp.json()

        if ('new_install_skip_erase' in manifest) {
            // TODO: later add a better handle for this shit here
            console.warn(
                'Manifest option "new_install_skip_erase" is deprecated. Use "new_install_prompt_erase" instead.',
            )
            if (manifest.new_install_skip_erase) {
                manifest.new_install_prompt_erase = true
            }
        }

        return manifest
    }

    public async getLogs(
        callback: (logs: string) => void,
        abortSignal?: AbortSignal,
    ): Promise<void> {
        if (this.port === null) {
            this.error = {
                state: FLASH_STATE_TYPE.ERROR,
                message: new Error('Port is not defined'),
            }
            return
        }

        await this.restartBoard()

        if (this.port.readable) {
            const textDecoderStream = new TextDecoderStream()
            const transformStream = new TransformStream()
            const writableStream = new WritableStream({
                async write(chunk) {
                    const line = chunk.replace('\r', '')
                    await sleep(50)
                    callback(line)
                },
            })

            this.port.readable
                .pipeThrough(textDecoderStream, {
                    signal: abortSignal,
                })
                .pipeThrough(transformStream)
                .pipeTo(writableStream)
        }
    }

    manageError(error: Error) {
        console.log(
            'Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.',
        )
        console.log('just in case error', error.message)
    }

    async flashFirmware(onEvent: (event: FLASH_STATE_TYPE) => void) {
        let build: Build | undefined = undefined
        let chipFamily: Build['chipFamily'] | undefined = undefined

        const transport = new Transport(this.port)
        const espLoader = new ESPLoader({
            transport,
            baudrate: this.baudRate,
            romBaudrate: this.romBaudRate,
            enableTracing: true,
        })

        onEvent(FLASH_STATE_TYPE.INITIALIZING)
        try {
            await espLoader.main()
            await espLoader.flashId()
        } catch (error: unknown) {
            if (error instanceof Error) {
                onEvent(FLASH_STATE_TYPE.INITIALIZING_FAILED)
                this.manageError(error)
            }
        }
        onEvent(FLASH_STATE_TYPE.INITIALIZING_SUCCEED)
        onEvent(FLASH_STATE_TYPE.LOADING_CHIP)

        chipFamily = espLoader.chip.CHIP_NAME as chipFamilyType

        if (!espLoader.chip.ROM_TEXT) {
            console.log(`Chip ${chipFamily} is not supported`)
            onEvent(FLASH_STATE_TYPE.LOADING_CHIP_FAILED)
            await this.restartTransport(transport)
            await transport.disconnect()
            return
        }
        onEvent(FLASH_STATE_TYPE.LOADING_CHIP_SUCCEED)
        onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST_PATH)
        console.log(`Initialized. Found ${chipFamily}`)

        if (this.manifestPath == null) {
            onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST_PATH_FAILED)
            console.log('manifestPath is not defined')
            return
        }
        onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST_PATH_SUCCEED)
        onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST)

        let manifest: Manifest | null = null
        try {
            manifest = await this.downloadManifest(this.manifestPath)
            onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST_SUCCEED)
        } catch {
            onEvent(FLASH_STATE_TYPE.LOADING_MANIFEST_FAILED)
            console.log('failed to download manifest')
            manifest = null
            return
        }

        onEvent(FLASH_STATE_TYPE.LOADING_BUILD)
        build = manifest.builds.find((b) => b.chipFamily === chipFamily)

        if (!build) {
            onEvent(FLASH_STATE_TYPE.LOADING_BUILD_FAILED)
            console.log('well we need to add a cool error here')
            await this.restartTransport(transport)
            await transport.disconnect()
            return
        }
        onEvent(FLASH_STATE_TYPE.LOADING_BUILD_SUCCEED)
        onEvent(FLASH_STATE_TYPE.DOWNLOADING_FIRMWARE)

        const manifestURL = new URL(this.manifestPath, location.toString()).toString()
        const filePromises = build.parts.map(async (part) => {
            const url = new URL(part.path, manifestURL).toString()
            const resp = await fetch(url)
            if (!resp.ok) {
                throw new Error(`Downlading firmware ${part.path} failed: ${resp.status}`)
            }

            const reader = new FileReader()
            const blob = await resp.blob()

            return new Promise<string>((resolve) => {
                reader.addEventListener('load', () => resolve(reader.result as string))
                //TODO: check this later readAsBinaryString
                reader.readAsArrayBuffer(blob)
            })
        })

        const fileArray: Array<{ data: string; address: number }> = []
        let totalSize = 0

        for (let part = 0; part < filePromises.length; part++) {
            try {
                const data = await filePromises[part]
                fileArray.push({ data, address: build.parts[part].offset })
                totalSize += data.length
            } catch (error: unknown) {
                if (error instanceof Error) {
                    this.manageError(error)
                }
                await this.restartTransport(transport)
                await transport.disconnect()
                return
            }
        }

        let totalWritten = 0

        try {
            await espLoader.writeFlash({
                fileArray,
                flashSize: 'keep',
                flashMode: 'keep',
                flashFreq: 'keep',
                eraseAll: false,
                compress: true,

                reportProgress: (fileIndex: number, written: number, total: number) => {
                    const uncompressedWritten = (written / total) * fileArray[fileIndex].data.length

                    const newPct = Math.floor(
                        ((totalWritten + uncompressedWritten) / totalSize) * 100,
                    )

                    if (written === total) {
                        totalWritten += uncompressedWritten
                        return
                    }

                    console.log({
                        message: `Writing progress: ${newPct}%`,
                        bytesTotal: totalSize,
                        bytesWritten: totalWritten + written,
                        percentage: newPct,
                    })
                },
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.manageError(error)
            }
            await this.restartTransport(transport)
            await transport.disconnect()
            return
        }

        console.log('flash success')

        await sleep(100)

        await this.restartTransport(transport)
        await transport.disconnect()

        console.log('all done!!!')
    }
}
