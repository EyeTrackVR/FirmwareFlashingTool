import { TRACKER_POSITION } from './enums'

export interface ITracker {
    trackerPosition: TRACKER_POSITION
    streamSource: string
    address: string
    label: string
    id: string
}
