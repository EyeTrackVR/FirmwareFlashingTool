import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import ToggleButton from './index'

const meta: Meta<typeof ToggleButton> = {
    title: 'Components/Buttons/ToggleButton',
    component: ToggleButton,
    argTypes: {
        active: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
}

export default meta
type Story = StoryObj<typeof ToggleButton>

export const Default: Story = {
    args: {
        active: false,
        onClick: () => {},
    },
}
