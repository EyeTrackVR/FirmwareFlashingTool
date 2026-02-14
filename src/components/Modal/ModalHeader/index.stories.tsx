import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import ModalHeader from './index'

const meta: Meta<typeof ModalHeader> = {
    title: 'Components/Modals/ModalHeader',
    component: ModalHeader,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof ModalHeader>

export const Default: Story = {
    args: {
        onClick: () => {},
        disabled: false,
        label: 'Header',
    },
}
