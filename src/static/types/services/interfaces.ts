export interface IOSCEndpointsConfig {
    eyes_y: string
    left_eye_x: string
    right_eye_x: string
    recenter: string
    sync_blink: string
    recalibrate: string
    left_eye_blink: string
    right_eye_blink: string
}

export interface IOSCSettings {
    address: string
    mirror_eyes: boolean
    sync_blink: boolean
    enable_sending: boolean
    sending_port: number
    enable_receiving: boolean
    receiver_port: number
    vrchat_native_tracking: boolean
    endpoints: IOSCEndpointsConfig
}

export interface IEndpoints extends IOSCEndpointsConfig {
    address: string
    sending_port: number
    receiver_port: number
}

export interface IBlob {
    threshold: number
    minsize: number
    maxsize: number
}

export interface ILeap {
    blink_threshold: number
}

export interface IHsf {
    skip_autoradius: boolean
    skip_blink_detection: boolean
    blink_stat_frames: number
    default_step: Array<number>
}

export interface IAlgorithm {
    algorithm_order: string[]
    blob: IBlob
    leap: ILeap
    hsf: IHsf
}

export interface IPartialAlgorithm {
    algorithm_order: Partial<string[]>
    blob: Partial<IBlob>
    leap: Partial<ILeap>
    hsf: Partial<IHsf>
}

export interface flipAxis {
    flip_x_axis: boolean
    flip_y_axis: boolean
}

interface ICameraSettings {
    capture_source: string
    rotation: number
    threshold: number
    focal_length: number
    flip_x_axis: boolean
    flip_y_axis: boolean
    roi_x: number
    roi_y: number
    roi_w: number
    roi_h: number
}

export interface ITrackerState {
    enabled: boolean
    name: string
    uuid: string
    tracker_position: string
    algorithm: IAlgorithm
    camera: ICameraSettings
}

export interface IUpdateTracker {
    enabled: boolean
    name: string
    uuid: string
    tracker_position: string
    algorithm: Partial<IPartialAlgorithm>
    camera: Partial<ICameraSettings>
}

export interface IETVRConfigResponse {
    version: number
    debug: boolean
    affinity_mask: string
    osc: IOSCSettings
    trackers: ITrackerState[]
}

export interface IUpdateOSCSettings {
    address: string
    mirror_eyes: boolean
    sync_blink: boolean
    enable_sending: boolean
    sending_port: number
    enable_receiving: boolean
    receiver_port: number
    vrchat_native_tracking: boolean
    endpoints: Partial<IOSCEndpointsConfig>
}

export interface IUpdateETVRConfig {
    version: number
    debug: boolean
    affinity_mask: string
    osc: Partial<IUpdateOSCSettings>
    trackers: Partial<IUpdateTracker>[]
}

export interface IFeedResponse {
    detail: [
        {
            loc: [string, number]
            msg: 'string'
            type: 'string'
        },
    ]
}
