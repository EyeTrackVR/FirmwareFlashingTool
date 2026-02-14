import { doGHRequest } from '@store/actions/firmware/doGHRequest'
import { channelMode } from '@store/firmware/selectors'
import { createEffect, on } from 'solid-js'

export const watchGHRequest = () => {
    createEffect(
        on(channelMode, (mode) => {
            doGHRequest(mode)
        }),
    )
}
