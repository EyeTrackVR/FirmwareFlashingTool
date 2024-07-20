import { ESPLoader, Transport } from 'esptool-js'
import { Transform } from './utils'
import { Build, type INavigator, type INavigatorPort, type Manifest } from '@interfaces/interfaces'
import { DEVICE_LOST } from '@src/static'
import { sleep } from '@src/utils'

export class WebManager {
    private flashFiles: Array<{ data: string; address: number }> | null = null
    private boardRestarted = false
    private port: INavigatorPort | null = null
    private espLoader: ESPLoader | null = null
    private transport: Transport | null = null
    private manifest: Manifest | null = null
    readonly romBaudRate: number = 115200
    readonly baudRate: number = 115200
    private build: Build | null = null
    private totalSize: number = 0

    isActivePort(): boolean {
        return this.port !== null
    }

    async reset(): Promise<void> {
        await this.closePort()
        this.port = null
    }

    async disconnectTransport(): Promise<void> {
        if (!this.transport) return
        try {
            await this.transport.disconnect()
        } catch {
            // transport can be already closed
        }
    }

    async connect(): Promise<void> {
        const requestPort = await (navigator as INavigator).serial.requestPort()
        if (!requestPort) {
            throw new Error(
                'Failed to execute requestPort on Serial: No port selected by the user.',
            )
        }
        this.port = requestPort
    }

    async closePort(): Promise<void> {
        try {
            if (!this.port) return
            await this.port.close()
        } catch (err) {
            //can be already closed
        }
    }
    async openPort(): Promise<void> {
        if (!this.port) return
        await this.port.open({ baudRate: this.baudRate })
    }

    setBoardRestarted(value: boolean) {
        this.boardRestarted = value
    }

    async restartBoard(): Promise<void> {
        if (this.port === null) return

        await this.port.setSignals({ dataTerminalReady: false, requestToSend: true })
        await sleep(250)

        await this.port.setSignals({ dataTerminalReady: false, requestToSend: false })
        await sleep(250)
    }

    async checkBoardConnection(): Promise<void> {
        try {
            await this.openPort()
        } catch {
            //
        }
        await this.restartBoard()
    }

    async restartTransport(): Promise<void> {
        if (!this.transport) return

        await this.transport.device.setSignals({ dataTerminalReady: false, requestToSend: true })
        await sleep(250)

        await this.transport.device.setSignals({ dataTerminalReady: false, requestToSend: false })
        await sleep(250)
    }

    async initializeResetESPState() {
        try {
            await this.restartBoard()
        } catch {
            //
        }
        await Promise.all([this.closePort(), this.disconnectTransport()])
    }

    async initializeESPConnection(): Promise<void> {
        await this.initializeResetESPState()
        try {
            const transport = new Transport(this.port)
            const espLoader = new ESPLoader({
                transport,
                baudrate: this.baudRate,
                romBaudrate: this.romBaudRate,
                enableTracing: true,
            })

            const promise1 = new Promise((resolve, reject) => {
                // eslint-disable-next-line
                ;(async () => {
                    try {
                        await espLoader.main()
                        await espLoader.flashId()
                        resolve('')
                    } catch (err) {
                        reject(err)
                    }
                })()
            })

            const promise2 = new Promise((_, reject) => {
                setTimeout(reject, 60000, DEVICE_LOST)
            })
            await Promise.race([promise1, promise2])
            this.espLoader = espLoader
            this.transport = transport
        } catch {
            await this.restartTransport()
            await this.transport?.disconnect()
            throw new Error(
                'Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.',
            )
        }
    }

    async checkChipFamily(): Promise<void> {
        if (!this.espLoader) {
            throw new Error('esp loader was not initialized')
        }

        if (!this.espLoader.chip.ROM_TEXT) {
            await this.restartTransport()
            await this.transport?.disconnect()
            throw new Error(`Chip ${this.espLoader.chip.CHIP_NAME} is not supported`)
        }
    }

    async downloadManifest(manifestPath: string) {
        const manifestURL = new URL(manifestPath, location.toString()).toString()
        const resp = await fetch(manifestURL)
        const manifest: Manifest = await resp.json()
        this.manifest = manifest
    }

