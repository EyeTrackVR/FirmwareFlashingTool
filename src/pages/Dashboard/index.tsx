import Camera from '@components/Camera/Camera'
import CameraPanel from '@components/Camera/CameraPanel'
import DashboardHeader from '@components/DashboardHeader'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    onClickStreamSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    trackers: Record<TRACKER_POSITION, ITracker>
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
                <div class="flex flex-row gap-12 justify-center max-[1000px]:flex-col w-full max-w-[1800px] ">
                    <div class="min-[1001px]:max-w-[600px] w-full">
                        <CameraPanel cameraStatus={CONNECTION_STATUS.INACTIVE} {...leftTracker()}>
                            <div class="relative w-[240px] h-[240px] ">
                                <Camera streamSource={leftTracker().rawStreamSource} />
                            </div>
                        </CameraPanel>
                    </div>
                    <div class="min-[1001px]:max-w-[600px] w-full">
                        <CameraPanel cameraStatus={CONNECTION_STATUS.INACTIVE} {...rightTracker()}>
                            <div class="relative w-[240px] h-[240px]">
                                <Camera streamSource={rightTracker().rawStreamSource} />
                            </div>
                        </CameraPanel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
