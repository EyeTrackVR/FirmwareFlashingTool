import { BOARD_TYPE } from './types/enums'

export const ALGORITHMS: string[] = ['LEAP', 'BLOB', 'HSRAC', 'RANSAC', 'HSF', 'AHSF']
export const ADD_BOARD_LIMIT = 2
export const supportedBoards: string[] = [BOARD_TYPE.XIAOSENSES_3, BOARD_TYPE.XIAOSENSES_3_USB]
export const defaultMdnsLength = 24
export const MDNS_LENGTH = 12
export const RADIUS = 24
export const USB = 'USB'
export const AP_ID = 'apMode'
export const WIFI_ID = 'wifiMode'
export const BEFORE_FLASHING_ID = 'beforeFlashing'
export const BEFORE_SELECT_BOARD_ID = 'beforeSelectBoard'
export const ESTABLISH_CONNECTION_ID = 'establishConnection'
export const DEBUG_MODAL_ID = 'debugModal'
export const STATIC_MDNS = 'openiristracker'
export const DEVICE_LOST = 'The device has been lost.'
export const STREAM_IS_UNDER = 'The stream is under'
export const SSID_MISSING = 'ssid missing'
export const AP_IP_ADDRESS = 'AP IP address:'
export const DEFAULT_PORT_NAME = 'auto'
export const CIRCLE_SIZE = Math.PI * (RADIUS * 2)
