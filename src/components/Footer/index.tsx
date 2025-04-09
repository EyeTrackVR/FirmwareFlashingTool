import { Button } from '@components/Buttons/Button'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import { classNames } from '@src/utils'
import { Component, Show } from 'solid-js'

export interface IProps {
    onClickSecondaryButton?: () => void
    onClickPrimaryButton?: () => void
    secondaryButtonType?: 'submit' | 'reset' | 'button' | undefined
    primaryButtonType?: 'submit' | 'reset' | 'button' | undefined
    isSecondaryButtonActive?: boolean
    isPrimaryButtonDisabled?: boolean
    isPrimaryButtonActive?: boolean
    secondaryButtonLabel?: string
    primaryButtonLabel?: string
}

export const Footer: Component<IProps> = (props) => {
    return (
        <footer class={classNames('flex w-full justify-end gap-12')}>
            <Show when={props.onClickSecondaryButton}>
                <Button
                    isActive={props.isSecondaryButtonActive}
                    onClick={props.onClickSecondaryButton}
                    type={props.secondaryButtonType}
                    label={props.secondaryButtonLabel ?? '--'}
                />
            </Show>
            <Show when={props.onClickPrimaryButton}>
                <PrimaryButton
                    disabled={props.isPrimaryButtonDisabled}
                    type={props.primaryButtonType}
                    isActive={props.isPrimaryButtonActive}
                    onClick={props.onClickPrimaryButton}
                    label={props.primaryButtonLabel ?? '--'}
                />
            </Show>
        </footer>
    )
}
