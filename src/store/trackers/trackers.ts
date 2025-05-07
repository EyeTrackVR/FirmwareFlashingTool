import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface ITrackerState {
    rotation: Record<TRACKER_POSITION, number>
    trackers: ITracker[]
}

export const defaultRotation: Record<TRACKER_POSITION, number> = {
    [TRACKER_POSITION.RIGHT_EYE]: 0,
    [TRACKER_POSITION.LEFT_EYE]: 0,
}

const defaultState: ITrackerState = {
    rotation: defaultRotation,
    trackers: [],
}

const [state, setState] = createStore<ITrackerState>(defaultState)

export const setTrackers = (trackers: ITracker[]) => {
    setState(
        produce((s) => {
            s.trackers = trackers
        }),
    )
}

export const setLoadRotation = (rotation: Record<TRACKER_POSITION, number>) => {
    setState(
        produce((s) => {
            s.rotation = rotation
        }),
    )
}

export const setRotation = (tracker: TRACKER_POSITION, value: number) => {
    setState(
        produce((s) => {
            s.rotation[tracker] = value
        }),
    )
}

export const trackersState = createMemo(() => state)
