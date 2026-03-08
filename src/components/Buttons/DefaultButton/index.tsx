import { ParentComponent } from 'solid-js'

export interface IProps {
    class?: string
    onClick: () => void
}

const DefaultButton: ParentComponent<IProps> = (props) => {
    return (
        <button
            class={props.class}
            onClick={(e) => {
                e.preventDefault()
                props.onClick()
            }}>
            {props.children}
        </button>
    )
}

export default DefaultButton
