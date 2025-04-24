import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const ConfigureBoardWizard = lazy(() => import('@containers/ConfigureBoardWizard'))
const BoardImportWizard = lazy(() => import('@containers/BoardImportWizard'))
const AdvancedSettings = lazy(() => import('@containers/AdvancedSettings'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const ManageNetwork = lazy(() => import('@containers/ManageNetwork'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const Dashboard = lazy(() => import('@containers/Dashboard'))
const Welcome = lazy(() => import('@containers/Welcome'))
const Settings = lazy(() => import('@containers/Settings'))

export const routes: RouteDefinition[] = [
    { path: '/configureBoardWizard', component: ConfigureBoardWizard },
    { path: '/boardImportWizard', component: BoardImportWizard },
    { path: '/advancedSettings', component: AdvancedSettings },
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/network', component: ManageNetwork },
    { path: '/dashboard', component: Dashboard },
    { path: '/settings', component: Settings },
    { path: '/', component: Welcome },
    { path: '**', component: page404 },
]
