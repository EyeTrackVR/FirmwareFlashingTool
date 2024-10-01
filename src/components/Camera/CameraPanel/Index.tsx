import { AiFillCamera } from 'solid-icons/ai'
import { Component } from 'solid-js'
import logo from '../../../../src-tauri/icons/Square310x310Logo.png'
import Counter from '@components/Counter/Index'
import CameraWrapper from '@components/Wrappers/CameraWrapper/Index'
import Wrapper from '@components/Wrappers/Wrapper/Index'
import { IBoard, IBoardStatistics } from '@interfaces/interfaces'

export interface IProps {
    camera?: IBoard
    cameraStatistics?: IBoardStatistics
    cameraRotation: number
    onClickIncrease: () => void
    onClickDecrease: () => void
    onInput: (value: string) => void
}

const CameraPanel: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col gap-[12px] w-full">
            <CameraWrapper
                cameraAddress={props?.camera?.address ?? '----'}
                header={props?.camera?.label ?? '----'}
                cameraStatistics={props.cameraStatistics}
                HeaderIcon={AiFillCamera}>
                <div class="flex gap-[12px] justify-center">
                    <div class="flex flex-col">
                        <img src={logo} alt="camera" class="w-[120px] h-[120px]" />
                        <img src={logo} alt="camera" class="w-[120px] h-[120px]" />
                    </div>
                    <img src={logo} alt="camera" class="w-[240px] h-[240px]" />
                </div>
            </CameraWrapper>
            <Wrapper
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                header="Camera settings"
                HeaderIcon={AiFillCamera}>
                <Counter
                    value={props.cameraRotation}
                    label="Rotation"
                    max={360}
                    min={0}
                    onClickDecrease={props.onClickDecrease}
                    onClickIncrease={props.onClickIncrease}
                    onInput={props.onInput}
                />
            </Wrapper>
        </div>
    )
}

export default CameraPanel
