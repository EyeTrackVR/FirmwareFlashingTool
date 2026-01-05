import type { StoryObj } from 'storybook-solidjs-vite'
import SelectBoardModal from './index'

const meta = {
    title: 'Components/Pages/Modals',
}

export default meta
type Story = StoryObj

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
