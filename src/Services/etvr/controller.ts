import { CONNECTION_STATUS, TRACKER_NAME } from '@interfaces/services/enums'
import { EyeTrackVrBackend } from './api'
import { TRACKER_POSITION } from '@interfaces/boards/enums'

export class EyeTrackVrController {
    private readonly api: EyeTrackVrBackend

    constructor() {
        this.api = new EyeTrackVrBackend()
    }

    public async stopServer(): Promise<null> {
        return this.api.stopETVR()
    }

    public async startServer(): Promise<null> {
        return this.api.startETVR()
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

    public getTrackerPosition(position: TRACKER_POSITION): TRACKER_NAME {
        switch (position) {
            case TRACKER_POSITION.LEFT_TRACKER: {
                return TRACKER_NAME.LEFT_EYE
            }
            case TRACKER_POSITION.RIGHT_TRACKER: {
                return TRACKER_NAME.RIGHT_EYE
            }
            default: {
                throw new Error(`unsupported tracker position ${position}`)
            }
        }
    }
}
