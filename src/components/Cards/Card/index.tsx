import Button from '@components/Buttons/Button'
import DefaultButton from '@components/Buttons/DefaultButton'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import Typography from '@components/Typography'
import { IconTypes } from 'solid-icons'
import { IoChevronBackSharp } from 'solid-icons/io'
import { ParentComponent, Show } from 'solid-js'
import { VsSettings } from 'solid-icons/vs'
import { classNames } from '@src/utils'

export interface IProps {
    onClickSettings?: () => void
    onClickBack?: () => void
    onClickSecondary?: () => void
    onClickPrimary?: () => void
    onClickOption?: () => void
    onClickOptionLabel?: string
    label: string
    icon: IconTypes
    description?: string
    isLoader?: boolean
    isActive?: boolean
    primaryButtonLabel?: string
    secondaryButtonLabel?: string
    percentageProgress?: number
    status?: 'success' | 'fail'
}

const Card: ParentComponent<IProps> = (props) => {
    return (
        <div class="bg-black-900 flex p-12  rounded-12 flex-col items-center justify-between min-h-[480px] w-[420px]">
            <div class="flex flex-row w-full justify-between">
                <DefaultButton
                    class={
                        typeof props.onClickBack === 'undefined'
                            ? 'opacity-0 cursor-default'
                            : 'opacity-1 hover:bg-black-800 rounded-full flex items-center justify-center p-6 duration-300 transition-colors'
                    }
                    onClick={() => {
                        props.onClickBack?.()
                    }}>
                    <IoChevronBackSharp class="w-[18px] h-[18px] text-lightBlue-300" />
                </DefaultButton>
                <Show when={typeof props.onClickSettings !== 'undefined'}>
                    <DefaultButton
                        class="opacity-1 hover:bg-black-800 rounded-full flex items-center justify-center p-6 duration-300 transition-colors"
                        onClick={() => {
                            props.onClickSettings?.()
                        }}>
                        <VsSettings class="w-16 h-16 text-lightBlue-300" />
                    </DefaultButton>
                </Show>
            </div>
            <div class="w-full flex-1 flex items-center justify-center gap-24 flex-col">
                <div
                    class={classNames(
                        'flex items-center justify-center w-[100px] h-[100px] rounded-full ',
                        props.status === 'fail'
                            ? 'bg-red-200/20'
                            : props.status === 'success'
                              ? 'bg-purple-200'
                              : 'bg-black-800',
                    )}>
                    <Show
                        when={props.isLoader}
                        fallback={
                            <props.icon
                                class={classNames(
                                    'w-[52px] h-[52px]',
                                    props.status === 'fail'
                                        ? 'text-red-200'
                                        : props.status === 'success'
                                          ? 'text-black-900'
                                          : 'text-lightBlue-300',
                                    props.isLoader && 'animate-fast-rotate',
                                )}
                            />
                        }>
                        <span class="loading loading-spinner  w-[48px] h-[48px] text-lightBlue-300" />
                    </Show>
                </div>
                <div class="flex flex-row  gap-12">
                    <Typography color="white" text="h1">
                        {props.label}
                    </Typography>
                    <Show when={props.percentageProgress}>
                        <Typography color="purple" text="h1" class="w-[80px] text-center">
                            {props.percentageProgress}%
                        </Typography>
                    </Show>
                </div>
                <Show when={props.description}>
                    <Typography color="white" text="caption">
                        {props.description}
                    </Typography>
                </Show>
                {props.children}
            </div>
            <div class="flex flex-row gap-12 w-full">
                <Show when={typeof props.onClickSecondary !== 'undefined'}>
                    <Button
                        label={props.secondaryButtonLabel ?? '--'}
                        onClick={props.onClickSecondary}
                    />
                </Show>
                <Show when={typeof props.onClickOption !== 'undefined'}>
                    <Button
                        label={props.onClickOptionLabel ?? '--'}
                        onClick={props.onClickOption}
                    />
                </Show>
                <Show when={typeof props.onClickPrimary !== 'undefined'}>
                    <PrimaryButton
                        label={props.primaryButtonLabel ?? '--'}
                        onClick={props.onClickPrimary}
                        isActive={props.isActive}
                        disabled={!props.isActive}
                    />
                </Show>
            </div>
        </div>
    )
}

export default Card
