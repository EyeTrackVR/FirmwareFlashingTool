import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import PrimaryButton from './index'

const meta: Meta<typeof PrimaryButton> = {
    title: 'Components/Buttons/PrimaryButton',
    component: PrimaryButton,
    argTypes: {
        label: { control: 'text' },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
        },
        disabled: { control: 'boolean' },
        isActive: { control: 'boolean' },
        isLoader: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
}

export default meta
type Story = StoryObj<typeof PrimaryButton>

export const Default: Story = {
    args: {
        label: 'Primary Button',
        type: 'button',
        disabled: false,
        isActive: false,
        isLoader: false,
    },
}
