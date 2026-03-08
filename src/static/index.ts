import { FLASH_STATUS, FLASH_STEP } from '@interfaces/animation/enums'
import { BOARD_TYPE, CHANNEL_TYPE } from '@interfaces/firmware/enums'
import { type IChannelOptions } from '@interfaces/firmware/interfaces'
import { IFlashState } from '@store/terminal/terminal'

export const RECOMMENDED_BOARDS: string[] = [BOARD_TYPE.SEED_STUDIO_XIAO_ESP32S3]
export const DEFAULT_MDNS_LENGTH = 24
export const MDNS_LENGTH = 12
export const USB = 'USB'
export const AP_MODE_ID = 'AP_MODE_ID'
export const BEFORE_SELECT_BOARD_MODE = 'BEFORE_SELECT_BOARD_MODE'
export const SELECT_PORT_MODAL_ID = 'SELECT_PORT_MODAL_ID'
export const APP_UPDATER_MODAL_ID = 'APP_UPDATER_MODAL_ID'
export const DEVTOOLS_MODAL_ID = 'DEVTOOLS_MODAL_ID'
export const DEFAULT_PORT_NAME = 'auto'

export const GHEndpoints: Record<CHANNEL_TYPE, string> = {
    [CHANNEL_TYPE.OFFICIAL]:
        'https://api.github.com/repos/EyeTrackVR/OpenIris-ESPIDF/releases/latest',
}

export const logs: Record<FLASH_STEP, Record<Exclude<FLASH_STATUS, 'NONE'>, IFlashState>> = {
    [FLASH_STEP.REQUEST_PORT]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Attempting to connect to the requested port... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Successfully connected to the port!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to connect to the port.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.MANIFEST_PATH]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Fetching manifest path... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Manifest path retrieved successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to fetch the manifest path.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.FLASH_FIRMWARE]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Flashing firmware... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Firmware flashed successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to flash firmware.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
}

export const BOARD_DESCRIPTION: Record<string, string> = {
    [BOARD_TYPE.SEED_STUDIO_XIAO_ESP32S3]:
        "SeedStudio's XIAO ESP32-S3 Sense, (wireless/wired mode)",
    [BOARD_TYPE.FACE_FOCUS_VR_EYE_L]: 'Default forFaceFocusVR, (wired mode).',
    [BOARD_TYPE.FACE_FOCUS_VR_EYE_R]: 'Default for FaceFocusVR (wired mode).',
    [BOARD_TYPE.FACE_FOCUS_VR_FACE]: 'Default for FaceFocusVR (wired mode).',
    [BOARD_TYPE.PROJECT_BABBLE]: 'Default for Project Babble (wireless/wired mode).',
    [BOARD_TYPE.ESP_32_AI_THINKER]:
        'Default for ESP32-AI-THINKER and ESP CAM boards (wireless mode).',
    [BOARD_TYPE.ESP_32]:
        'Special ESP32-CAM, it is unlikely that you will need to use this environment (wireless mode).',
    [BOARD_TYPE.WROVER]: 'Default for WROVER (wireless/wired mode).',
    [BOARD_TYPE.ESP_32_M_5_STACK]: 'ESP32M5Stack (wireless mode).',
    [BOARD_TYPE.ESP_EYE]: 'TESP-EYE (not the S3 variant) (wireless/wired mode).',
    [BOARD_TYPE.WROOMS_3]: 'FREENOVE-ESP32-S3 (wireless/wired mode).',
    [BOARD_TYPE.WROOMS_3_QIO]:
        'FREENOVE-ESP32-S3 (wireless mode, for boards with octal flash) (wireless/wired mode).',
}

export const CHANNEL_OPTIONS: Record<CHANNEL_TYPE, IChannelOptions> = {
    [CHANNEL_TYPE.OFFICIAL]: {
        label: CHANNEL_TYPE.OFFICIAL,
        description: 'Official channel for official releases.',
    },
}

export const TRACKERS: Array<{ label: string; value: string }> = [
    { label: 'Right eye', value: 'ETVR-Right' },
    { label: 'Left eye', value: 'ETVR-Left' },
]
