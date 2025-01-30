import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork'))
const BoardConfigurator = lazy(() => import('@containers/ManageBoard'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))

export const routes: RouteDefinition[] = [
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/network', component: NetworkConfigurator },
    { path: '/', component: BoardConfigurator },
    { path: '**', component: page404 },
]
