import { AiFillCamera } from 'solid-icons/ai'
import { Component, createSignal, For } from 'solid-js'
import logo from '../../../src-tauri/icons/Square310x310Logo.png'
import AddCameraCard from '@components/Cards/AddCameraCard/Index'
import CameraCard from '@components/Cards/CameraCard/Index'
import Counter from '@components/Counter/Index'
import { Footer } from '@components/Footer/Footer'
import Wrapper from '@components/Wrapper/Index'
import { MODAL_TYPE } from '@interfaces/enums'
import { ICamera } from '@interfaces/interfaces'

export interface IProps {
    onClickCameraRotation: (rotation: number) => void
    onClickOpenModal: (modal: MODAL_TYPE) => void
    onClickCroppingMode: () => void
    cameras: ICamera[]
}

const Homepage: Component<IProps> = (props) => {
    const [rotation, setRotation] = createSignal<number>(0)

    return (
        <div class="flex flex-row gap-[24px] w-full py-[10px]">
            <div class="w-auto">
                <div class="flex flex-col gap-[12px] h-full overflow-y-scroll scrollbar w-auto">
                    <For each={props.cameras}>{(element) => <CameraCard {...element} />}</For>
                    <AddCameraCard
                        onClick={() => {
                            props.onClickOpenModal(MODAL_TYPE.ADD_NEW_CAMERA_ADDRESS)
                        }}
                    />
                </div>
            </div>
            <div class="flex flex-col gap-[24px] items-start w-full">
                <div class="flex justify-between w-full gap-[12px]">
                    <div class="flex flex-row gap-[12px]">
                        <Footer
                            primaryLabel="Cropping mode"
                            isPrimaryActive={false}
                            onClickPrimary={props.onClickCroppingMode}
                        />
                        <Footer
                            secondLabel="Recalibrate"
                            primaryLabel="Recenter"
                            isPrimaryActive={true}
                            onClickPrimary={() => {
                                props.onClickOpenModal(MODAL_TYPE.RECENTER_CAMERA)
                            }}
                            onClickSecond={() => {
                                props.onClickOpenModal(MODAL_TYPE.RECALIBRATE_CAMERA)
                            }}
                        />
                    </div>
                    <Footer
                        primaryLabel="Advanced settings"
                        isPrimaryActive={true}
                        onClickPrimary={() => {
                            props.onClickOpenModal(MODAL_TYPE.ADVANCED_SETTINGS)
                        }}
                    />
                </div>
                <div class="overflow-y-scroll scrollbar flex flex-col gap-[12px] w-full">
                    <div class="flex gap-[12px]">
                        <Wrapper
                            header="Camera preview"
                            HeaderIcon={AiFillCamera}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.">
                            <img src={logo} alt="camera" class="w-[240px] h-[240px] mx-auto" />
                        </Wrapper>
                        <Wrapper
                            header="Tracking preview"
                            HeaderIcon={AiFillCamera}
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.">
                            <img src={logo} alt="camera" class="w-[240px] h-[240px] mx-auto" />
                        </Wrapper>
                    </div>
                    <Wrapper
                        header="Camera settings"
                        HeaderIcon={AiFillCamera}
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.">
                        <Counter
                            label="Rotation"
                            onClickDecrease={() => {
                                if (rotation() <= 0) return
                                setRotation((prev) => prev - 1)
                                props.onClickCameraRotation(rotation())
                            }}
                            onClickIncrease={() => {
                                setRotation((prev) => prev + 1)
                                props.onClickCameraRotation(rotation())
                            }}
                            value={rotation().toString()}
                        />
                    </Wrapper>
                </div>
            </div>
        </div>
    )
}

export default Homepage
