import NavItem from '@components/NavItem'
import { AiFillHome } from 'solid-icons/ai'
import { BiSolidExtension } from 'solid-icons/bi'
import { IoSettingsSharp } from 'solid-icons/io'
import { Component, createMemo, For } from 'solid-js'

export interface IProps {
    onClick: (route: string) => void
    navigation: string
}

const Sidebar: Component<IProps> = (props) => {
    const navItems = createMemo(() => {
        return [
            {
                route: '/dashboard',
                icon: AiFillHome,
                label: 'Home',
            },
            {
                route: '/',
                icon: BiSolidExtension,
                label: 'Setup',
            },
        ]
    })

    return (
        <section class="flex flex-col justify-between pl-8 pr-24 pb-12 pt-8">
            <div class="flex flex-col gap-12">
                <For each={navItems()}>
                    {(item) => (
                        <NavItem
                            route={item.route}
                            currentRoute={props.navigation}
                            icon={item.icon}
                            label={item.label}
                            onClick={props.onClick}
                        />
                    )}
                </For>
            </div>
            <NavItem
                route="/generalSettings"
                currentRoute={props.navigation}
                icon={IoSettingsSharp}
                label="Settings"
                onClick={props.onClick}
            />
        </section>
    )
}

export default Sidebar
