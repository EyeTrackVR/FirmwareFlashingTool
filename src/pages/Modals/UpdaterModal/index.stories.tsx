import type { StoryObj } from 'storybook-solidjs-vite'
import UpdaterModal from './index'

const meta = {
    title: 'Components/Pages/Modals',
}

export default meta
type Story = StoryObj

export const UpdaterModalStory: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <UpdaterModal
                isActive
                isPrimaryButtonActive
                isSending={false}
                onClickUpdate={() => {}}
                version="1.7.0"
                onClickHeader={() => {}}
                onClickClose={() => {}}
            />
        </div>
    ),
}
