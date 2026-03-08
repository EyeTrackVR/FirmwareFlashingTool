import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import SelectButton from './index'

const meta: Meta<typeof SelectButton> = {
    title: 'Components/Buttons/SelectButton',
    component: SelectButton,
    argTypes: {
        label: { control: 'text' },
        header: { control: 'text' },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
        },
        tabIndex: { control: 'number' },
        onClick: { action: 'clicked' },
    },
}

export default meta
type Story = StoryObj<typeof SelectButton>

export const Default: Story = {
    args: {
        label: 'Select',
    },
}
