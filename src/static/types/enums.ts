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
