import { type ParentComponent } from 'solid-js'
import { type IEventType } from '@interfaces/types'
import { classNames } from '@src/utils'

export interface IProps {
    onFocusOut?: (event: IEventType) => void
    styles?: string
}

const Dropdown: ParentComponent<IProps> = (props) => {
    return (
        <div
            class={classNames(props.styles, 'dropdown w-full flex gap-[12px] flex-col')}
            onFocusOut={(el) => props.onFocusOut?.(el)}>
            {props.children}
        </div>
    )
}

export default Dropdown
