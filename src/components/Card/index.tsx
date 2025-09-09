import Button from '@components/Buttons/Button'
import DefaultButton from '@components/Buttons/DefaultButton'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import Typography from '@components/Typography'
import { IconTypes } from 'solid-icons'
import { IoChevronBackSharp } from 'solid-icons/io'
import { ParentComponent, Show } from 'solid-js'
import { VsSettings } from 'solid-icons/vs'

export interface IProps {
    onClickSettings?: () => void
    onClickBack?: () => void
    onClickSecondary?: () => void
    onClickPrimary?: () => void
    label: string
    icon: IconTypes
    description: string
    isActive: boolean
    primaryButtonLabel?: string
    secondaryButtonLabel?: string
}

const Card: ParentComponent<IProps> = (props) => {
    return (
        <div class="bg-black-900 flex p-12  rounded-12 flex-col items-center justify-between min-h-[480px] w-[420px]">
            <div class="flex flex-row w-full justify-between h-16">
                <DefaultButton
                    class={
                        typeof props.onClickBack === 'undefined'
                            ? 'opacity-0 cursor-default'
                            : 'opacity-1'
                    }
                    onClick={() => {
                        props.onClickBack?.()
                    }}>
                    <IoChevronBackSharp class="w-16 h-16 text-lightBlue-300" />
                </DefaultButton>
                <Show when={typeof props.onClickSettings !== 'undefined'}>
                    <DefaultButton onClick={() => props.onClickSettings?.()}>
                        <VsSettings class="w-16 h-16 text-lightBlue-300" />
                    </DefaultButton>
                </Show>
            </div>
            <div class="w-full flex-1 flex items-center justify-center gap-24 flex-col">
                <div class="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-black-800">
                    <props.icon class="w-[52px] h-[52px] text-lightBlue-300" />
                </div>
                <Typography color="white" text="h1">
                    {props.label}
                </Typography>
                <Typography color="white" text="caption">
                    {props.description}
                </Typography>
                {props.children}
            </div>
            <div class="flex flex-row gap-12 w-full">
                <Show when={typeof props.onClickSecondary !== 'undefined'}>
                    <Button
                        label={props.secondaryButtonLabel ?? '--'}
                        onClick={props.onClickSecondary}
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
