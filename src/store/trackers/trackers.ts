import { ITracker } from '@interfaces/trackers/interfaces'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface ITrackerState {
    trackers: ITracker[]
}

const defaultState: ITrackerState = {
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

export const trackersState = createMemo(() => state)
