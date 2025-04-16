export interface IETVRConfig {
    mode?: 'json' | 'python'
    include?: string[] | number[] | object
    exclude?: string[] | number[] | object
    by_alias?: boolean
    exclude_unset?: boolean
    exclude_defaults?: boolean
    exclude_none?: boolean
    round_trip?: boolean
    warnings?: boolean
}

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

interface IOSCSettings {
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

interface IAlgorithm {
    algorithm_order: string[]
    blob: {
        threshold: number
        minsize: number
        maxsize: number
    }
    leap: {
        blink_threshold: number
    }
    hsf: {
        skip_autoradius: boolean
        skip_blink_detection: boolean
        blink_stat_frames: number
        default_step: Array<number>
    }
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

export interface ITracker {
    enabled: boolean
    name: string
    uuid: string
    tracker_position: string
    algorithm: IAlgorithm
    camera: ICameraSettings
}

export interface IETVRConfigResponse {
    version: number
    debug: boolean
    affinity_mask: string
    osc: IOSCSettings
    trackers: ITracker[]
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
