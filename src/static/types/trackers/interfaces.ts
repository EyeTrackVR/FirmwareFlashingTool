import { TRACKER_POSITION } from './enums'

export interface ITracker {
    trackerPosition: TRACKER_POSITION
    algorithmOrder: string[]
    streamSource: string
    enabled: boolean
    address: string
    label: string
    id: string
}
