import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import DefaultButton from './index'

const meta: Meta<typeof DefaultButton> = {
    title: 'Components/Buttons/DefaultButton',
    component: DefaultButton,
    argTypes: {
        class: { control: 'text' },
        onClick: { action: 'clicked' },
        children: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof DefaultButton>

export const Default: Story = {
    args: {
        children: 'Back',
        class: 'opacity-1 hover:bg-black-800 rounded-full flex items-center justify-center p-6 duration-300 transition-colors',
    },
}
