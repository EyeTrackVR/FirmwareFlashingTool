import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import Checkbox from './index'

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Components/Checkbox',
    component: Checkbox,
    argTypes: {
        checked: {
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    args: {
        checked: true,
    },
}
