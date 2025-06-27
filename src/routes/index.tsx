import type { RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

const ConfigureBoardWizard = lazy(() => import('@containers/ConfigureBoardWizard'))
const BoardImportWizard = lazy(() => import('@containers/BoardImportWizard'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const ManageNetwork = lazy(() => import('@containers/ManageNetwork'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const Dashboard = lazy(() => import('@containers/Dashboard'))
const Welcome = lazy(() => import('@containers/Welcome'))
const GeneralSettings = lazy(() => import('@containers/Settings/GeneralSettings'))
const AlgorithmSelectionSettings = lazy(
    () => import('@containers/Settings/AlgorithmSelectionSettings'),
)
const AlgorithmTrackingSettings = lazy(
    () => import('@containers/Settings/AlgorithmTrackingSettings'),
)
const VrcftSettings = lazy(() => import('@containers/Settings/VrcftSettings'))
const OscSettings = lazy(() => import('@containers/Settings/OscSettings'))

export const DASHBOARD_ROUTES = ['/dashboard']
export const SETTINGS_ROUTES = [
    '/algorithmTrackingSettings',
    '/AlgorithmSelectionSettings',
    '/generalSettings',
    '/vrcftSettings',
    '/oscSettings',
]

export const routes: RouteDefinition[] = [
    { path: '/configureBoardWizard', component: ConfigureBoardWizard },
    { path: '/boardImportWizard', component: BoardImportWizard },
    { path: '/flashFirmware', component: FlashFirmware },
    { path: '/network', component: ManageNetwork },
    { path: '/dashboard', component: Dashboard },
    { path: '/algorithmTrackingSettings', component: AlgorithmTrackingSettings },
    { path: '/algorithmSelectionSettings', component: AlgorithmSelectionSettings },
    { path: '/generalSettings', component: GeneralSettings },
    { path: '/vrcftSettings', component: VrcftSettings },
    { path: '/oscSettings', component: OscSettings },

    { path: '**', component: page404 },
    { path: '/', component: Welcome },
]
