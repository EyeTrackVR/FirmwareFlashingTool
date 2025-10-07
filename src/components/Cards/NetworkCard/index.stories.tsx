import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import NetworkCard from './index'

const meta: Meta<typeof NetworkCard> = {
    title: 'Components/cards/NetworkCard',
    component: NetworkCard,
}

export default meta
type Story = StoryObj<typeof NetworkCard>

export const Default: Story = {
    args: {
        data: [
            {
                ssid: 'Home_Network',
                channel: 6,
                rssi: '-45 dBm',
                mac_address: 'A4:C3:F0:9B:12:3E',
                auth_mode: 'WPA2-Personal',
            },
            {
                ssid: 'Office_WiFi',
                channel: 11,
                rssi: '-60 dBm',
                mac_address: 'B8:D7:E4:2C:67:9A',
                auth_mode: 'WPA3-Personal',
            },
        ],
        onClickManualSetup: () => {},
        onClickNetwork: () => {},
        onClickBack: () => {},
    },
}
