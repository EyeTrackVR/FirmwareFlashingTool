import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork'))
const BoardConfigurator = lazy(() => import('@containers/ManageBoard'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const FlashWizard = lazy(() => import('@containers/FlashWizard'))

export const routes: RouteDefinition[] = [
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/network', component: NetworkConfigurator },
    { path: '/', component: FlashWizard },
    { path: '**', component: page404 },
]
