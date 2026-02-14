import Card from '@components/Cards/Card'
import { ACTION } from '@interfaces/animation/enums'
import { classNames } from '@src/utils'
import { BiRegularChip } from 'solid-icons/bi'
import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import SwipeAnimation from './index'

interface IProps {
    step: number
    actionType: ACTION
    children: any
}

const meta: Meta<IProps> = {
    title: 'Components/Animations/SwipeAnimation',
    component: SwipeAnimation,
    argTypes: {
        step: { control: 'number' },
        actionType: {
            control: 'select',
            options: [ACTION.NEXT, ACTION.PREV],
        },
        children: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<IProps>

const Template = (args: IProps) => {
    return (
        <div class="flex w-[100vw] h-[100vh] items-center justify-center">
            <div
                class={classNames(
                    'bg-black-900 flex border relative bottom-[20px] overflow-hidden border-solid border-black-800 rounded-12 flex-col items-center justify-between duration-180 transition-all ease-in-out',
                    'min-h-[480px] max-w-[420px] w-full mx-24',
                )}>
                <SwipeAnimation>
                    <Card
                        primaryButtonLabel="Continue"
                        isActive
                        icon={BiRegularChip}
                        onClickBack={() => {}}
                        onClickPrimary={() => {}}
                        label="Before proceeding."
                        description="Unplug your board, then reconnect it to the PC without pressing any buttons."
                    />
                </SwipeAnimation>
            </div>
        </div>
    )
}

export const Default: Story = {
    render: Template,
}
