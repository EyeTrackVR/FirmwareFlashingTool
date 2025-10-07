import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import OptionButton from './index'

const meta: Meta<typeof OptionButton> = {
    title: 'Components/Buttons/OptionButton',
    component: OptionButton,
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        isActive: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
}

export default meta
type Story = StoryObj<typeof OptionButton>

export const Default: Story = {
    args: {
        label: 'Option 1',
        description: 'This is the default option button.',
        isActive: false,
    },
}
