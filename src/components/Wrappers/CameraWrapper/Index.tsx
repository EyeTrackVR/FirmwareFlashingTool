import { type IconTypes } from 'solid-icons'
import { ParentComponent, Show } from 'solid-js'
import { IBoardStatistics } from '@interfaces/interfaces'
import { shortAddress } from '@src/utils'

export interface IProps {
    cameraStatistics?: IBoardStatistics
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
                            {shortAddress(props.cameraAddress, 12)}
                        </p>
                    </div>
                    <Show when={typeof props.cameraStatistics !== 'undefined'}>
                        <div class="flex flex-row h-full gap-[12px] justify-center">
                            <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                                {`Mode: ${props?.cameraStatistics?.mode ?? '--'}`}
                            </p>
                            <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                                {`${props?.cameraStatistics?.fps ?? 0} Fps $
                                {props?.cameraStatistics?.latency ?? 0}ms`}
                            </p>
                            <p class="text-[14px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                                {`${props?.cameraStatistics?.mbps ?? 0} Mbps`}
                            </p>
                        </div>
                    </Show>
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default CameraWrapper
