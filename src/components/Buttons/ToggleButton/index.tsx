import { Component } from 'solid-js'

export interface IProps {
    onToggle: () => void
    isToggled: boolean
}

export const ToggleButton: Component<IProps> = (props) => (
    <div
        onMouseDown={() => {
            props.onToggle()
        }}
        class="bg-grey-300 flex items-center justify-center rounded-20 w-[48px] h-[24px] transition-all duration-200 relative z-10 cursor-pointer"
        classList={{
            'bg-grey-300': !props.isToggled,
            'bg-purple-300': props.isToggled,
        }}>
        <div
            classList={{
                'left-[4px]': !props.isToggled,
                'left-[28px]': props.isToggled,
            }}
            class="z-20 flex w-[16px]  h-[16px] top-[4px]  transition-all duration-300 rounded-100 bg-white-100 absolute"
        />
    </div>
)
