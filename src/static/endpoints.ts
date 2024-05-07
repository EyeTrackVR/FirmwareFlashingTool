import { CHANNEL_TYPE } from '@interfaces/enums'

export const GHEndpoints: Record<CHANNEL_TYPE, string> = {
    [CHANNEL_TYPE.OFFICIAL]: 'https://api.github.com/repos/EyeTrackVR/OpenIris/releases/latest',
    [CHANNEL_TYPE.BETA]: 'https://api.github.com/repos/EyeTrackVR/OpenIris/releases',
}
