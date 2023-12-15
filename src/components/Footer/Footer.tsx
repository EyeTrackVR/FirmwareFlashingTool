import { Component } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'

export interface IProps {
    onClickSecond: () => void
    onClickPrimary: () => void
    isPrimaryActive: boolean
    isSecondActive: boolean
    primaryLabel: string
    secondLabel: string
    primaryType?: 'submit' | 'reset' | 'button' | undefined
    secondType?: 'submit' | 'reset' | 'button' | undefined
}

export const Footer: Component<IProps> = (props) => {
    return (
        <div class="flex w-full pb-[24px] pr-[40px] pl-[40px] justify-end gap-[10px]">
            <Button
                isActive={false}
                type={props.secondType}
                label={props.secondLabel}
                onClick={props.onClickSecond}
            />
            <Button
                isActive={!props.isPrimaryActive}
                type={props.primaryType}
                label={props.primaryLabel}
                onClick={props.onClickPrimary}
            />
        </div>
    )
}
