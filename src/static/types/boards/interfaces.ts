import { TRACKER_POSITION } from './enums'

export interface IBoard {
    trackerPosition: TRACKER_POSITION
    address: string
    label: string
    id: string
}
