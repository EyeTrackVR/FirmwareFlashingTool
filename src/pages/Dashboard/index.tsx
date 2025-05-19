import CameraPanel from '@components/Camera/CameraPanel'
import CameraRotationPanel from '@components/Camera/CameraRotationPanel'
import DashboardHeader from '@components/DashboardHeader'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    onClickTracker: (uuid: string) => void
    onClickAdvancedSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    onRotateCamera: (tracker: TRACKER_POSITION, value: number, id: string) => void
    trackers: Record<TRACKER_POSITION, ITracker>
    rotation: Record<TRACKER_POSITION, number>
}

const Dashboard: Component<IProps> = (props) => {
    const leftTracker = createMemo(() => props.trackers[TRACKER_POSITION.LEFT_EYE])
    const rightTracker = createMemo(() => props.trackers[TRACKER_POSITION.RIGHT_EYE])

    return (
        <div class="flex flex-col h-full w-full pt-8 pb-12 gap-12">
            <div class="pr-24">
                <DashboardHeader
                    onClickAdvancedSettings={props.onClickAdvancedSettings}
                    onClickRecalibrate={props.onClickRecalibrate}
                    onClickRecenter={props.onClickRecenter}
                />
            </div>
            <div class="flex-1 w-full flex flex-col items-center overflow-y-auto scrollbar pr-24">
                <div class="flex flex-row gap-12 justify-center max-[1000px]:flex-col w-full max-w-[1800px]">
                    <div class="flex flex-col gap-12">
                        <CameraPanel
                            cameraStatus={CONNECTION_STATUS.INACTIVE}
                            onClick={() => {
                                props.onClickTracker(leftTracker().id)
                            }}
                            {...leftTracker()}
                        />
                        <CameraRotationPanel
                            rotation={props.rotation[TRACKER_POSITION.LEFT_EYE]}
                            onChangeRotation={(value) => {
                                props.onRotateCamera(
                                    TRACKER_POSITION.LEFT_EYE,
                                    value,
                                    leftTracker().id,
                                )
                            }}
                        />
                    </div>
                    <div class="flex flex-col gap-12">
                        <CameraPanel
                            cameraStatus={CONNECTION_STATUS.INACTIVE}
                            onClick={() => {
                                props.onClickTracker(rightTracker().id)
                            }}
                            {...rightTracker()}
                        />
                        <CameraRotationPanel
                            rotation={props.rotation[TRACKER_POSITION.RIGHT_EYE]}
                            onChangeRotation={(value) => {
                                props.onRotateCamera(
                                    TRACKER_POSITION.RIGHT_EYE,
                                    value,
                                    rightTracker().id,
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
