import { Component } from 'solid-js'

export interface IProps {
    checked: boolean
}

const Checkbox: Component<IProps> = (props) => {
    return (
        <div
            classList={{
                'bg-[#9793FD]': props.checked,
            }}
            class="w-[14px] h-[14px] border border-solid border-[#9793FD] rounded-[4px] "
        />
    )
}

export default Checkbox
