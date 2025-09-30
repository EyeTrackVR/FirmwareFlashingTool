import { CHANNEL_TYPE, RESTStatus } from '@interfaces/enums'
import { createStore, produce } from 'solid-js/store'
import { debug } from 'tauri-plugin-log-api'
import { createMemo } from 'solid-js'

export interface IRest {
    status: RESTStatus
    device: string
    response: object
}

export interface IGHResponse {
    url: string
    status: number
    ok: boolean
    headers: Record<string, string>
    rawHeaders: Record<string, string[]>
    data: IGHRelease
}

export interface IGHRelease {
    data: object
    headers: object
    rawHeaders: object
    ok: boolean
    status: number
    url: string
    prerelease?: boolean
}

export interface IGHAsset {
    name: string
    browser_download_url: string
}

export interface IGHRest {
    status: RESTStatus
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
        status: RESTStatus.COMPLETE,
        device: '',
        response: {},
    },
    ghAPI: {
        status: RESTStatus.COMPLETE,
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

export const setGHRestStatus = (status: RESTStatus) => {
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

export const setRESTStatus = (status: RESTStatus) => {
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

export const firmwareState = createMemo(() => state)
