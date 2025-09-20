export type SetWifiCommand = {
    command: 'set_wifi'
    data: {
        name: string
        channel: number
        power: number
        ssid: string
        password: string
    }
}

export type SetMdnsCommand = {
    command: 'set_mdns'
    data: {
        hostname: string
    }
}

export type switchMode = {
    command: 'switch_mode'
    data: {
        mode: 'uvc' | 'wifi' | 'auto'
    }
}

export type getMdnsName = {
    command: 'get_mdns_name'
}

export type getDeviceMode = {
    command: 'get_device_mode'
}

export type ScanNetworks = {
    command: 'scan_networks'
}

export type Pause = {
    command: 'pause'
    data: {
        pause: boolean
    }
}

export type ConnectWifi = {
    command: 'connect_wifi'
}

export type GetWifiStatus = {
    command: 'get_wifi_status'
}

export type Command =
    | SetWifiCommand
    | SetMdnsCommand
    | getMdnsName
    | getDeviceMode
    | switchMode
    | ScanNetworks
    | Pause
    | ConnectWifi
    | GetWifiStatus

export type DeviceMode = 'uvc' | 'wifi' | 'auto'

export type EspflashStatus =
    | {
          type: 'Init'
          address: number
          total: number
      }
    | {
          type: 'Update'
          current: number
      }
    | {
          type: 'Finish'
      }

export type NativePortInfo = {
    port_name: string
    port_type: {
        UsbPort: {
            vid: number
            pid: number
            manufacturer: string | null
            product: string | null
            serial_number: string | null
        }
    }
}

export type UsbSerialPortInfo = {
    portName: string
    vid: number
    pid: number
    manufacturer: string | null
    product: string | null
    serialNumber: string | null
}

export type ProgressCallback = (percentage: number) => void

export type LogEvent =
    | {
          Data: string
      }
    | {
          Error: string
      }
