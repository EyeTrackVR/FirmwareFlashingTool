import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { Meta, StoryObj } from 'storybook-solidjs-vite'
import Toast from './index'

const meta: Meta<typeof Toast> = {
    title: 'Components/Components/Toast',
    component: Toast,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0a0a0a' }],
        },
    },
    argTypes: {
        toast: { control: 'object' },
        index: { control: { type: 'number', min: 0, max: 5 } },
        total: { control: { type: 'number', min: 1, max: 10 } },
        hovering: { control: 'boolean' },
        onStartRemoving: { action: 'onStartRemoving' },
        dismiss: { action: 'dismiss' },
    },
    args: {
        index: 0,
        total: 1,
        hovering: false,
    },
}

export default meta

type Story = StoryObj<typeof Toast>

export const Default: Story = {
    args: {
        toast: {
            id: 1,
            type: NOTIFICATION_TYPE.DEFAULT,
            message: 'This is a default notification',
            duration: 5000,
        },
    },
}

export const Success: Story = {
    args: {
        toast: {
            id: 2,
            type: NOTIFICATION_TYPE.SUCCESS,
            message: 'Operation completed successfully',
            duration: 5000,
        },
    },
}

export const Warning: Story = {
    args: {
        toast: {
            id: 3,
            type: NOTIFICATION_TYPE.WARNING,
            message: 'Proceed with caution',
            duration: 5000,
        },
    },
}

export const Info: Story = {
    args: {
        toast: {
            id: 4,
            type: NOTIFICATION_TYPE.INFO,
            message: 'Here is some useful information',
            duration: 5000,
        },
    },
}

export const Error: Story = {
    args: {
        toast: {
            id: 5,
            type: NOTIFICATION_TYPE.ERROR,
            message: 'Something went wrong',
            duration: 5000,
        },
    },
}

export const LongMessage: Story = {
    args: {
        toast: {
            id: 10,
            type: NOTIFICATION_TYPE.WARNING,
            message: 'Your session is about to expire due to inactivity',
            description: 'Please save your work. You will be logged out in 60 seconds.',
            duration: 8000,
        },
    },
}
