import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import PasswordInput from './index'

const meta: Meta<typeof PasswordInput> = {
    title: 'Components/Typography/Typography',
    component: PasswordInput,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
    args: {
        text: 'h1',
        color: 'white',
        children: 'Typography',
    },
}
