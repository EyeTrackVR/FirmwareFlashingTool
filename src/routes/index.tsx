import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork'))
const BoardConfigurator = lazy(() => import('@containers/ManageBoard'))
const BoardImportWizard = lazy(() => import('@containers/BoardImportWizard'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const Welcome = lazy(() => import('@containers/Welcome'))

export const routes: RouteDefinition[] = [
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/network', component: NetworkConfigurator },
    { path: '/configureBoard', component: BoardConfigurator },
    { path: '/boardImportWizard', component: BoardImportWizard },
    { path: '/', component: Welcome },
    { path: '**', component: page404 },
]
