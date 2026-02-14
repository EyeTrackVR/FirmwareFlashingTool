import { EspApiClientProvider } from './espCore'

let _api: EspApiClientProvider | undefined

export const getApi = (): EspApiClientProvider => {
    _api = new EspApiClientProvider()
    return _api
}
