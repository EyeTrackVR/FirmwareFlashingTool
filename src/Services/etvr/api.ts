import {
    IETVRConfig,
    IETVRConfigResponse,
    IFeedResponse,
    ITracker,
} from '@interfaces/services/interfaces'
import { Body, HttpVerb, ResponseType } from '@tauri-apps/api/http'
import { initializeHttpClient } from '../httpClient'
export class EyeTrackVrBackend {
    private readonly url = 'http://127.0.0.1:8855'

    resolveHttpClient() {
        return initializeHttpClient()
    }

    async fetchJson<R, T = undefined>(url: string, method: HttpVerb, init?: T): Promise<R> {
        const client = await this.resolveHttpClient()
        let body: Body | undefined

        if (init) {
            body = Body.json(init)
        }

        const response = await client.request<R>({
            headers: { 'Content-Type': 'application/json' },
            responseType: ResponseType.JSON,
            method,
            body,
            url,
        })

        if (!response.ok) {
            throw new Error(response.status.toString())
        }

        return response.data
    }

    // streaming
    getRawCameraFeed(uuid: string): Promise<IFeedResponse | null> {
        return this.fetchJson<IFeedResponse | null>(`${this.url}/etvr/feed/${uuid}/camera`, 'GET')
    }

    getAlgorithmFeed(uuid: string): Promise<IFeedResponse | null> {
        return this.fetchJson<IFeedResponse | null>(
            `${this.url}/etvr/feed/${uuid}/algorithm`,
            'GET',
        )
    }

    //default
    startETVR(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/start`, 'GET')
    }

    stopETVR(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/stop`, 'GET')
    }

    shutdownETVR(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/shutdown`, 'GET')
    }

    restartETVR(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/restart`, 'GET')
    }

    serverStatus(): Promise<boolean> {
        return this.fetchJson<boolean>(`${this.url}/etvr/status`, 'GET')
    }

    // config
    updateConfig(config?: IETVRConfig): Promise<IETVRConfigResponse | null> {
        return this.fetchJson<IETVRConfigResponse | null, IETVRConfig>(
            `${this.url}/etvr/config`,
            'POST',
            config,
        )
    }

    getConfig(): Promise<IETVRConfigResponse> {
        return this.fetchJson<IETVRConfigResponse>(`${this.url}/etvr/config`, 'GET')
    }

    saveConfig(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/config/save`, 'GET')
    }

    loadConfig(): Promise<IETVRConfigResponse> {
        return this.fetchJson<IETVRConfigResponse>(`${this.url}/etvr/config/load`, 'GET')
    }

    resetConfig(): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/config/reset`, 'GET')
    }

    // tracker config
    restartTracker(uuid: string): Promise<null> {
        return this.fetchJson<null>(`${this.url}/etvr/config/tracker/reset?uuid=${uuid}`, 'GET')
    }

    getTrackersConfig(): Promise<ITracker[]> {
        return this.fetchJson<ITracker[]>(`${this.url}/etvr/config/trackers`, 'GET')
    }

    getTrackerConfig(uuid: string): Promise<ITracker> {
        return this.fetchJson<ITracker>(`${this.url}/etvr/config/tracker?uuid=${uuid}`, 'GET')
    }

    createNewTracker(config: ITracker): Promise<ITracker> {
        return this.fetchJson<ITracker, ITracker>(`${this.url}/etvr/config/tracker`, 'PUT', config)
    }

    updateTracker(address: string, payload: unknown): Promise<unknown> {
        return this.fetchJson<unknown, unknown>(
            `${this.url}/etvr/config/tracker?uuid=${address}`,
            'POST',
            payload,
        )
    }

    deleteTracker(uuid: string) {
        return this.fetchJson<ITracker, ITracker>(
            `${this.url}/etvr/config/tracker?uuid=${uuid}`,
            'DELETE',
        )
    }
}

export default EyeTrackVrBackend
