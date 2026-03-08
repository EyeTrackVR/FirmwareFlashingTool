import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import { Modal, IProps } from './index'
import { createSignal } from 'solid-js'

const meta: Meta<IProps> = {
    title: 'Components/Modals/Modal',
    component: Modal,
    argTypes: {
        onClickHeader: { action: 'header clicked' },
        onClickCloseModal: { action: 'modal closed' },
        isActive: { control: 'boolean' },
        width: { control: 'text' },
        version: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<IProps>

const Template = (args: IProps) => {
    const [isActive, setIsActive] = createSignal(args.isActive ?? false)
    return (
        <>
            <button onClick={() => setIsActive(true)}>Open Modal</button>
            <Modal
                {...args}
                isActive={isActive()}
                onClickCloseModal={() => {
                    args.onClickCloseModal?.()
                    setIsActive(false)
                }}>
                {args.children}
            </Modal>
        </>
    )
}

export const Default: Story = {
    render: Template,
    args: {
        id: 'modal-1',
        version: '1.0.0',
        children: <p class="text-white">This is a modal content!</p>,
        isActive: false,
    },
}
