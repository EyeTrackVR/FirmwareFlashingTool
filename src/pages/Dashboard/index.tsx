import CameraPanel from '@components/Camera/CameraPanel'
import DashboardHeader from '@components/DashboardHeader'
import { IBoard } from '@interfaces/boards/interfaces'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    onClickAdvancedSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    boards: IBoard[]
}

const Dashboard: Component<IProps> = (props) => {
    const rightCamera = createMemo(() => {
        const camera = props.boards[0]

        if (!camera) {
            return { label: 'Right camera', address: '----' }
        }
        return camera
    })

    const leftCamera = createMemo(() => {
        const camera = props.boards[1]

        if (!camera) {
            return { label: 'Left camera', address: '----' }
        }
        return camera
    })

    return (
        <div class="flex w-full flex-col pt-8 pr-24 pb-8 gap-12">
            <DashboardHeader
                onClickAdvancedSettings={props.onClickAdvancedSettings}
                onClickRecalibrate={props.onClickRecalibrate}
                onClickRecenter={props.onClickRecenter}
            />
            <div class="flex flex-row gap-12 justify-center max-[1000px]:flex-col">
                <CameraPanel {...rightCamera()} />
                <CameraPanel {...leftCamera()} />
            </div>
        </div>
    )
}

export default Dashboard
