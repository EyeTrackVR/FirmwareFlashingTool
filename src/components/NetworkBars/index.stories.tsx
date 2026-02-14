import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import NetworkBars, { IProps } from './index'

const meta: Meta<IProps> = {
    title: 'Components/NetworkBars',
    component: NetworkBars,
    argTypes: {
        signalBar: { control: 'number' },
    },
}

export default meta
type Story = StoryObj<IProps>

const Template = (args: IProps) => {
    return <NetworkBars signalBar={args.signalBar} />
}

export const Default: Story = {
    render: Template,
}
