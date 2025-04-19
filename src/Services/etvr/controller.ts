import { TRACKER_POSITION } from '@interfaces/boards/enums'
import { IBoard } from '@interfaces/boards/interfaces'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import {
    IUpdateTracker,
    type IETVRConfigResponse,
    type ITracker,
} from '@interfaces/services/interfaces'
import { EyeTrackVrBackend } from './api'
import { sleep } from '@src/utils'

export class EyeTrackVrController {
    private readonly api: EyeTrackVrBackend
    trackers: Partial<Record<TRACKER_POSITION, ITracker | undefined>> = {}
    config: IETVRConfigResponse | undefined

    constructor() {
        this.api = new EyeTrackVrBackend()
    }

    public async stopServer(): Promise<null> {
        return this.api.stopETVR()
    }

    public async startServer(): Promise<null> {
        return this.api.startETVR()
    }

    public async restartServer(): Promise<null> {
        return this.api.restartETVR()
    }

    public async getServerStatus(): Promise<CONNECTION_STATUS> {
        try {
            const status = await this.api.serverStatus()
            if (status) {
                return CONNECTION_STATUS.CONNECTED
            }

            return CONNECTION_STATUS.DISCONNECTED
        } catch {
            return CONNECTION_STATUS.DISCONNECTED
        }
    }

    public async establishConnection(): Promise<CONNECTION_STATUS> {
        let tries = 3
        while (tries > 0) {
            try {
                const serverStatus = await this.getServerStatus()

                if (serverStatus === CONNECTION_STATUS.DISCONNECTED) {
                    await this.startServer()
                }
                const status = await this.getServerStatus()
                return status
            } catch {
                if (!tries) {
                    return CONNECTION_STATUS.FAILED
                }
                await sleep(1000)
                tries--
            }
        }
        return CONNECTION_STATUS.FAILED
    }

    public async updateConfig() {
        const config = await this.api.getConfig()
        this.config = config
    }

    public async getConfig(updateConfig = false): Promise<IETVRConfigResponse> {
        if (!this.config || updateConfig) {
            const config = await this.api.getConfig()
            this.config = config
        }

        return this.config
    }

    public async getTrackerConfig(
        trackerPosition: TRACKER_POSITION,
    ): Promise<ITracker | undefined> {
        try {
            const config = await this.getConfig()
            return config.trackers.find((tracker) => {
                return tracker.tracker_position === trackerPosition
            })
        } catch {
            return undefined
        }
    }

    public async createTracker(trackerPosition: TRACKER_POSITION): Promise<ITracker> {
        const tracker = await this.api.createNewTracker({
            tracker_position: trackerPosition,
        })
        return tracker
    }

    public async saveConfig() {
        await this.api.saveConfig()
        await this.updateConfig()
    }

    public async updateTrackerConfig(
        trackerPosition: TRACKER_POSITION,
        config: ITracker,
    ): Promise<ITracker> {
        this.trackers[trackerPosition] = config
        return this.trackers[trackerPosition]
    }

    public async getTracker(trackerPosition: TRACKER_POSITION): Promise<ITracker> {
        if (!this.trackers[trackerPosition]) {
            let config = await this.getTrackerConfig(trackerPosition)

            if (!config) {
                config = await this.createTracker(trackerPosition)
            }

            this.trackers[trackerPosition] = config
        }

        return this.trackers[trackerPosition]
    }

    public async updateBoardCameraConfigurations(boards: IBoard[]): Promise<string[]> {
        try {
            const [status, trackers] = await Promise.all([
                this.getServerStatus(),
                Promise.all(boards.map((board) => this.getTracker(board.trackerPosition))),
            ])

            const hasToUpdate = boards.some((board) => {
                const matchingTracker = trackers.find(
                    (tracker) => tracker.tracker_position === board.trackerPosition,
                )

                if (!matchingTracker) return true
                return matchingTracker.camera.capture_source !== board.address
            })

            console.log(hasToUpdate)
            console.log(boards)
            console.log(trackers)

            if (hasToUpdate && status === CONNECTION_STATUS.CONNECTED) {
                await this.stopServer()
            }
        } catch {
            console.log('failed to determine if server needs to be stopped')
            await this.stopServer()
        }

        const updatePromises = boards.map(async (board) => {
            try {
                const tracker = await this.getTracker(board.trackerPosition)
                const config: Partial<IUpdateTracker> = { name: board.label }

                if (board.address !== tracker.camera.capture_source) {
                    config.camera = { capture_source: board.address }
                }

                await this.api.updateTracker(tracker.uuid, config)
                this.updateTrackerConfig(board.trackerPosition, tracker)
            } catch (error) {
                return `failed to update board ${board.address}`
            }
        })

        const update = await Promise.all(updatePromises)
        await this.saveConfig()

        return update.filter((status) => typeof status !== 'undefined')
    }

    public async getCamerasStream(boards: IBoard[]): Promise<Record<TRACKER_POSITION, string>> {
        const streams: Record<TRACKER_POSITION, string> = {
            [TRACKER_POSITION.RIGHT_EYE]: '',
            [TRACKER_POSITION.LEFT_EYE]: '',
        }

        const streamPromises = boards.map(async (board) => {
            const trackerConf = await this.getTrackerConfig(board.trackerPosition)
            console.log(trackerConf)
            streams[board.trackerPosition] = `${this.api.url}/etvr/feed/${trackerConf?.uuid}/camera`
            return streams[board.trackerPosition]
        })

        try {
            await Promise.all(streamPromises)
            console.log('got streams', streams)
            return streams
        } catch {
            return streams
        }
    }
}
