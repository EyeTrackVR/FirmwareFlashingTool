import { Meta, StoryObj } from 'storybook-solidjs-vite'
import CustomToast, { ToastProps } from './index'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { Toaster } from 'solid-headless'
const meta: Meta = {
    title: 'Components/Components/CustomToast',
    component: CustomToast,
}

export default meta
type Story = StoryObj<typeof CustomToast>

const Template = (args: ToastProps) => {
    return (
        <Toaster class="absolute pr-12 pb-12 fixed-0 right-0 bottom-0 z-10">
            <CustomToast {...args} />
        </Toaster>
    )
}

export const Error: Story = {
    render: Template,
    args: {
        id: 'toast-2',
        notif: {
            title: 'error',
            type: NOTIFICATION_TYPE.ERROR,
            message: 'Something went wrong!',
        },
    },
}
