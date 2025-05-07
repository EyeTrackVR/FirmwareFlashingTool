import Button from '@components/Buttons/Button'
import { Component } from 'solid-js'

export interface IProps {
    onClickAdvancedSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
}

const DashboardHeader: Component<IProps> = (props) => {
    return (
        <div class="flex w-full justify-between">
            <div class="gap-12 flex flex-row">
                <Button disabled label="Recenter" onClick={props.onClickRecenter} />
                <Button disabled label="Recalibrate" onClick={props.onClickRecalibrate} />
            </div>
            <Button disabled label="Advanced settings" onClick={props.onClickAdvancedSettings} />
        </div>
    )
}

export default DashboardHeader
