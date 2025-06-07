import { ToggleButton } from '@components/Buttons/ToggleButton'
import Camera from '@components/Camera/Camera'
import CameraPanel from '@components/Camera/CameraPanel'
import CameraRotationPanel from '@components/Camera/CameraRotationPanel'
import DashboardHeader from '@components/DashboardHeader'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { STREAM_TOGGLE_FLIP } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import theme from '@src/common/theme'
import { Canvas, IBoxPosition } from '@src/Services/canvas'
import { VsSettings } from 'solid-icons/vs'
import { Component, createMemo, onCleanup, onMount } from 'solid-js'

export interface IProps {
    onRotateCamera: (tracker: TRACKER_POSITION, value: number, id: string) => void
    onClickToggle: (action: STREAM_TOGGLE_FLIP) => void
    onClickAdvancedSettings: () => void
    onClickStreamSettings: () => void
    onClickRecalibrate: () => void
    onClickRecenter: () => void
    setCanvasBoxPositions: (boxPosition: IBoxPosition, tracker: TRACKER_POSITION) => void
    flipAxis: Record<STREAM_TOGGLE_FLIP, boolean>
    trackers: Record<TRACKER_POSITION, ITracker>
    rotation: Record<TRACKER_POSITION, number>
    canvasBoxPositions: Record<TRACKER_POSITION, IBoxPosition>
    isStreamSettingsActive: boolean
}

const StreamSettings: Component<IProps> = (props) => {
    const leftTracker = createMemo(() => props.trackers[TRACKER_POSITION.LEFT_EYE])
    const rightTracker = createMemo(() => props.trackers[TRACKER_POSITION.RIGHT_EYE])
    let leftCanvas: HTMLCanvasElement | undefined
    let rightCanvas: HTMLCanvasElement | undefined

    onMount(() => {
        if (!leftCanvas) return
        const canvasLeft = new Canvas()
        canvasLeft.setCanvas(leftCanvas).onMouseUpComplete((el) => {
            props.setCanvasBoxPositions(el, TRACKER_POSITION.LEFT_EYE)
        })
        canvasLeft.setCanvasBoxPosition(props.canvasBoxPositions[TRACKER_POSITION.LEFT_EYE])
        onCleanup(() => canvasLeft.destroy())
    })

    onMount(() => {
        if (!rightCanvas) return
        const canvasRight = new Canvas()
        canvasRight
            .setCanvas(rightCanvas)
            .onMouseUpComplete((el) => props.setCanvasBoxPositions(el, TRACKER_POSITION.RIGHT_EYE))
        canvasRight.setCanvasBoxPosition(props.canvasBoxPositions[TRACKER_POSITION.RIGHT_EYE])
        onCleanup(() => canvasRight.destroy())
    })

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
                <div class="flex flex-col max-w-[1800px] gap-12 w-full">
                    <div class="flex flex-row gap-12 justify-center max-[1230px]:flex-col w-full">
                        <div class="flex flex-col gap-12 min-[1231px]:max-w-[600px] w-full  ">
                            <CameraPanel
                                styles="w-full!"
                                cameraStatus={CONNECTION_STATUS.INACTIVE}
                                {...leftTracker()}>
                                <div class="relative w-[480px] h-[480px]">
                                    <Camera streamSource={leftTracker().streamSource} />
                                    <canvas
                                        class="absolute rounded-12 top-0"
                                        ref={leftCanvas}
                                        width={480}
                                        height={480}
                                    />
                                </div>
                            </CameraPanel>
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
                        <div class="flex flex-col gap-12 min-[1231px]:max-w-[600px] w-full">
                            <CameraPanel
                                cameraStatus={CONNECTION_STATUS.INACTIVE}
                                {...rightTracker()}>
                                <div class="w-[480px] h-[480px]">
                                    <Camera streamSource={rightTracker().streamSource} />
                                    <canvas
                                        class="absolute top-0 rounded-12"
                                        ref={rightCanvas}
                                        width={480}
                                        height={480}
                                    />
                                </div>
                            </CameraPanel>
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
                    <div class="max-w-[1212px] w-full mx-auto">
                        <ContextWrapper
                            label="Lorem ipsum"
                            icon={VsSettings}
                            iconColor={theme.colors.white[100]}
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. ">
                            <div class="flex flex-row gap-24 w-full">
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton
                                        onToggle={() => {
                                            props.onClickToggle(STREAM_TOGGLE_FLIP.FLIP_X_AXIS)
                                        }}
                                        isToggled={props.flipAxis[STREAM_TOGGLE_FLIP.FLIP_X_AXIS]}
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        Flip x axis
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6 ">
                                    <ToggleButton
                                        onToggle={() => {
                                            props.onClickToggle(STREAM_TOGGLE_FLIP.FLIP_Y_AXIS)
                                        }}
                                        isToggled={props.flipAxis[STREAM_TOGGLE_FLIP.FLIP_Y_AXIS]}
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        Flip y axis
                                    </Typography>
                                </div>
                            </div>
                        </ContextWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StreamSettings
