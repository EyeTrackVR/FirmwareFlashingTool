import { CHANNEL_TYPE, REST_STATUS } from '@interfaces/firmware/enums'
import { createStore, produce } from 'solid-js/store'
import { debug } from 'tauri-plugin-log-api'

export interface IRest {
    status: REST_STATUS
    device: string
    response: object
}

export interface IGHResponse {
    url: string
    status: number
    name?: string
    ok: boolean
    headers: Record<string, string>
    rawHeaders: Record<string, string[]>
    assets: IAsset[]
}

export interface IAuthor {
    avatar_url: string
    events_url: string
    followers_url: string
    following_url: string
    gists_url: string
    gravatar_id: string
    html_url: string
    id: number
    login: string
    node_id: string
    organizations_url: string
    received_events_url: string
    repos_url: string
    site_admin: boolean
    starred_url: string
    subscriptions_url: string
    type: string
    url: string
    user_view_type: string
}

export interface IAsset {
    browser_download_url: string
    content_type: string
    created_at: string
    digest: string
    download_count: number
    id: number
    label: string
    name: string
    node_id: string
    size: number
    state: string
    updated_at: string
    uploader: IAuthor
    url: string
}

export interface IGHAsset {
    name: string
    browser_download_url: string
}

export interface IGHRest {
    status: REST_STATUS
    assets: IGHAsset[]
    version: string
}

export interface IFirmwareStore {
    loader: boolean
    restAPI: IRest
    ghAPI: IGHRest
    firmwareType: string
    activeBoard: string
    trackerName: string
    channelMode: CHANNEL_TYPE
    manifestPath: string
}

const defaultState: IFirmwareStore = {
    activeBoard: '',
    channelMode: CHANNEL_TYPE.OFFICIAL,
    restAPI: {
        status: REST_STATUS.COMPLETE,
        device: '',
        response: {},
    },
    ghAPI: {
        status: REST_STATUS.COMPLETE,
        assets: [],
        version: '',
    },
    firmwareType: '',
    trackerName: '',
    loader: false,

    manifestPath: '',
}

const [state, setState] = createStore<IFirmwareStore>(defaultState)

export const setTrackerName = (trackerName: string) => {
    setState(
        produce((s) => {
            s.trackerName = trackerName
        }),
    )
}

export const setGHRestStatus = (status: REST_STATUS) => {
    setState(
        produce((s) => {
            s.ghAPI.status = status
        }),
    )
}

export const setChannelMode = (channel: CHANNEL_TYPE) => {
    setState(
        produce((s) => {
            s.channelMode = channel
        }),
    )
}

export const clearGHApiState = () => {
    setState(
        produce((s) => {
            s.ghAPI.assets = []
            s.ghAPI.assets = []
            s.ghAPI.version = ''
            s.activeBoard = ''
        }),
    )
}

export const setFirmwareAssets = (assets: IGHAsset) => {
    setState(
        produce((s) => {
            s.ghAPI.assets.push(assets)
        }),
    )
}
export const setFirmwareVersion = (version: string) => {
    setState(
        produce((s) => {
            s.ghAPI.version = version
        }),
    )
}

export const setFirmwareType = (type: string) => {
    setState(
        produce((s) => {
            s.firmwareType = type
        }),
    )
}
export const setActiveBoard = (activeBoard: string) => {
    setState(
        produce((s) => {
            s.activeBoard = activeBoard
        }),
    )
}

export const saveManifestPath = (url: string) => {
    setState(
        produce((s) => {
            s.manifestPath = url
        }),
    )
}

export const setRESTStatus = (status: REST_STATUS) => {
    setState(
        produce((s) => {
            s.restAPI.status = status
        }),
    )
}

export const confirmFirmwareSelection = (board: string) => {
    setActiveBoard(board)
    const temp = state.ghAPI.assets.find((item) => item.name === board)?.name
    const msg = temp ? temp : 'Not Selected'
    debug(`[Firmware]: ${msg}`)
    setFirmwareType(msg)
}

export const firmwareState = () => state
