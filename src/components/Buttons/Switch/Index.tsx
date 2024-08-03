import { Component } from 'solid-js'

export interface IProps {
    onClickToggle: () => void
    isToggle: boolean
}

export const Switch: Component<IProps> = (props) => {
    return (
        <div
            onMouseDown={() => {
                props.onClickToggle()
            }}
            classList={{
                'bg-[#233649]': !props.isToggle,
                'bg-[#817DF7]': props.isToggle,
            }}
            class="flex items-center justify-center rounded-full w-[55px] h-[24px] transition-all duration-200 relative z-10 cursor-pointer border-solid border-[1px] border-[#233649]">
            <div
                classList={{
                    'left-[4px]': !props.isToggle,
                    'left-[34px]': props.isToggle,
                }}
                class="z-20 flex w-[16px] top-[3px] h-[16px] transition-all duration-[300ms] rounded-full bg-white absolute"
            />
        </div>
    )
}
