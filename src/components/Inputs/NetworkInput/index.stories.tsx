import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import NetworkInput from './index'

const meta: Meta<typeof NetworkInput> = {
    title: 'Components/Inputs/NetworkInput',
    component: NetworkInput,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof NetworkInput>

export const Default: Story = {
    args: {
        onChange: () => {},
        placeholder: 'placeholder',
        value: '',
    },
}
