import { MODAL_TYPE } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { useLocation } from '@solidjs/router'
import { DASHBOARD_ROUTES } from '@src/routes'
import { loadState } from '@store/trackers/actions'
import { serverStatus } from '@store/ui/selectors'
import { setActiveModal } from '@store/ui/ui'
import { createEffect, createMemo, on } from 'solid-js'

export const watchUserState = () => {
    const location = useLocation()

    const path = createMemo(() => {
        const pathName = `/${location.pathname.split('/').filter((el) => !!el)[0]}`
        return pathName
    })

    const shouldLoadState = createMemo(() => {
        return (
            serverStatus() === CONNECTION_STATUS.DISCONNECTED && DASHBOARD_ROUTES.includes(path())
        )
    })

    createEffect(
        on(shouldLoadState, () => {
            if (shouldLoadState()) {
                loadState().catch(() => {})
            } else {
                setActiveModal({ open: false, type: MODAL_TYPE.NONE })
            }
        }),
    )
}
