import { Component } from 'solid-js'
import { DropdownButton } from '@components/Buttons/DropdownButton/Index'
import Dropdown from '@components/Dropdown/Dropdown/Index'
import DropdownList from '@components/Dropdown/DropdownList/Index'
import { IDropdownList } from '@interfaces/interfaces'
import { classNames } from '@src/utils'

export interface IProps {
    onClick: (port: IDropdownList) => void
    label: string
    isScrollbar: boolean
    activeElement: string
    data: IDropdownList[]
    class?: string
}

const PortDropdown: Component<IProps> = (props) => {
    return (
        <Dropdown styles={classNames(props.class, 'dropdown dropdown-top')}>
            <DropdownButton label={props.label} />
            <DropdownList
                disableTop
                isScrollbar={props.isScrollbar}
                styles="dropdown-content menu w-auto !right-0 mb-[12px] !w-[350px]"
                fallbackLabel="Looking for ports..."
                activeElement={props.activeElement}
                data={props.data}
                tabIndex={0}
                onClick={props.onClick}
            />
        </Dropdown>
    )
}

export default PortDropdown
