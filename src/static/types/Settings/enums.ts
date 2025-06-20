export enum OSC_SETTINGS_ENUM {
    //toggle
    MIRROR_EYES = 'mirror_eyes',
    SYNC_BLINK = 'sync_blink',
    ENABLE_SENDING = 'enable_sending',
    SENDING_PORT = 'sending_port',
    ENABLE_RECEIVING = 'enable_receiving',
    RECEIVER_PORT = 'receiver_port',
    VRCHAT_NATIVE_TRACKING = 'vrchat_native_tracking',

    //input
    ADDRESS = 'address',
    EYES_Y = 'eyes_y',
    LEFT_EYE_X = 'left_eye_x',
    RIGHT_EYE_X = 'right_eye_x',
    RECENTER = 'recenter',
    RECALIBRATE = 'recalibrate',
    LEFT_EYE_BLINK = 'left_eye_blink',
    RIGHT_EYE_BLINK = 'right_eye_blink',
}

export enum TRACKING_ALGORITHM_SETTINGS_ENUM {
    SKIP_AUTO_RADIUS = 'skip_auto_radius',
    SKIP_BLINK_DETECTION = 'skip_blink_detection',
}

export enum ALGORITHM_ORDER_SETTINGS {
    LEAP = 'leap',
    BLOB = 'blob',
    HSRAC = 'hsrac',
    RANSAC = 'ransac',
    HSF = 'hsf',
    AHSF = 'ahsf',
}
