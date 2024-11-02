import {
    BOARD_TYPE,
    BUTTON_ACTION,
    CHANNEL_TYPE,
    HARDWARE_TYPE,
    NAVIGATION,
    STEP_STATUS_ENUM,
} from './types/enums'
import { type IChannelOptions } from '@interfaces/interfaces'

export const BOARD_HARDWARE_TYPE = [HARDWARE_TYPE.LEFT, HARDWARE_TYPE.RIGHT]
export const SUPPORTED_BOARDS: string[] = [BOARD_TYPE.XIAOSENSES_3, BOARD_TYPE.XIAOSENSES_3_USB]
export const DEBUG_MODES: string[] = ['off', 'error', 'warn', 'info', 'debug', 'trace']
export const CIRCLE_RADIUS = 24
export const USB_ID = 'USB'
export const QUESTION_MODAL_ID = 'questionModal'
export const AP_MODAL_ID = 'apMode'
export const WIFI_MODAL_ID = 'wifiMode'
export const BEFORE_FLASH_MODAL_ID = 'beforeFlashingMode'
export const DEBUL_MODAL_ID = 'debugModal'
export const STATIC_MNDS_NAME = 'openiristracker'
export const DEVICE_LOST = 'The device has been lost.'
export const BEFORE_SELECT_BOARD_MODAL_ID = 'BeforeSelectBoardMode'
export const STREAM_IS_UNDER = 'The stream is under'
export const SSID_MISSING = 'ssid missing'
export const AP_IP_ADDRESS = 'AP IP address:'
export const ADD_BOARD_LIMIT = 2
export const DEFAULT_PORT_NAME = 'auto'

const CIRCLE_SIZE = Math.PI * (CIRCLE_RADIUS * 2)

export const actions = [
    { label: 'Cropping mode', action: BUTTON_ACTION.CROPPING_MODE },
    { label: 'Recalibrate', action: BUTTON_ACTION.RECALIBRATE },
    { label: 'Recenter', action: BUTTON_ACTION.RECENTER },
]

export const stepStatus: {
    [key in STEP_STATUS_ENUM]: {
        description: string
        dashoffset: string
        index: string
    }
} = {
    [STEP_STATUS_ENUM.SELECT_BOARD]: {
        index: '1',
        description: 'Select board',
        dashoffset: ((105 / 100) * CIRCLE_SIZE).toString(),
    },
    [STEP_STATUS_ENUM.CONFIGURE_WIFI]: {
        index: '2',
        description: 'Configure wifi network',
        dashoffset: (((105 - 50) / 100) * CIRCLE_SIZE).toString(),
    },
    [STEP_STATUS_ENUM.FLASH_FIRMWARE]: {
        index: '3',
        description: 'Flash firmware assets',
        dashoffset: (((100 - 100) / 100) * CIRCLE_SIZE).toString(),
    },
}

export const BOARD_DESCRIPTION: {
    [key in BOARD_TYPE]: string
} = {
    [BOARD_TYPE.ESP_32_AI_THINKER]: 'Default for ESP32-AI-THINKER and ESP CAM boards.',
    [BOARD_TYPE.ESP_32]:
        'Special ESP32-CAM, it is unlikely that you will need to use this environment.',
    [BOARD_TYPE.ESP_32_M_5_STACK]: 'ESP32M5Stack.',
    [BOARD_TYPE.ESP_32_W_ROVER]: 'ESP32WRover.',
    [BOARD_TYPE.ESP_EYE]: 'TESP-EYE (not the S3 variant)',
    [BOARD_TYPE.WROOMS_3]: 'FREENOVE-ESP32-S3 (wireless mode)',
    [BOARD_TYPE.WROOMS_3_QIO]: 'FREENOVE-ESP32-S3 (wireless mode, for boards with octal flash)',
    [BOARD_TYPE.WROOMS_3_USB]: 'FREENOVE-ESP32-S3 (wired mode)',
    [BOARD_TYPE.WROOMS_3QIOUSB]: 'FREENOVE-ESP32-S3 (wired mode, for boards with octal flash)',
    // eslint-disable-next-line quotes
    [BOARD_TYPE.XIAOSENSES_3]: "SeedStudio's XIAO ESP32-S3 Sense (wireless mode)",
    // eslint-disable-next-line quotes
    [BOARD_TYPE.XIAOSENSES_3_USB]: "SeedStudio's XIAO ESP32-S3 Sense (wired mode)",
}

export const BOARD_CONNECTION_METHOD: {
    [key in BOARD_TYPE]: string
} = {
    [BOARD_TYPE.ESP_32_AI_THINKER]: 'wireless mode',
    [BOARD_TYPE.ESP_32]: 'wireless mode',
    [BOARD_TYPE.ESP_32_M_5_STACK]: 'wireless mode',
    [BOARD_TYPE.ESP_32_W_ROVER]: 'wireless mode',
    [BOARD_TYPE.ESP_EYE]: 'wireless mode',
    [BOARD_TYPE.WROOMS_3]: 'wireless mode',
    [BOARD_TYPE.WROOMS_3_QIO]: 'wireless mode',
    [BOARD_TYPE.WROOMS_3_USB]: 'wired mode',
    [BOARD_TYPE.WROOMS_3QIOUSB]: 'wired mode',
    [BOARD_TYPE.XIAOSENSES_3]: 'wireless mode',
    [BOARD_TYPE.XIAOSENSES_3_USB]: 'wired mode',
}

export const CHANNEL_OPTIONS: Record<CHANNEL_TYPE, IChannelOptions> = {
    [CHANNEL_TYPE.OFFICIAL]: {
        label: CHANNEL_TYPE.OFFICIAL,
        description: 'Official channel for official releases.',
    },
    [CHANNEL_TYPE.BETA]: {
        label: CHANNEL_TYPE.BETA,
        description:
            'This channel is for testing purposes only. It is not recommended for day to day usage',
    },
}

export const DIRECTION: Record<string, STEP_STATUS_ENUM> = {
    [NAVIGATION.CONFIGURE_BOARD]: STEP_STATUS_ENUM.SELECT_BOARD,
    [NAVIGATION.NETWORK]: STEP_STATUS_ENUM.CONFIGURE_WIFI,
    [NAVIGATION.FLASH_FIRMWARE]: STEP_STATUS_ENUM.FLASH_FIRMWARE,
}
