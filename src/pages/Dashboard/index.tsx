import Camera from '@components/Camera/Camera'
import CameraPanel from '@components/Camera/CameraPanel'
import DashboardHeader from '@components/DashboardHeader'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    onRotateCamera: (tracker: TRACKER_POSITION, value: number, id: string) => void
    onClickAdvancedSettings: () => void
    onClickStreamSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    trackers: Record<TRACKER_POSITION, ITracker>
    rotation: Record<TRACKER_POSITION, number>
    isStreamSettingsActive: boolean
}

const Dashboard: Component<IProps> = (props) => {
    const leftTracker = createMemo(() => props.trackers[TRACKER_POSITION.LEFT_EYE])
    const rightTracker = createMemo(() => props.trackers[TRACKER_POSITION.RIGHT_EYE])

    return (
        <div class="flex flex-col h-full w-full pt-8 pb-12 gap-12">
            <div class="pr-24">
                <DashboardHeader
                    isStreamSettingsActive={props.isStreamSettingsActive}
                    onClickStreamSettings={props.onClickStreamSettings}
                    onClickRecalibrate={props.onClickRecalibrate}
                    onClickRecenter={props.onClickRecenter}
                />
            </div>

            <div class="flex-1 w-full flex flex-col items-center overflow-y-auto scrollbar pr-24">
                <div class="flex flex-row gap-12 justify-center max-[1000px]:flex-col w-full max-w-[1800px]">
                    <CameraPanel cameraStatus={CONNECTION_STATUS.INACTIVE} {...leftTracker()}>
                        <div class="relative w-[240px] h-[240px]">
                            <Camera streamSource={leftTracker().streamSource} />
                        </div>
                    </CameraPanel>
                    <CameraPanel cameraStatus={CONNECTION_STATUS.INACTIVE} {...rightTracker()}>
                        <div class="relative w-[240px] h-[240px]">
                            <Camera streamSource={rightTracker().streamSource} />
                        </div>
                    </CameraPanel>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
