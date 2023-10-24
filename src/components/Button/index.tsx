import './styles.css'

export interface Iprops {
    color: string
    onClick: () => void
    text: string
    shadow?: string
}

const Button = (props: Iprops) => {
    return (
        <button
            class="primary_btn"
            style={{ background: props.color, 'box-shadow': props.shadow }}
            onClick={() => props.onClick()}>
            {props.text}
        </button>
    )
}

export default Button
