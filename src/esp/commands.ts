import { COMMAND_ENUM, ESP_COMMAND_ENUM } from './interfaces/enums'

export const ESP_COMMAND: Record<ESP_COMMAND_ENUM, string> = {
    [ESP_COMMAND_ENUM.GET_WIFI_CONNECTION_STATUS]: 'plugin:esp|get_wifi_connection_status',
    [ESP_COMMAND_ENUM.GET_POSSIBLE_NETWORKS]: 'plugin:esp|get_possible_networks',
    [ESP_COMMAND_ENUM.GET_AVAILABLE_NETWORKS]: 'plugin:esp|available_ports',
    [ESP_COMMAND_ENUM.CANCEL_STREAM_LOGS]: 'plugin:esp|cancel_stream_logs',
    [ESP_COMMAND_ENUM.TEST_CONNECTION]: 'plugin:esp|test_connection',
    [ESP_COMMAND_ENUM.SEND_COMMANDS]: 'plugin:esp|send_commands',
    [ESP_COMMAND_ENUM.STREAM_LOGS]: 'plugin:esp|stream_logs',
    [ESP_COMMAND_ENUM.GET_LOGS]: 'plugin-esp-logs',
    [ESP_COMMAND_ENUM.FLASH]: 'plugin:esp|flash',
}

export const COMMAND: Record<COMMAND_ENUM, string> = {
    [COMMAND_ENUM.GET_WIFI_STATUS]: 'get_wifi_status',
    [COMMAND_ENUM.GET_DEVICE_MODE]: 'get_device_mode',
    [COMMAND_ENUM.RESTART_DEVICE]: 'restart_device',
    [COMMAND_ENUM.SCAN_NETWORKS]: 'scan_networks',
    [COMMAND_ENUM.GET_MDNS_NAME]: 'get_mdns_name',
    [COMMAND_ENUM.CONNECT_WIFI]: 'connect_wifi',
    [COMMAND_ENUM.SWITCH_MODE]: 'switch_mode',
    [COMMAND_ENUM.SET_MDNS]: 'set_mdns',
    [COMMAND_ENUM.SET_WIFI]: 'set_wifi',
    [COMMAND_ENUM.PAUSE]: 'pause',
}
