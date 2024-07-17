import { Component, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { classNames } from '@src/utils'
export interface IProps {
    onClickSecond?: () => void
    onClickPrimary?: () => void
    isPrimaryActive?: boolean
    isSecondActive?: boolean
    primaryLabel?: string
    secondLabel?: string
    isPrimaryButtonDisabled?: boolean
    isSecondButtonDisabled?: boolean
    isLoadingPrimaryButton?: boolean
    size?: string
    primaryType?: 'submit' | 'reset' | 'button' | undefined
    secondType?: 'submit' | 'reset' | 'button' | undefined
    styles?: string
}

export const Footer: Component<IProps> = (props) => {
    return (
        <footer class={classNames(props.styles, 'flex w-full justify-end gap-[12px]')}>
            <Show when={props.onClickSecond}>
                <Button
                    disabled={props.isSecondButtonDisabled}
                    size={props.size}
                    isActive={props.isSecondActive}
                    type={props.secondType}
                    label={props.secondLabel ?? ''}
                    onClick={props.onClickSecond}
                />
            </Show>
            <Show when={props.onClickPrimary}>
                <Button
                    size={props.size}
                    disabled={props.isPrimaryButtonDisabled}
                    isLoadingPrimaryButton={props.isLoadingPrimaryButton}
                    isActive={!props.isPrimaryActive}
                    type={props.primaryType}
                    label={props.primaryLabel ?? ''}
                    onClick={props.onClickPrimary}
                />
            </Show>
        </footer>
    )
}
