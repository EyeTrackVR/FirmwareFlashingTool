import { type IDropdownList } from '@interfaces/firmware/interfaces'
import { type DeviceMode } from '@src/esp/interfaces/types'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface IEspStore {
    ports: IDropdownList[]
    deviceMode: DeviceMode
    activePort: string
}

const defaultState: IEspStore = {
    deviceMode: 'uvc',
    activePort: '',
    ports: [],
}

const [state, setState] = createStore<IEspStore>(defaultState)

export const setDeviceMode = (deviceMode: DeviceMode) => {
    setState(
        produce((s) => {
            s.deviceMode = deviceMode
        }),
    )
}

export const setPorts = (ports: IDropdownList[]) => {
    setState(
        produce((s) => {
            s.ports = ports
        }),
    )
}

export const setActivePort = (port: string) => {
    setState(
        produce((s) => {
            s.activePort = port
        }),
    )
}

export const espState = createMemo(() => state)
