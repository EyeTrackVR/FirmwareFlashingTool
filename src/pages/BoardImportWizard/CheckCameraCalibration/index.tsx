import CameraPanel from '@components/Camera/CameraPanel'
import Typography from '@components/Typography'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { Component } from 'solid-js'

export interface IProps {
    trackerStream: Record<TRACKER_POSITION, string>
    rightTrackerLabel: string
    leftTrackerLabel: string
    rightTrackerAddress: string
    leftTrackerAddress: string
}

const CheckCameraCalibration: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col gap-24 items-start w-full min-h-[500px] ">
            <div class="flex flex-col gap-24 items-start w-full">
                <Typography color="lightGrey" text="h3">
                    Check camera calibration
                </Typography>
                <div class="flex flex-row items-center justify-center gap gap-24">
                    <div class="flex flex-col gap-12">
                        <Typography color="white" text="body" class="text-left">
                            Left camera
                        </Typography>
                        <CameraPanel
                            streamSource={props.trackerStream[TRACKER_POSITION.LEFT_EYE]}
                            cameraStatus={CONNECTION_STATUS.INACTIVE}
                            label={props.leftTrackerLabel}
                            address={props.leftTrackerAddress}
                        />
                    </div>
                    <div class="flex flex-col gap-12">
                        <Typography color="white" text="body" class="text-left">
                            right camera
                        </Typography>
                        <CameraPanel
                            streamSource={props.trackerStream[TRACKER_POSITION.RIGHT_EYE]}
                            cameraStatus={CONNECTION_STATUS.INACTIVE}
                            label={props.rightTrackerLabel}
                            address={props.rightTrackerAddress}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckCameraCalibration
