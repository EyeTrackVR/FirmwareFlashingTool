import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'
import { NAVIGATION } from '@interfaces/enums'

const BoardConfigurator = lazy(() => import('@containers/ManageBoard/ManageBoard'))
const NetworkConfigurator = lazy(() => import('@containers/ManageNetwork/ManageNetwork'))
const FlashFirmware = lazy(() => import('@containers/FlashFirmware/FlashFirmware'))
const page404 = lazy(() => import('@containers/404/[...404]'))
const Home = lazy(() => import('@containers/Home/Index'))
const Welcome = lazy(() => import('@containers/Welcome/Index'))
const SetupEyeTrack = lazy(() => import('@containers/SetupWizard/Index'))

export const routes: RouteDefinition[] = [
    { path: NAVIGATION.CONFIGURE_SETUP, component: SetupEyeTrack },
    { path: NAVIGATION.CONFIGURE_BOARD, component: BoardConfigurator },
    { path: NAVIGATION.FLASH_FIRMWARE, component: FlashFirmware },
    { path: NAVIGATION.NETWORK, component: NetworkConfigurator },
    { path: NAVIGATION.PAGE_404, component: page404 },
    { path: NAVIGATION.WELCOME, component: Welcome },
    { path: NAVIGATION.HOME, component: Home },
]
