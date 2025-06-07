import Sidebar from '@components/Sidebar'
import { HeaderRoot } from '@containers/Header'
import { Router, useNavigate } from '@solidjs/router'
import { usePersistentStore } from '@src/Services/persistentStore'
import { useAppAPIContext } from '@store/context/api'
import { defaultRotation, setLoadRotation, setTrackers } from '@store/trackers/trackers'
import { createEffect, createMemo, lazy, onMount, Show, type Component } from 'solid-js'
import { routes } from './index'
import SettingsSidebar from '@components/Settings/SettingsSidebar'

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
                    get('rotation').then((data) => {
                        setLoadRotation(data?.rotation ?? defaultRotation)
                    })
                })

                const path = createMemo(() => {
                    const pathName = `/${data.location.pathname.split('/').filter((el) => !!el)[0]}`
                    if (pathName === '/TrackerDashboard') {
                        return '/dashboard'
                    }

                    return pathName
                })

                return (
                    <div class="flex flex-col h-full">
                        <HeaderRoot />
                        <Modals />
                        <div class="flex h-full flex-row overflow-hidden">
                            <Show
                                when={[
                                    '/advancedSettings',
                                    '/TrackerDashboard',
                                    '/dashboard',
                                ].includes(path())}>
                                <Sidebar
                                    navigation={path()}
                                    onClick={(route) => {
                                        navigate(route)
                                    }}
                                />
                            </Show>
                            <Show
                                when={[
                                    '/algorithmTrackingSettings',
                                    '/algorithmOrderSettings',
                                    '/generalSettings',
                                    '/vrcftSettings',
                                    '/oscSettings',
                                ].includes(path())}>
                                <SettingsSidebar
                                    navigation={path()}
                                    onClick={(path) => {
                                        navigate(path)
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
