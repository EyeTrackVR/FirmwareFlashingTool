import { INetwork } from '@src/esp/interfaces/interfaces'
import { createStore, produce } from 'solid-js/store'

export interface INetworkStore {
    availableNetworks: INetwork[]
    selectedNetwork: INetwork | undefined
    password: string
    mac: string
    mdns: string
    ssid: string
}

const defaultState: INetworkStore = {
    availableNetworks: [],
    selectedNetwork: undefined,
    mac: '',
    password: '',
    mdns: '',
    ssid: '',
}

const [state, setState] = createStore<INetworkStore>(defaultState)

export const setAvailableNetworks = (networks: INetwork[]) => {
    setState(
        produce((s) => {
            s.availableNetworks = networks
        }),
    )
}

export const setSelectedNetwork = (network: INetwork | undefined) => {
    setState(
        produce((s) => {
            s.selectedNetwork = network
        }),
    )
}

export const setMac = (mac: string) => {
    setState(
        produce((s) => {
            s.mac = mac
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

export const setResetNetworkState = () => {
    setState(
        produce((s) => {
            s.password = ''
            s.mdns = ''
        }),
    )
}

export const networkState = () => state
