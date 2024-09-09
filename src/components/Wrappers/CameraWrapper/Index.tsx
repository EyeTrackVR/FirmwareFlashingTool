import { type IconTypes } from 'solid-icons'
import { ParentComponent } from 'solid-js'
import { ICameraStatistics } from '@interfaces/interfaces'

export interface IProps {
    cameraStatistics: ICameraStatistics
    header: string
    description?: string
    cameraAddress: string
    HeaderIcon: IconTypes
}

const CameraWrapper: ParentComponent<IProps> = (props) => {
    return (
        <div class="w-full bg-[#0D1B26] p-[24px] rounded-[12px] flex flex-col gap-[14px] border border-solid border-[#192736]">
            <div class="flex items-center justify-start gap-[12px]">
                <div class="p-[10px] bg-[#9092FF] rounded-[9px]">
                    <props.HeaderIcon size={20} color="#fff" />
                </div>
                <div class="flex flex-row justify-between w-full">
                    <div class="flex flex-col h-full gap-[4px] justify-center">
                        <p class=" font-normal text-white leading-[16px] not-italic text-left select-none break-all text-[16px] max-[1200px]:text-[14px]">
                            {props.header}
                        </p>
                        <p class="text-[12px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                            {props.cameraAddress}
                        </p>
                    </div>
                    <div class="flex flex-row h-full gap-[12px] justify-center">
                        <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                            Mode: {props.cameraStatistics.mode}
                        </p>
                        <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                            {props.cameraStatistics.fps} Fps {props.cameraStatistics.latency}ms
                        </p>
                        <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                            {props.cameraStatistics.mbps} Mbps
                        </p>
                    </div>
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default CameraWrapper
