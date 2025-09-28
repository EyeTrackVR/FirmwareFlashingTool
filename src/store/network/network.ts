import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface INetwork {
    ssid: string
    channel: number
    rssi: string
    mac_address: string
    auth_mode: string
}

export interface INetworkStore {
    availableNetworks: INetwork[]
    selectedNetwork: INetwork | undefined
    password: string
    mdns: string
    ssid: string
}

const defaultState: INetworkStore = {
    availableNetworks: [],
    selectedNetwork: undefined,
    password: '',
    mdns: '',
    ssid: '',
}

const [state, setState] = createStore<INetworkStore>(defaultState)

export const setAvailableNetworks = (networks: any[]) => {
    setState(
        produce((s) => {
            s.availableNetworks = networks
        }),
    )
}

export const setSelectedNetwork = (network: INetwork) => {
    setState(
        produce((s) => {
            s.selectedNetwork = network
        }),
    )
}

export const setPassword = (password: string) => {
    setState(
        produce((s) => {
            s.password = password
        }),
    )
}

export const setMdns = (mdns: string) => {
    setState(
        produce((s) => {
            s.mdns = mdns
        }),
    )
}

export const setSsid = (ssid: string) => {
    setState(
        produce((s) => {
            s.ssid = ssid
        }),
    )
}

export const networkState = createMemo(() => state)
