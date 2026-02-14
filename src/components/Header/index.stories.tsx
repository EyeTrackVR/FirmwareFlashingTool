import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import Header from './index'

const meta: Meta<typeof Header> = {
    title: 'Components/Components/Header',
    component: Header,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
    args: {
        appVersion: '1.7.0',
        onClickHome: () => {},
        onClickDownloadLogs: () => {},
        onClick: () => {},
        docs: false,
    },
}
