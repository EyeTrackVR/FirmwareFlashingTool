import { HeaderRoot } from '@containers/Header'
import { Router } from '@solidjs/router'
import { type Component } from 'solid-js'
import { routes } from '.'

const AppRoutes: Component = () => {
    return (
        <Router
            root={(data) => {
                return (
                    <div class="flex flex-col h-full">
                        <HeaderRoot />
                        <div class="flex h-full flex-col overflow-hidden">{data.children}</div>
                    </div>
                )
            }}>
            {routes}
        </Router>
    )
}

export default AppRoutes
