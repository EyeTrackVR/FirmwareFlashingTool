import { Component, createMemo, createSignal, Show } from 'solid-js'
import { SelectButton } from '@components/Buttons/SelectButton'
import CameraPanel from '@components/Camera/CameraPanel/Index'
import Dropdown from '@components/Dropdown/Dropdown/Index'
import DropdownList from '@components/Dropdown/DropdownList/Index'
import { Footer } from '@components/Footer/Footer'
import { BUTTON_ACTION, CAMERA_DIRECTION, HARDWARE_TYPE } from '@interfaces/enums'
import { ICamera, ICameraHardware, ICameraStatistics } from '@interfaces/interfaces'
import { actions } from '@src/static'

export interface IProps {
    setRotationValue: (cameraDiraction: CAMERA_DIRECTION, value: string) => void
    onClickAction: (action: BUTTON_ACTION) => void
    rightCameraStatistics: ICameraStatistics
    leftCameraStatistics: ICameraStatistics
    cameras: ICameraHardware[]
    rightCamera?: ICamera
    leftCamera?: ICamera
}

const Homepage: Component<IProps> = (props) => {
    const [rightCameraRotation, setRightCameraRotation] = createSignal<number>(0)
    const [leftCameraRotation, setLeftCameraRotation] = createSignal<number>(0)
    const [selectedCamera, setSelectedCamera] = createSignal<HARDWARE_TYPE>(HARDWARE_TYPE.BOTH)
    const [rotateActions, setRotateActions] = createSignal<boolean>(false)
    const [rotate, setRotate] = createSignal<boolean>(false)

    const activeCamera = createMemo(() => {
        if (selectedCamera() === HARDWARE_TYPE.BOTH && props.cameras.length === 1) {
            return props.cameras[0]
        }
        return props.cameras.find((camera) => camera.hardwareType === selectedCamera())
    })

    const showRightCamera = createMemo(() => {
        return typeof props.rightCamera !== 'undefined' && selectedCamera() !== HARDWARE_TYPE.LEFT
    })

    const showLeftCamera = createMemo(() => {
        return typeof props.leftCamera !== 'undefined' && selectedCamera() !== HARDWARE_TYPE.RIGHT
    })

    const closeModal = () => {
        const elem: Element | null = document.activeElement
        if (elem instanceof HTMLElement) {
            elem?.blur()
        }
    }

    return (
        <div class="flex flex-row gap-[24px] w-full py-[10px]">
            <div class="flex flex-col gap-[24px] items-start w-full">
                <div class="flex justify-between w-full gap-[12px]">
                    <div class="flex flex-col gap-[10px]">
                        <Dropdown
                            styles="w-auto"
                            onFocusOut={(event) => {
                                if (event.relatedTarget === null) {
                                    setRotate(false)
                                }
                            }}>
                            <SelectButton
                                styles="!bg-[#0D1B26] border-[#192736]"
                                label={activeCamera()?.label ?? HARDWARE_TYPE.BOTH}
                                rotate={rotate()}
                                connectionStatus={activeCamera()?.mode}
                                type="button"
                                tabIndex={0}
                                onClick={() => {
                                    if (rotate()) return
                                    setRotate(() => !rotate())
                                    setRotateActions(false)
                                }}
                            />
                            <DropdownList
                                styles="dropdown-content menu p-[12px] !top-[50px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] w-auto z-10"
                                activeElement={activeCamera()?.label ?? HARDWARE_TYPE.BOTH}
                                fallbackLabel="Searching..."
                                data={props.cameras}
                                disableStyles
                                onClick={(data) => {
                                    if (data.hardwareType) {
                                        setSelectedCamera(data.hardwareType)
                                        closeModal()
                                    }
                                }}
                            />
                        </Dropdown>
                    </div>
                    <div class="flex flex-row gap-[12px] max-[990px]:hidden">
                        <Footer
                            primaryLabel="Cropping mode"
                            isPrimaryActive={false}
                            onClickPrimary={() => {
                                props.onClickAction(BUTTON_ACTION.CROPPING_MODE)
                            }}
                        />
                        <Footer
                            secondLabel="Recalibrate"
                            primaryLabel="Recenter"
                            isPrimaryActive={true}
                            onClickPrimary={() => {
                                props.onClickAction(BUTTON_ACTION.CROPPING_MODE)
                            }}
                            onClickSecond={() => {
                                props.onClickAction(BUTTON_ACTION.RECALIBRATE_CAMERA)
                            }}
                        />
                    </div>
                    <div class="max-[992px]:visible min-[991px]:hidden">
                        <Dropdown
                            styles="w-[176px]"
                            onFocusOut={(event) => {
                                if (event.relatedTarget === null) {
                                    setRotateActions(false)
                                }
                            }}>
                            <SelectButton
                                styles="!bg-[#0D1B26] border-[#192736]"
                                rotate={rotateActions()}
                                label="Actions"
                                type="button"
                                tabIndex={1}
                                onClick={() => {
                                    if (rotateActions()) return
                                    setRotateActions(() => !rotateActions())
                                    setRotate(false)
                                }}
                            />
                            <DropdownList
                                styles="dropdown-content menu p-[12px] !top-[50px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] w-auto z-10"
                                fallbackLabel="Loading actions..."
                                data={actions}
                                disableStyles
                                onClick={(data) => {
                                    if (data.action) {
                                        props.onClickAction(data.action)
                                        closeModal()
                                    }
                                }}
                            />
                        </Dropdown>
                    </div>
                    <Footer
                        primaryLabel="Advanced settings"
                        isPrimaryActive={true}
                        onClickPrimary={() => {
                            props.onClickAction(BUTTON_ACTION.ADVANCED_SETTINGS)
                        }}
                    />
                </div>
                <div class="overflow-y-scroll scrollbar flex flex-col gap-[12px] max-w-[1600px] w-full mx-auto">
                    <div class="flex gap-[12px] max-[1200px]:flex-col justify-center">
                        <Show when={showLeftCamera()}>
                            <CameraPanel
                                cameraRotation={leftCameraRotation()}
                                cameraStatistics={props.leftCameraStatistics}
                                camera={props.leftCamera}
                                onClickDecrease={() => {
                                    setLeftCameraRotation((prev) => prev - 1)
                                }}
                                onClickIncrease={() => {
                                    setLeftCameraRotation((prev) => prev + 1)
                                }}
                                onInput={(value) => {
                                    props.setRotationValue(CAMERA_DIRECTION.LEFT, value)
                                    setLeftCameraRotation(+value)
                                }}
                            />
                        </Show>
                        <Show when={showRightCamera()}>
                            <CameraPanel
                                cameraRotation={rightCameraRotation()}
                                cameraStatistics={props.rightCameraStatistics}
                                camera={props.rightCamera}
                                onClickDecrease={() => {
                                    setRightCameraRotation((prev) => prev - 1)
                                }}
                                onClickIncrease={() => {
                                    setRightCameraRotation((prev) => prev + 1)
                                }}
                                onInput={(value) => {
                                    props.setRotationValue(CAMERA_DIRECTION.RIGHT, value)
                                    setRightCameraRotation(+value)
                                }}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage
