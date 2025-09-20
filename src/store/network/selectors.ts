import { createStoreSelectors } from '@store/utils'
import { networkState } from './network'

export const { availableNetworks, password, mdns, ssid, selectedNetwork } =
    createStoreSelectors(networkState)
