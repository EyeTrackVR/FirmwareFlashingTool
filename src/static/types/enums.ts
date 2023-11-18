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
