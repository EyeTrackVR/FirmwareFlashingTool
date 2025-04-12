import { TRACKER_POSITION } from './enums'

export interface IBoard {
    TrackerPosition: TRACKER_POSITION
    address: string
    label: string
    id: string
}
