import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const BoardConfigurator = lazy(() => import('@containers/ManageBoard/ManageBoard'))
const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork/ManageNetwork'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const Home = lazy(() => import('@containers/Home/Index'))

export const routes: RouteDefinition[] = [
    { path: '/', component: BoardConfigurator },
    { path: '/network', component: NetworkConfigurator },
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/home', component: Home },
    { path: '**', component: page404 },
]
