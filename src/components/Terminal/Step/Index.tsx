import { OcCheckcircle2, OcX, OcCircleslash2 } from 'solid-icons/oc'
import { RiArrowsArrowDropRightLine } from 'solid-icons/ri'
import { Component, Show } from 'solid-js'
import { FLASH_STATUS } from '@interfaces/enums'
import { IFirmwareState } from '@interfaces/interfaces'
export interface IProps extends IFirmwareState {
    onMouseDown: () => void
    hasLogs: boolean
    open: boolean
    hover: boolean
    progress?: number
}

const Step: Component<IProps> = (props) => {
    return (
        <div class="flex w-full relative flex-col justify-start items-start gap-[12px]">
            <div
                class="absolute top-0 left-0 bg-[#9092FF80] h-full  transition-all duration-[250ms] ease-in-out rounded-[6px]"
                style={{ width: `${props.progress}%` }}
            />
            <div
                onMouseDown={() => {
                    if (!props.hasLogs) return
                    props.onMouseDown()
                }}
                class="p-[8px] w-full pr-[8px] h-[44px] rounded-[6px] flex items-center justify-start gap-[12px]  "
                classList={{
                    'cursor-pointer': props.hasLogs,
                    'border border-solid border-[#00101C]': props.status !== FLASH_STATUS.FAILED,
                    'border border-solid border-[#FB7D89]': props.status === FLASH_STATUS.FAILED,
                    'bg-[#192736]': props.open && props.status !== FLASH_STATUS.FAILED,
                    'bg-[#00101C]': !props.hover && !props.open,
                    'bg-[#FB7D8966]':
                        (props.hover || props.open) && props.status === FLASH_STATUS.FAILED,
                    'bg-[#19273666]':
                        props.hover && !props.open && props.status !== FLASH_STATUS.FAILED,
                }}>
                <div class="flex items-center">
                    <div class="w-[28px]">
                        <RiArrowsArrowDropRightLine
                            classList={{
                                hidden: !props.hasLogs,
                                'transform transition duration-150 ease-in-out rotate-90':
                                    props.open,
                                'transform transition duration-150 ease-in-out rotate-0':
                                    !props.open,
                            }}
                            color={props.status === FLASH_STATUS.FAILED ? '#fff' : '#526D82'}
                            size={28}
                        />
                    </div>
                    <div class="p-[6px] rounded-full">
                        {props.status === FLASH_STATUS.SUCCESS ? (
                            <OcCheckcircle2 color="#9092FF" size={16} />
                        ) : props.status === FLASH_STATUS.FAILED ? (
                            <OcX color="#FB7D89" size={16} />
                        ) : props.status === FLASH_STATUS.ABORTED ? (
                            <OcCircleslash2 size={16} />
                        ) : (
                            <span class="loading loading-ring flex w-[16px]" />
                        )}
                    </div>
                </div>
                <div class="flex justify-between w-full">
                    <p class="not-italic font-normal text-white leading-[14px] text-[14px] text-left">
                        {props.label}
                    </p>
                    <Show when={typeof props.progress !== 'undefined'}>
                        <p class="not-italic font-normal text-['#9092FF'] leading-[14px] text-[14px] text-left">
                            {props.progress}%
                        </p>
                    </Show>
                </div>
            </div>
        </div>
    )
}

export default Step
