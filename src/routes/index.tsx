import type { RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

const Terminal = lazy(() => import('@containers/Terminal'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const FlashWizard = lazy(() => import('@containers/FlashWizard'))

export const routes: RouteDefinition[] = [
    { path: '/terminal', component: Terminal },
    { path: '/', component: FlashWizard },
    { path: '**', component: page404 },
]
