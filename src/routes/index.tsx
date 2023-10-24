import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const AppSettings = lazy(() => import('@pages/AppSettings'))
const page404 = lazy(() => import('@pages/[...404]'))

export const routes: RouteDefinition[] = [
    { path: '/', component: AppSettings },
    { path: '**', component: page404 },
]
