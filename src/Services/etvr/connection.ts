import { EyeTrackVrController } from './controller'

let _client: EyeTrackVrController | undefined = undefined

export const getEyeTrackVrController = (): EyeTrackVrController => {
    if (_client) return _client
    const client = new EyeTrackVrController()

    _client = client
    return _client
}
