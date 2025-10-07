import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import PasswordInput from './index'

const meta: Meta<typeof PasswordInput> = {
    title: 'Components/Inputs/PasswordInput',
    component: PasswordInput,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
    args: {
        onChange: () => {},
        placeholder: 'placeholder',
        value: '',
    },
}
