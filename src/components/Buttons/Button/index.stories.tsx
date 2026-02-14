import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import { Button } from './index'

const meta: Meta<typeof Button> = {
    title: 'Components/Buttons/Button',
    component: Button,
    argTypes: {
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
        },
        size: {
            control: 'text',
        },
        isActive: {
            control: 'boolean',
        },
        isLoadingPrimaryButton: {
            control: 'boolean',
        },
        isLoader: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        label: {
            control: 'text',
        },
        onClick: { action: 'clicked' },
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        label: 'Default Button',
        type: 'button',
        isActive: false,
        isLoadingPrimaryButton: false,
        isLoader: false,
        disabled: false,
    },
}
