import Sidebar from '@components/Sidebar'
import { HeaderRoot } from '@containers/Header'
import { Router, useNavigate } from '@solidjs/router'
import { useAppAPIContext } from '@store/context/api'
import { setTrackers } from '@store/trackers/trackers'
import { createEffect, lazy, onMount, Show, type Component } from 'solid-js'
import { routes } from '.'
import { usePersistentStore } from '@src/Services/persistentStore'
const Modals = lazy(() => import('@containers/Modals'))

const AppRoutes: Component = () => {
    const { doGHRequest, channelMode } = useAppAPIContext()
    createEffect(() => {
        doGHRequest(channelMode())
    })

    return (
        <Router
            root={(data) => {
                const navigate = useNavigate()
                const { get } = usePersistentStore()

                onMount(() => {
                    get('trackers').then((data) => {
                        if (data) {
                            const trackers = data?.trackers ?? []
                            setTrackers(trackers)
                            if (trackers.length > 0) {
                                navigate('/dashboard')
                            }
                        }
                    })
                })

                return (
                    <div class="flex flex-col h-full">
                        <HeaderRoot />
                        <Modals />
                        <div class="flex h-full flex-row overflow-hidden">
                            <Show
                                when={['/dashboard', '/settings', '/advancedSettings'].includes(
                                    data.location.pathname,
                                )}>
                                <Sidebar
                                    navigation={data.location.pathname}
                                    onClick={(route) => {
                                        navigate(route)
                                    }}
                                />
                            </Show>
                            {data.children}
                        </div>
                    </div>
                )
            }}>
            {routes}
        </Router>
    )
}

export default AppRoutes