    async validateManifestBuild() {
        if (!this.manifest) throw new Error('Manifest was not initialized')

        const chipFamily = this.espLoader
        if (!chipFamily) throw new Error('esp loader was not initialized')

        const build = this.manifest.builds.find((b) => b.chipFamily === chipFamily.chip.CHIP_NAME)
        if (!build) {
            throw new Error(
                `${chipFamily.chip.CHIP_NAME} is not supported, please contact us on Discord.`,
            )
        }

        this.build = build
    }

    async downloadFiles(manifestPath: string) {
        if (!this.transport) throw new Error('Transport was not initialized')
        if (!this.build) throw new Error('Build was not initialized')

        const manifestURL = new URL(manifestPath, location.toString()).toString()
        const filePromises = this.build.parts.map((part) =>
            this.downloadFile(part.path, manifestURL),
        )

        try {
            const files = await Promise.all(filePromises)
            this.totalSize = files.reduce((sum, file) => sum + file.data.length, 0)
            this.flashFiles = files
        } catch (err: unknown) {
            await this.handleError(err)
        }
    }

    private async downloadFile(
        path: string,
        baseURL: string,
    ): Promise<{ data: string; address: number }> {
        const url = new URL(path, baseURL).toString()
        const resp = await fetch(url)

        if (!resp.ok) {
            throw new Error(`Downloading firmware ${path} failed: ${resp.status}`)
        }

        const blob = await resp.blob()
        const data = await this.readBlobAsBinaryString(blob)
        const address = this.build?.parts.find((part) => part.path === path)?.offset ?? 0

        return { data, address }
    }

    private readBlobAsBinaryString(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Failed to read blob as binary string'))
            reader.readAsBinaryString(blob)
        })
    }

    private async handleError(err: unknown): Promise<void> {
        await this.restartTransport()
        await this.disconnectTransport()

        if (err instanceof Error) {
            throw new Error(err.message)
        }
    }

    async flashFirmware(callback: (precentageProgress: number) => void) {
        if (!this.manifest) throw new Error('Manifest was not initialized')
        if (!this.espLoader) throw new Error('esp loader was not initialized')
        if (!this.transport) throw new Error('Transport was not initialized')
        if (!this.flashFiles) throw new Error('Missing flash files')

        const fileArray = this.flashFiles

        const totalWritten = 0
        const size = this.totalSize

        try {
            await this.espLoader.writeFlash({
                fileArray,
                flashSize: 'keep',
                flashMode: 'keep',
                flashFreq: 'keep',
                eraseAll: false,
                compress: true,
                reportProgress(fileIndex, written, total) {
                    const uncompressedWritten = (written / total) * fileArray[fileIndex].data.length
                    const precentageProgress = Math.floor(
                        ((totalWritten + uncompressedWritten) / size) * 100,
                    )
                    callback(precentageProgress)
                },
            })
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(`Flash failed: ${err.message}`)
            }
            await this.restartTransport()
            await this.disconnectTransport()
        }
    }

    async configureWifiConnection(wifiConfigFiles: string) {
        const writableStream = (
            this.port as unknown as { writable: WritableStream }
        ).writable.getWriter()
        await writableStream.write(new TextEncoder().encode(wifiConfigFiles))

        try {
            writableStream.releaseLock()
        } catch {
            // we can ignore this error
        }
    }

    async getLogs(
        callback: (logs: string) => void,
        errorCallback: (err: Error, hasOpenirisInstallation?: boolean) => void,
        signal?: AbortSignal,
    ) {
        const port = this.port
        if (!port) {
            throw new Error('port is not initialized')
        }

        if (!this.boardRestarted) {
            try {
                await this.restartBoard()
            } catch (err) {
                if (err instanceof Error) {
                    errorCallback(err)
                }
                return
            }
        }

        port.readable!.pipeThrough(new TextDecoderStream(), { signal })
            .pipeThrough(new TransformStream(new Transform()))
            .pipeTo(
                new WritableStream({
                    write: (chunk) => {
                        callback(chunk.replace('\r\n', ''))
                    },
                }),
            )
            .catch(async (err) => {
                if (err !== 'openiris' && err !== 'logs') {
                    errorCallback(err, false)
                }
                if (err.message === DEVICE_LOST) {
                    await this.closePort()
                    this.port = null
                    if (err instanceof Error) {
                        errorCallback(err)
                    }
                }
            })
    }
}
