import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import Card from './index'
import { BiRegularChip } from 'solid-icons/bi'

const meta: Meta<typeof Card> = {
    title: 'Components/cards/Card',
    component: Card,
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        isLoader: { control: 'boolean' },
        isActive: { control: 'boolean' },
        status: {
            control: 'select',
            options: ['success', 'fail', undefined],
        },
        percentageProgress: { control: 'number' },
        icon: { control: false },
        onClickSettings: { action: 'clicked settings' },
    },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
    args: {
        isLoader: true,
        icon: BiRegularChip,
        label: 'Detecting device mode',
        onClickPrimary: () => {},
        primaryButtonLabel: 'Next',
        onClickSecondary: () => {},

        secondaryButtonLabel: 'Back',
        description: 'Please wait while we detect your device mode.',
    },
}
