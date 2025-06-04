import { STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { DEFAULT_CANVAS_BOX_POSITION, type IBoxPosition } from '@src/Services/canvas'
import { ALGORITHMS } from '@src/static'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface ITrackerState {
    rotation: Record<TRACKER_POSITION, number>
    trackers: ITracker[]
    algorithmOrder: Record<TRACKER_POSITION, string[]>
    flipAxis: Record<STREAM_TOGGLE_FLIP, boolean>
    canvasBoxPositions: Record<TRACKER_POSITION, IBoxPosition>
}

export const defaultRotation: Record<TRACKER_POSITION, number> = {
    [TRACKER_POSITION.RIGHT_EYE]: 0,
    [TRACKER_POSITION.LEFT_EYE]: 0,
}

export const defaultAlgorithmOrder: Record<TRACKER_POSITION, string[]> = {
    [TRACKER_POSITION.LEFT_EYE]: ALGORITHMS,
    [TRACKER_POSITION.RIGHT_EYE]: ALGORITHMS,
}

export const defaultFlipAxis = {
    [STREAM_TOGGLE_FLIP.FLIP_X_AXIS]: false,
    [STREAM_TOGGLE_FLIP.FLIP_Y_AXIS]: false,
}

export const defaultCanvasBoxPositions: Record<TRACKER_POSITION, IBoxPosition> = {
    [TRACKER_POSITION.LEFT_EYE]: DEFAULT_CANVAS_BOX_POSITION,
    [TRACKER_POSITION.RIGHT_EYE]: DEFAULT_CANVAS_BOX_POSITION,
}

const defaultState: ITrackerState = {
    canvasBoxPositions: defaultCanvasBoxPositions,
    algorithmOrder: defaultAlgorithmOrder,
    rotation: defaultRotation,
    flipAxis: defaultFlipAxis,
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

export const setCanvasBoxPositions = (positions: IBoxPosition, tracker: TRACKER_POSITION) => {
    setState(
        produce((s) => {
            s.canvasBoxPositions[tracker] = positions
        }),
    )
}

export const setAlgorithmOrder = (order: Record<TRACKER_POSITION, string[]>) => {
    setState(
        produce((s) => {
            s.algorithmOrder = order
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

export const setFlipToggle = (action: STREAM_TOGGLE_FLIP) => {
    setState(
        produce((s) => {
            s.flipAxis[action] = !s.flipAxis[action]
        }),
    )
}

export const trackersState = createMemo(() => state)
