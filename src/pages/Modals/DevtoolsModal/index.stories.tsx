import { CHANNEL_TYPE } from '@interfaces/firmware/enums'
import { CHANNEL_OPTIONS } from '@src/static'
import type { StoryObj } from 'storybook-solidjs-vite'
import DevtoolsModalContainer from './index'

const meta = {
    title: 'Components/Pages/Modals',
}

export default meta
type Story = StoryObj

export const DevtoolsModalContainerStory: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <DevtoolsModalContainer
                channelMode={CHANNEL_TYPE.OFFICIAL}
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
