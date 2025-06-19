import { STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import {
    type IETVRConfigResponse,
    type IOSCEndpointsConfig,
    type IOSCSettings,
} from '@interfaces/services/interfaces'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { type ITracker } from '@interfaces/trackers/interfaces'
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
    config: IETVRConfigResponse
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

export const defaultEndpoints: IOSCEndpointsConfig = {
    eyes_y: '',
    left_eye_x: '',
    right_eye_x: '',
    recenter: '',
    sync_blink: '',
    recalibrate: '',
    left_eye_blink: '',
    right_eye_blink: '',
}

export const defaultOsc: IOSCSettings = {
    address: '',
    mirror_eyes: false,
    sync_blink: false,
    enable_sending: false,
    sending_port: 0,
    enable_receiving: false,
    receiver_port: 0,
    vrchat_native_tracking: false,
    endpoints: defaultEndpoints,
}

export const DefaultConfig = {
    version: 0,
    debug: false,
    affinity_mask: '',
    osc: defaultOsc,
    trackers: [],
}

const defaultState: ITrackerState = {
    canvasBoxPositions: defaultCanvasBoxPositions,
    algorithmOrder: defaultAlgorithmOrder,
    rotation: defaultRotation,
    flipAxis: defaultFlipAxis,
    trackers: [],
    config: DefaultConfig,
}

const [state, setState] = createStore<ITrackerState>(defaultState)

export const setTrackers = (trackers: ITracker[]) => {
    setState(
        produce((s) => {
            s.trackers = trackers
        }),
    )
}

export const setConfig = (config: IETVRConfigResponse) => {
    setState(
        produce((s) => {
            s.config = config
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
