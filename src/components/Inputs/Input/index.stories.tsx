import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import Input from './index'

const meta: Meta<typeof Input> = {
    title: 'Components/Inputs/Input',
    component: Input,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
    args: {
        onChange: () => {},
        placeholder: 'placeholder',
        value: '',
    },
}
