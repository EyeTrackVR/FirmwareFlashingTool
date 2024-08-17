import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
}

const AddCameraCard: Component<IProps> = (props) => {
    return (
        <div
            onClick={() => {
                props.onClick()
            }}
            class="flex items-center justify-center rounded-[9px] cursor-pointer w-[219px] bg-[#0D1B26] hover:bg-[#132838] border border-solid border-[#192736]">
            <svg
                fill="#3A5E82"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="65px"
                width="65px"
                style={{ overflow: 'visible', color: '#3A5E82' }}>
                <path
                    fill="none"
                    stroke="#3A5E82"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="52"
                    d="M256 112 256 400"
                />
                <path
                    fill="none"
                    stroke="#3A5E82"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="52"
                    d="M400 256 112 256"
                />
            </svg>
        </div>
    )
}

export default AddCameraCard
