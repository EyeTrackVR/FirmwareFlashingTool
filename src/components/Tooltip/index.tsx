import { ParentComponent } from 'solid-js'
import { AiFillQuestionCircle } from 'solid-icons/ai'
export interface IProps {
    description: string
}

const Tooltip: ParentComponent<IProps> = (props) => {
    return (
        <div class="flex items-center gap-6">
            <div class="tooltip tooltip-close tooltip-top" data-tip={props.description}>
                <AiFillQuestionCircle size={16} class="cursor-help" />
            </div>
            <div>{props.children}</div>
        </div>
    )
}

export default Tooltip
