import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { Component, JSX } from 'solid-js'

export interface IProps {
    route: string
    currentRoute: string
    icon: (props: { size: number; color: string }) => JSX.Element
    label: string
    onClick: (route: string) => void
}

export const NavItem: Component<IProps> = (props) => {
    const isActive = () => props.currentRoute === props.route

    return (
        <div
            class="cursor-pointer w-85 rounded-6 py-12 pb-12"
            onClick={() => props.onClick(props.route)}
            classList={{
                'hover:bg-blue-400 bg-blue-300 focus-visible:border-white-100': isActive(),
                'hover:bg-black-600': !isActive(),
            }}>
            <div class="flex flex-col justify-center items-center gap-12">
                {props.icon({
                    size: 34,
                    color: isActive() ? theme.colors.purple[300] : theme.colors.black[800],
                })}
                <Typography color="white" text="small">
                    {props.label}
                </Typography>
            </div>
        </div>
    )
}

export default NavItem
