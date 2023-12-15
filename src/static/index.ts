import { BOARD_TYPE, STEP_STATUS_ENUM } from './types/enums'

export const debugModes: string[] = ['off', 'error', 'warn', 'info', 'debug', 'trace']

export const stepStatus: {
    [key in STEP_STATUS_ENUM]: { step: string; description: string }
} = {
    [STEP_STATUS_ENUM.CONFIGURE_WIFI]: {
        step: 'Step 1',
        description: 'Configure wifi network',
    },
    [STEP_STATUS_ENUM.SELECT_BOARD]: {
        step: 'Step 2',
        description: 'Select board',
    },
    [STEP_STATUS_ENUM.FLASH_FIRMWARE]: {
        step: 'Step 3',
        description: 'Flash firmware assets',
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
    [BOARD_TYPE.XIAOSENSES_3]: "SeedStudio's XAIO ESP32-S3 Sense (wireless mode)",
    // eslint-disable-next-line quotes
    [BOARD_TYPE.XIAOSENSES_3_USB]: "SeedStudio's XAIO ESP32-S3 Sense (wired mode)",
}
