import { ParentComponent } from 'solid-js'

export interface IProps {
    onClick: () => void
}

const IconButton: ParentComponent<IProps> = (props) => {
    return (
        <div
            onClick={() => {
                props.onClick()
            }}
            class="rounded-[6px] hover:bg-[#30475e] bg-[#192736] p-[8px] cursor-pointer">
            {props.children}
        </div>
    )
}

export default IconButton
