import type { RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const FlashWizard = lazy(() => import('@containers/FlashWizard'))

export const routes: RouteDefinition[] = [
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/', component: FlashWizard },
    { path: '**', component: page404 },
]
