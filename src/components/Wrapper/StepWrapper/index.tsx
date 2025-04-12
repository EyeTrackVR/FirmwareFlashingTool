import Typography from '@components/Typography'
import { classNames } from '@src/utils'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { Component, createMemo, Show } from 'solid-js'

export interface IProps {
    description: string
    isActive: boolean
    hideDots?: boolean
    step: string
    label: string
}

const StepWrapper: Component<IProps> = (props) => {
    const isHideDots = createMemo(() => {
        return typeof props.hideDots !== 'undefined' || props.hideDots
    })

    return (
        <div class="flex gap-12 h-full  justify-end">
            <div class="flex flex-col items-end">
                <Typography color="white" text="caption" nowrap>
                    {props.label}
                </Typography>
                <Typography color="white" text="small" nowrap>
                    {props.description}
                </Typography>
            </div>
            <div class={classNames(!isHideDots() ? 'flex flex-col items-center' : '')}>
                <div
                    class="min-w-[24px] max-w-[24px] w-24 min-h-[24px] max-h-[24px] flex items-center justify-center border-2 rounded-100 mt-auto mb-auto bottom-0 "
                    classList={{
                        'bg-purple-200 border-purple-200': props.isActive,
                    }}>
                    <Show
                        when={props.isActive}
                        fallback={
                            <Typography color="white" text="small" nowrap>
                                {props.step}
                            </Typography>
                        }>
                        <IoCheckmarkSharp color="white" />
                    </Show>
                </div>
                <Show when={!isHideDots()}>
                    <div class="h-full bg-gradient-to-b from-transparent via-transparent from w-2  to-white-100 bg-[length:100%_15px] bg-repeat-y" />
                </Show>
            </div>
        </div>
    )
}

export default StepWrapper
