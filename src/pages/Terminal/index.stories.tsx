import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import Terminal from './index'

const meta: Meta<typeof Terminal> = {
    title: 'Components/Pages/Terminal',
    component: Terminal,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof Terminal>

export const Default: Story = {
    render: () => (
        <div style={{ height: '100vh' }}>
            <Terminal
                logs={[]}
                loader={false}
                activePortName="COM3"
                firmwareVersion="1.7.0"
                onClickBack={() => {}}
                onClickDownloadLogs={() => {}}
                onClickGetLogs={() => {}}
                onClickSelectPort={() => {}}
                ports={[]}
            />
        </div>
    ),
}
