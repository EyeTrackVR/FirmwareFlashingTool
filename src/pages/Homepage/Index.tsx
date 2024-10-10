import { Component, createMemo, createSignal, Show } from 'solid-js'
import { SelectButton } from '@components/Buttons/SelectButton'
import CameraPanel from '@components/Camera/CameraPanel/Index'
import Dropdown from '@components/Dropdown/Dropdown/Index'
import DropdownList from '@components/Dropdown/DropdownList/Index'
import { Footer } from '@components/Footer/Footer'
import { BUTTON_ACTION, TRACKER_TYPE, HARDWARE_TYPE } from '@interfaces/enums'
import { IBoard, IBoardHardware, IBoardStatistics } from '@interfaces/interfaces'
import { actions } from '@src/static'
import { shortAddress } from '@src/utils'

export interface IProps {
    setRotationValue: (trackerType: TRACKER_TYPE, value: string) => void
    onClickAction: (action: BUTTON_ACTION) => void
    rightCameraStatistics?: IBoardStatistics
    leftCameraStatistics?: IBoardStatistics
    data: IBoardHardware[]
    rightCamera?: IBoard
    leftCamera?: IBoard
}

const Homepage: Component<IProps> = (props) => {
    const [selectedCamera, setSelectedCamera] = createSignal<HARDWARE_TYPE | undefined>(undefined)
    const [rightCameraRotation, setRightCameraRotation] = createSignal<number>(0)
    const [leftCameraRotation, setLeftCameraRotation] = createSignal<number>(0)
    const [rotateActions, setRotateActions] = createSignal<boolean>(false)
    const [rotate, setRotate] = createSignal<boolean>(false)

    const closeModal = () => {
        const elem: Element | null = document.activeElement
        if (elem instanceof HTMLElement) {
            elem?.blur()
        }
    }

    const activeCamera = createMemo(() => {
        if (typeof selectedCamera() === 'undefined' && props.data.length > 0) {
            return props.data[0]
        }
        return props.data.find((cam) => cam.hardwareType === selectedCamera())
    })

    const showLeftCamera = createMemo(() => {
        const data = activeCamera()
        if (!data) return false

        return (
            (data.hardwareType === HARDWARE_TYPE.BOTH ||
                data.hardwareType === HARDWARE_TYPE.LEFT) &&
            typeof props.leftCamera !== 'undefined'
        )
    })

    const showRightCamera = createMemo(() => {
        const data = activeCamera()
        if (!data) return false
        return (
            (data.hardwareType === HARDWARE_TYPE.BOTH ||
                data.hardwareType === HARDWARE_TYPE.RIGHT) &&
            typeof props.rightCamera !== 'undefined'
        )
    })

    const dropdownList = createMemo(() => {
        return props.data.map((data) => {
            return { ...data, description: shortAddress(data.address, 12) }
        })
    })

    return (
        <div class="flex flex-row gap-6 w-full py-2.5">
            <div class="flex flex-col gap-6 items-start w-full">
                <div class="flex justify-between gap-3">
                    <Show when={props.data.length > 0}>
                        <Dropdown
                            styles="w-auto"
                            onFocusOut={(event) => {
                                if (event.relatedTarget === null) setRotate(false)
                            }}>
                            <SelectButton
                                styles="!bg-[#0D1B26] border-[#192736]"
                                label={activeCamera()?.label ?? 'Select camera'}
                                rotate={rotate()}
                                connectionStatus={activeCamera()?.mode}
                                type="button"
                                tabIndex={0}
                                onClick={() => {
                                    if (rotate()) return
                                    setRotate((prev) => !prev)
                                }}
                            />
                            <DropdownList
                                styles="dropdown-content menu p-3 !top-[50px] rounded-xl border border-solid border-[#192736] bg-[#0D1B26] w-auto z-10 !whitespace-nowrap"
                                activeElement={activeCamera()?.hardwareType}
                                fallbackLabel="Searching..."
                                data={dropdownList()}
                                disableStyles
                                onClick={(data) => {
                                    if (data.hardwareType) {
                                        setSelectedCamera(data.hardwareType)
                                        closeModal()
                                    }
                                }}
                            />
                        </Dropdown>
                    </Show>

                    <div class="flex flex-row gap-3 max-[1100px]:hidden">
                        <Footer
                            primaryLabel="Cropping mode"
                            isPrimaryActive={false}
                            onClickPrimary={() => props.onClickAction(BUTTON_ACTION.CROPPING_MODE)}
                        />
                        <Footer
                            secondLabel="Recalibrate"
                            primaryLabel="Recenter"
                            isPrimaryActive={true}
                            onClickPrimary={() => props.onClickAction(BUTTON_ACTION.CROPPING_MODE)}
                            onClickSecond={() =>
                                props.onClickAction(BUTTON_ACTION.RECALIBRATE_CAMERA)
                            }
                        />
                    </div>

                    <div class="max-[1100px]:visible min-[1101px]:hidden">
                        <Dropdown
                            styles="w-[176px]"
                            onFocusOut={(event) => {
                                if (event.relatedTarget === null) setRotateActions(false)
                            }}>
                            <SelectButton
                                styles="!bg-[#0D1B26] border-[#192736]"
                                rotate={rotateActions()}
                                label="Actions"
                                type="button"
                                tabIndex={1}
                                onClick={() => {
                                    if (rotateActions()) return
                                    setRotateActions((prev) => !prev)
                                    setRotate(false)
                                }}
                            />
                            <DropdownList
                                styles="dropdown-content menu p-3 !top-[50px] rounded-xl border border-solid border-[#192736] bg-[#0D1B26] w-auto z-10 !whitespace-nowrap"
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
                        onClickPrimary={() => props.onClickAction(BUTTON_ACTION.ADVANCED_SETTINGS)}
                    />
                </div>

                <div class="overflow-y-scroll scrollbar flex flex-col gap-3 max-w-[1600px] w-full mx-auto">
                    <div class="flex gap-3 max-[1200px]:flex-col justify-center">
                        <Show when={showLeftCamera()}>
                            <CameraPanel
                                cameraRotation={leftCameraRotation()}
                                cameraStatistics={props.leftCameraStatistics}
                                camera={props.leftCamera}
                                onClickDecrease={() => setLeftCameraRotation((prev) => prev - 1)}
                                onClickIncrease={() => setLeftCameraRotation((prev) => prev + 1)}
                                onInput={(value) => {
                                    props.setRotationValue(TRACKER_TYPE.LEFT, value)
                                    setLeftCameraRotation(+value)
                                }}
                            />
                        </Show>
                        <Show when={showRightCamera()}>
                            <CameraPanel
                                cameraRotation={rightCameraRotation()}
                                cameraStatistics={props.rightCameraStatistics}
                                camera={props.rightCamera}
                                onClickDecrease={() => setRightCameraRotation((prev) => prev - 1)}
                                onClickIncrease={() => setRightCameraRotation((prev) => prev + 1)}
                                onInput={(value) => {
                                    props.setRotationValue(TRACKER_TYPE.RIGHT, value)
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
