import { BOARD_TYPE, CHANNEL_TYPE, STEP_STATUS_ENUM } from './types/enums'
import { type IChannelOptions } from '@interfaces/interfaces'

export const supportedBoards: string[] = [BOARD_TYPE.XIAOSENSES_3, BOARD_TYPE.XIAOSENSES_3_USB]
export const debugModes: string[] = ['off', 'error', 'warn', 'info', 'debug', 'trace']
export const defaultMdnsLength = 24
export const portBaudRate = 115200
export const mdnsLength = 12
export const radius = 24
export const usb = 'USB'
export const questionModalId = 'questionModal'
export const apModalID = 'apMode'
export const logsModalID = 'logs'
export const wifiModalID = 'wifiMode'
export const beforeFlashingModalID = 'beforeFlashingMode'
export const beforeSelectBoardModalID = 'BeforeSelectBoardMode'
export const debugModalId = 'debugModal'
export const staticMdns = 'openiristracker'
export const DEVICE_LOST = 'The device has been lost.'
export const STREAM_IS_UNDER = 'The stream is under'
export const SSID_MISSING = 'ssid missing'
export const AP_IP_ADDRESS = 'AP IP address:'
export const DEFAULT_PORT_NAME = 'auto'

const circleSize = Math.PI * (radius * 2)

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
        dashoffset: ((105 / 100) * circleSize).toString(),
    },
    [STEP_STATUS_ENUM.CONFIGURE_WIFI]: {
        index: '2',
        description: 'Configure wifi network',
        dashoffset: (((105 - 50) / 100) * circleSize).toString(),
    },
    [STEP_STATUS_ENUM.FLASH_FIRMWARE]: {
        index: '3',
        description: 'Flash firmware assets',
        dashoffset: (((100 - 100) / 100) * circleSize).toString(),
    },
}

export const BoardDescription: {
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

export const BoardConnectionMethod: {
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

export const ChannelOptions: Record<CHANNEL_TYPE, IChannelOptions> = {
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
