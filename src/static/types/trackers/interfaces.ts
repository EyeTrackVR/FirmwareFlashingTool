import { TRACKER_POSITION } from './enums'

export interface ITracker {
    trackerPosition: TRACKER_POSITION
    address: string
    label: string
    id: string
}
