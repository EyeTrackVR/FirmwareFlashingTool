import Button from '@components/Buttons/Button'
import { Component } from 'solid-js'

export interface IProps {
    onClickStreamSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    isStreamSettingsActive: boolean
}

const DashboardHeader: Component<IProps> = (props) => {
    return (
        <div class="flex w-full justify-between">
            <div class="gap-12 flex flex-row">
                <Button disabled label="Recenter" onClick={props.onClickRecenter} />
                <Button disabled label="Recalibrate" onClick={props.onClickRecalibrate} />
                <Button
                    label="Stream settings"
                    isActive={props.isStreamSettingsActive}
                    onClick={props.onClickStreamSettings}
                />
            </div>
        </div>
    )
}

export default DashboardHeader
