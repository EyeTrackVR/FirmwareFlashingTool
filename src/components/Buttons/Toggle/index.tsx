import { classNames } from '@src/utils'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
    active: boolean
}

const SwitchButton: Component<IProps> = (props) => {
    return (
        <label class="inline-flex items-center cursor-pointer group">
            <input
                type="checkbox"
                class={classNames('sr-only', props.active && 'peer')}
                checked={props.active}
                onChange={() => props.onClick()}
            />
            <div
                class="relative w-[40px] h-[20px] rounded-full transition-colors
                    bg-grey-200  
                    peer-checked:bg-purple-200
                    peer-checked:after:bg-white-100
                    after:bg-black-200
                    after:content-[''] after:absolute after:top-[3px] after:left-[3px] 
                    after:rounded-full after:h-[14px] after:w-[14px] 
                    after:transition-all 
                    peer-checked:after:translate-x-[20px]"
            />
        </label>
    )
}

export default SwitchButton
