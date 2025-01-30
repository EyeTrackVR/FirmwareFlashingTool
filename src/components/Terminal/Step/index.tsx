import Typography from '@components/Typography'
import { FLASH_STATUS } from '@interfaces/enums'
import { IFirmwareState } from '@interfaces/interfaces'
import theme from '@src/common/theme'
import { OcCheckcircle2, OcCircleslash2, OcX } from 'solid-icons/oc'
import { RiArrowsArrowDropRightLine } from 'solid-icons/ri'
import { Component, Show } from 'solid-js'

export interface IProps extends IFirmwareState {
    onMouseDown: () => void
    hasLogs: boolean
    open: boolean
    hover: boolean
    progress?: number
}

const Step: Component<IProps> = (props) => {
    return (
        <div class="flex w-full relative flex-col justify-start items-start gap-12">
            <div
                class="absolute top-0 left-0 bg-[#9092FF80] h-full transition-all duration-[250ms] ease-in-out rounded-6"
                style={{ width: `${props.progress}%` }}
            />
            <div
                onMouseDown={() => {
                    if (!props.hasLogs) return
                    props.onMouseDown()
                }}
                class="p-8 w-full pr-8 h-[44px] rounded-[6px] flex items-center justify-start gap-12"
                classList={{
                    'cursor-pointer': props.hasLogs,
                    'border border-solid border-[#00101C]': props.status !== FLASH_STATUS.FAILED,
                    'border border-solid border-[#FB7D89]': props.status === FLASH_STATUS.FAILED,
                    'bg-black-800': props.open && props.status !== FLASH_STATUS.FAILED,
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
                    <div class="p-[6px] rounded-100">
                        {props.status === FLASH_STATUS.SUCCESS ? (
                            <OcCheckcircle2 color={theme.colors.purple[300]} size={16} />
                        ) : props.status === FLASH_STATUS.FAILED ? (
                            <OcX color={theme.colors.red[200]} size={16} />
                        ) : props.status === FLASH_STATUS.ABORTED ? (
                            <OcCircleslash2 size={16} />
                        ) : (
                            <span class="loading loading-ring flex w-[16px]" />
                        )}
                    </div>
                </div>
                <div class="flex justify-between w-full">
                    <Typography color="white" text="caption">
                        {props.label}
                    </Typography>
                    <Show when={typeof props.progress !== 'undefined'}>
                        <Typography color="purple" text="caption">
                            {props.progress}%
                        </Typography>
                    </Show>
                </div>
            </div>
        </div>
    )
}

export default Step
