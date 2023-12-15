import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const BoardConfigurator = lazy(() => import('@containers/ManageBoard/ManageBoard'))
const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork/ManageNetwork'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))

export const routes: RouteDefinition[] = [
    { path: '/', component: NetworkConfigurator },
    { path: '/selectBoard', component: BoardConfigurator },
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '**', component: page404 },
]
