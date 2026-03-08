import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import CheckboxButton from './index'

const meta: Meta<typeof CheckboxButton> = {
    title: 'Components/Buttons/CheckboxButton',
    component: CheckboxButton,
    argTypes: {
        checked: { control: 'boolean' },
        label: { control: 'text' },
        onClick: { action: 'toggled' },
    },
}

export default meta
type Story = StoryObj<typeof CheckboxButton>

export const Default: Story = {
    args: {
        checked: false,
        label: "Don't show this again",
    },
}
