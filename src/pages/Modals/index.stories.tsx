import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import DevtoolsModalContainer from './DevtoolsModal'
import { CHANNEL_TYPE } from '@interfaces/firmware/enums'
import { CHANNEL_OPTIONS } from '@src/static'
import SelectBoardModal from './SelectBoardModal'
import SelectPortModal from './SelectPortModal'

const meta = {
    title: 'Components/Pages/Modals',
}

export default meta
type Story = StoryObj

export const DevtoolsModalContainerStory: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <DevtoolsModalContainer
                channelMode={CHANNEL_TYPE.BETA}
                channelOptions={Object.values(CHANNEL_OPTIONS)}
                version="1.7.0"
                isActive={true}
                onClickHeader={() => {}}
                onClickClose={() => {}}
                onClickSetChannelMode={(label) => {}}
            />
        </div>
    ),
}

export const SelectBoardModalStory: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <SelectBoardModal
                version="1.7.0"
                boards={[]}
                activeBoard={''}
                isActive={true}
                onClickHeader={() => {}}
                onClickClose={() => {}}
                onClickConfirmBoard={(board) => {}}
            />
        </div>
    ),
}

export const SelectPortModalStory: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <SelectPortModal
                version="1.7.0"
                ports={[
                    {
                        label: 'COM3',
                        description: 'COM3',
                    },
                    {
                        label: 'COM4',
                        description: 'COM4',
                    },
                ]}
                activeBoard={'COM3'}
                isActive={true}
                onClickHeader={() => {}}
                onClickClose={() => {}}
                onClickConfirmPort={(port) => {}}
            />
        </div>
    ),
}
