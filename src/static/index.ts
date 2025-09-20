import { type IChannelOptions } from '@interfaces/interfaces'
import { BOARD_TYPE, CHANNEL_TYPE } from './types/enums'

export const RECOMMENDED_BOARDS: string[] = [BOARD_TYPE.XIAOSENSES_3, BOARD_TYPE.XIAOSENSES_3_USB]
export const DEFAULT_MDNS_LENGTH = 24
export const MDNS_LENGTH = 12
export const USB = 'USB'
export const AP_MODE_ID = 'AP_MODE_ID'
export const WIFI_MODE_ID = 'WIFI_MODE_ID'
export const BEFORE_FLASHING_MODE = 'BEFORE_FLASHING_MODE'
export const BEFORE_SELECT_BOARD_MODE = 'BEFORE_SELECT_BOARD_MODE'
export const SELECT_PORT_MODAL_ID = 'SELECT_PORT_MODAL_ID'
export const DEVTOOLS_MODAL_ID = 'DEVTOOLS_MODAL_ID'
export const DEFAULT_PORT_NAME = 'auto'

export const BOARD_DESCRIPTION: {
    [key in BOARD_TYPE]: string
} = {
    [BOARD_TYPE.BABBLE_WROOMS_S3]: 'Official Babble tracker board (wireless mode)',
    [BOARD_TYPE.BABBLE_WROOMS_S3_RELEASE]: 'Official Babble tracker board (wireless mode)',
    [BOARD_TYPE.BABBLE_USB_WROOMS_S3]: 'Official Babble tracker board (wired mode)',
    [BOARD_TYPE.BABBLE_USB_WROOMS_S3_RELEASE]: 'Official Babble tracker board (wired mode)',
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
    [BOARD_TYPE.XIAOSENSES_3]: "SeedStudio's XIAO ESP32-S3 Sense (wireless mode)",
    [BOARD_TYPE.XIAOSENSES_3_USB]: "SeedStudio's XIAO ESP32-S3 Sense (wired mode)",
}

export const BOARD_CONNECTION_METHOD: {
    [key in BOARD_TYPE]: string
} = {
    [BOARD_TYPE.BABBLE_WROOMS_S3]: 'wireless mode',
    [BOARD_TYPE.BABBLE_WROOMS_S3_RELEASE]: 'wireless mode',
    [BOARD_TYPE.BABBLE_USB_WROOMS_S3_RELEASE]: 'wired mode',
    [BOARD_TYPE.BABBLE_USB_WROOMS_S3]: 'wired mode',
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
