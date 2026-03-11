import { Meta, StoryObj } from 'storybook-solidjs-vite'
import Toast from './index'

const meta: Meta<typeof Toast> = {
    title: 'Components/Components/ProgressBar',
    component: Toast,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0a0a0a' }],
        },
    },
    argTypes: {
        duration: {
            control: { type: 'number', min: 0, max: 5000 },
        },
        paused: { control: 'boolean' },
        color: { control: 'color' },
    },
    args: {
        duration: 2000,
        paused: false,
        color: '#fff',
    },
}

export default meta

type Story = StoryObj<typeof Toast>

export const Default: Story = {
    args: {
        duration: 2000,
        paused: false,
        color: '#fff',
    },
}
