export enum MODAL_TYPE {
    ESTABLISH_CONNECTION = 'ESTABLISH_CONNECTION',
    BEFORE_SELECT_BOARD = 'BEFORE_SELECT_BOARD',
    CLOSE_APP = 'CLOSE_APP',
    UPDATE_NETWORK = 'UPDATE_NETWORK',
    BEFORE_FLASHING = 'BEFORE_FLASHING',
    AP_MODE = 'AP_MODE',
    NONE = 'NONE',
}

export const enum FLASH_STATUS {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    UNKNOWN = 'UNKNOWN',
    ABORTED = 'ABORTED',
}

export const enum FLASH_STEP {
    BOARD_CONNECTION = 'BOARD_CONNECTION',
    OPEN_PORT = 'OPEN_PORT',
    LOGS = 'LOGS',
    MANIFEST_PATH = 'MANIFEST_PATH',
    REQUEST_PORT = 'REQUEST_PORT',
    INITIALIZE = 'INITIALIZE',
    CHIP_FAMILY = 'CHIP_FAMILY',
    FLASH_FIRMWARE = 'FLASH_FIRMWARE',
    BUILD = 'BUILD',
    DOWNLOAD_FILES = 'FILES',
}

export enum BOARD_TYPE {
    BABBLE_WROOMS_S3 = 'Babble_wrooms_s3',
    BABBLE_WROOMS_S3_RELEASE = 'Babble_wrooms_s3_release',
    BABBLE_USB_WROOMS_S3 = 'Babble_USB_wrooms_s3',
    BABBLE_USB_WROOMS_S3_RELEASE = 'Babble_USB_wrooms_s3_release',
    ESP_32_AI_THINKER = 'esp32AIThinker',
    ESP_32 = 'esp32Cam',
    ESP_32_M_5_STACK = 'esp32M5Stack',
    ESP_32_W_ROVER = 'esp32WRover',
    ESP_EYE = 'esp_eye',
    WROOMS_3 = 'wrooms3',
    WROOMS_3_QIO = 'wrooms3QIO',
    WROOMS_3_USB = 'wrooms3USB',
    WROOMS_3QIOUSB = 'wrooms3QIOUSB',
    XIAOSENSES_3 = 'xiaosenses3',
    XIAOSENSES_3_USB = 'xiaosenses3_USB',
}

export enum STEP_STATUS_ENUM {
    CONFIGURE_WIFI = 'CONFIGURE_WIFI',
    SELECT_BOARD = 'SELECT_BOARD',
    FLASH_FIRMWARE = 'FLASH_FIRMWARE',
}

export enum DIRECTION {
    '/configureBoardWizard' = STEP_STATUS_ENUM.SELECT_BOARD,
    '/network' = STEP_STATUS_ENUM.CONFIGURE_WIFI,
    '/flashFirmware' = STEP_STATUS_ENUM.FLASH_FIRMWARE,
}

export enum TITLEBAR_ACTION {
    MINIMIZE = 'minimize',
    MAXIMIZE = 'maximize',
    CLOSE = 'close',
}

export enum NOTIFICATION_TYPE {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    DEFAULT = 'DEFAULT',
}

export enum NOTIFICATION_ACTION {
    OS = 'OS',
    APP = 'APP',
    NULL = 'null',
}

export enum CHANNEL_TYPE {
    OFFICIAL = 'Official',
    BETA = 'Beta',
}
