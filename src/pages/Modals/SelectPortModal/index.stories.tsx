import type { StoryObj } from 'storybook-solidjs-vite'
import SelectPortModal from './index'

const meta = {
    title: 'Components/Pages/Modals',
}

export default meta
type Story = StoryObj

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
