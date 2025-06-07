import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import {
    IUpdateTracker,
    type IETVRConfigResponse,
    type ITrackerState,
} from '@interfaces/services/interfaces'
import { EyeTrackVrBackend } from './api'
import { sleep } from '@src/utils'
import { ITracker } from '@interfaces/trackers/interfaces'

export class EyeTrackVrController {
    private readonly api: EyeTrackVrBackend
    trackers: Partial<Record<TRACKER_POSITION, ITrackerState | undefined>> = {}
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
    ): Promise<ITrackerState | undefined> {
        try {
            const config = await this.getConfig()
            return config.trackers.find((tracker) => {
                return tracker.tracker_position === trackerPosition
            })
        } catch {
            return undefined
        }
    }

    public async updateTrackersConfig() {
        try {
            const config = await this.getConfig()
            const trackers = config.trackers
            for (const tracker of trackers) {
                this.trackers[tracker.tracker_position] = tracker
            }
        } catch {
            console.log('failed to update trackers config')
        }
    }

    public async createTracker(trackerPosition: TRACKER_POSITION): Promise<ITrackerState> {
        const tracker = await this.api.createNewTracker({
            tracker_position: trackerPosition,
        })
        return tracker
    }

    public async saveConfig() {
        await this.api.saveConfig()
        await this.updateConfig()
    }

    public async getTracker(trackerPosition: TRACKER_POSITION): Promise<ITrackerState> {
        if (!this.trackers[trackerPosition]) {
            let config = await this.getTrackerConfig(trackerPosition)

            if (!config) {
                config = await this.createTracker(trackerPosition)
            }

            this.trackers[trackerPosition] = config
        }

        return this.trackers[trackerPosition]
    }

    async updateTracker(uuid: string, payload: Partial<IUpdateTracker>) {
        return this.api.updateTracker(uuid, payload)
    }

    public async updateTrackerCameraConfigurations(data: ITracker[]): Promise<string[]> {
        await this.updateTrackersConfig()
        try {
            const [status, trackers] = await Promise.all([
                this.getServerStatus(),
                Promise.all(data.map((tracker) => this.getTracker(tracker.trackerPosition))),
            ])

            const hasToUpdate = data.some((element) => {
                const matchingTracker = trackers.find(
                    (tracker) => tracker.tracker_position === element.trackerPosition,
                )

                if (!matchingTracker) return true
                return matchingTracker.camera.capture_source !== element.address
            })

            if (hasToUpdate && status === CONNECTION_STATUS.CONNECTED) {
                await this.stopServer()
            }
        } catch {
            console.log('failed to determine if server needs to be stopped')
            await this.stopServer()
        }

        const updatePromises = data.map(async (tracker) => {
            try {
                const trackerState = await this.getTracker(tracker.trackerPosition)
                const config: Partial<IUpdateTracker> = { name: tracker.label }
                if (tracker.address !== trackerState.camera.capture_source) {
                    config.camera = { capture_source: tracker.address }
                }

                await this.api.updateTracker(trackerState.uuid, config)
            } catch (error) {
                return `failed to update tracker ${tracker.address}`
            }
        })

        const update = await Promise.all(updatePromises)
        await this.saveConfig()
        await this.updateTrackersConfig()

        return update.filter((status) => typeof status !== 'undefined')
    }

    public async getTrackersStream(tracker: ITracker[]): Promise<Record<TRACKER_POSITION, string>> {
        const streams: Record<TRACKER_POSITION, string> = {
            [TRACKER_POSITION.RIGHT_EYE]: '',
            [TRACKER_POSITION.LEFT_EYE]: '',
        }

        const streamPromises = tracker.map(async (tracker) => {
            const trackerConf = await this.getTrackerConfig(tracker.trackerPosition)
            if (trackerConf) {
                streams[tracker.trackerPosition] =
                    `${this.api.url}/etvr/feed/${trackerConf?.uuid}/camera`
            }

            return streams[tracker.trackerPosition]
        })

        try {
            await Promise.all(streamPromises)
            return streams
        } catch {
            return streams
        }
    }

    public async getState(): Promise<{
        rotation: Record<TRACKER_POSITION, number>
        trackers: ITracker[]
    }> {
        const trackers: ITracker[] = []
        const rotation = {
            [TRACKER_POSITION.LEFT_EYE]: 0,
            [TRACKER_POSITION.RIGHT_EYE]: 0,
        }

        try {
            const config = await this.getConfig()

            config.trackers.forEach((tracker) => {
                rotation[tracker.tracker_position as TRACKER_POSITION] = tracker.camera.rotation
                trackers.push({
                    trackerPosition: tracker.tracker_position as TRACKER_POSITION,
                    streamSource: `${this.api.url}/etvr/feed/${tracker.uuid}/camera`,
                    algorithmOrder: tracker.algorithm.algorithm_order,
                    address: tracker.camera.capture_source,
                    enabled: tracker.enabled,
                    label: tracker.name,
                    id: tracker.uuid,
                })
            })
        } catch {}

        return {
            trackers,
            rotation,
        }
    }
}
