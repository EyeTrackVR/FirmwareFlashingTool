//********************************* UI *************************************/

export enum POPOVER_ID {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    TRACKER_MANAGER = 'tracker-manager-popover',
    SETTINGS_POPOVER = 'settings-popover',
}

export enum ANIMATION_MODE {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    NONE = 'NONE',
}

export enum TITLEBAR_ACTION {
    MINIMIZE = 'minimize',
    MAXIMIZE = 'maximize',
    CLOSE = 'close',
}

export enum ENotificationType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    DEFAULT = 'DEFAULT',
}

export enum ENotificationAction {
    OS = 'OS',
    APP = 'APP',
    NULL = 'null',
}

export enum RANGE_INPUT_FORMAT {
    EYE_POSITION_SCALAR = 'Eye position scalar',
    THRESHOLD = 'Threshold',
    ROTATION = 'Rotation',
}

export enum RANGE_INPUT_FORMAT_APP_SETTINGS {
    MIN_FREQUENCY_CUTOFF = 'Min frequency cutoff',
    SPEED_COEFFICIENT = 'Speed coefficient',
}

//********************************* Network and App *************************************/

export enum ExitCodes {
    USER_EXIT = 0,
    ERROR = 1,
    ERROR_UNKNOWN = 2,
}

export enum RESTStatus {
    ACTIVE = 'ACTIVE',
    COMPLETE = 'COMPLETE',
    LOADING = 'LOADING',
    FAILED = 'FAILED',
    NO_CAMERA = 'NO_CAMERA',
    NO_CONFIG = 'NO_CONFIG',
}

export enum RESTType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum ESPEndpoints {
    //? Default
    PING = '/control/builtin/command/ping',
    SAVE = '/control/builtin/command/save',
    RESET_CONFIG = '/control/builtin/command/resetConfig',
    REBOOT_DEVICE = '/control/builtin/command/rebootDevice',
    RESTART_CAMERA = '/control/builtin/command/restartCamera',
    GET_STORED_CONFIG = '/control/builtin/command/getStoredConfig',
    SET_TX_POWER = '/control/builtin/command/setTxPower',
    SET_DEVICE = '/control/builtin/command/setDevice',
    //? Network
    WIFI = '/control/builtin/command/wifi',
    WIFI_STRENGTH = '/control/builtin/command/wifiStrength',
    OTA = '/update',
}

export enum STEP_STATUS_ENUM {
    CONFIGURE_WIFI = 'CONFIGURE_WIFI',
    SELECT_BOARD = 'SELECT_BOARD',
    FLASH_FIRMWARE = 'FLASH_FIRMWARE',
}

export enum DIRECTION {
    '/' = STEP_STATUS_ENUM.SELECT_BOARD,
    '/network' = STEP_STATUS_ENUM.CONFIGURE_WIFI,
    '/flashFirmware' = STEP_STATUS_ENUM.FLASH_FIRMWARE,
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

export enum CHANNEL_TYPE {
    OFFICIAL = 'Official',
    BETA = 'Beta',
}

//********************************* flash firmware state *************************************/

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

export const enum FLASH_STATUS {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    UNKNOWN = 'UNKNOWN',
    ABORTED = 'ABORTED',
}

export enum MODAL_TYPE {
    BEFORE_SELECT_BOARD = 'BEFORE_SELECT_BOARD',
    UPDATE_NETWORK = 'UPDATE_NETWORK',
    BEFORE_FLASHING = 'BEFORE_FLASHING',
    AP_MODE = 'AP_MODE',
    NONE = 'NONE',
}
