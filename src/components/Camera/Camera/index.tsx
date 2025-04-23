import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { serverStatus } from '@store/ui/selectors' // something I'm not proud of but it works
import { Component, createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js'
export interface IProps {
    streamSource: string
    fallbackImage?: string
}

const Camera: Component<IProps> = (props) => {
    const [timestamp, setTimestamp] = createSignal(Date.now())
    const [retryCount, setRetryCount] = createSignal(0)
    const [loading, setLoading] = createSignal(true)
    const [error, setError] = createSignal(false)
    const RETRY_DELAY = 2000
    const MAX_RETRIES = 3

    let retryTimer: number
    let imgRef: HTMLImageElement | undefined

    createEffect(() => {
        if (!props.streamSource) return
        const intervalId = setInterval(() => {
            setTimestamp(Date.now())
        }, 3000)

        onCleanup(() => clearInterval(intervalId))
    })

    createEffect(() => {
        props.streamSource
        setLoading(true)
        setError(false)
        setRetryCount(0)
    })

    const src = createMemo(() => {
        return serverStatus() === CONNECTION_STATUS.DISCONNECTED
            ? ''
            : `${props.streamSource}?t=${timestamp()}`
    })

    const handleError = () => {
        if (retryCount() < MAX_RETRIES) {
            retryTimer = setTimeout(() => {
                const isDisconnected = serverStatus() === CONNECTION_STATUS.DISCONNECTED
                const newSrc = isDisconnected
                    ? ''
                    : `${props.streamSource}?retry=${retryCount()}&t=${Date.now()}`
                imgRef && (imgRef.src = newSrc)
                setRetryCount((c) => c + 1)
            }, RETRY_DELAY) as unknown as number
        } else {
            setError(true)
            setLoading(false)
        }
    }

    const handleLoad = () => {
        if (imgRef && (imgRef.naturalWidth === 0 || imgRef.naturalHeight === 0)) {
            handleError()
        } else {
            setLoading(false)
            setError(false)
        }
    }

    onCleanup(() => {
        clearTimeout(retryTimer)
        imgRef && (imgRef.onerror = imgRef.onload = null)
    })

    return (
        <div class="relative w-[240px] h-[240px] bg-gray-100">
            <Show when={loading()}>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="loading loading-ring w-[64px] h-[64px] bg-white-100" />
                </div>
            </Show>
            <Show when={error()}>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-gray-500">Camera feed unavailable</span>
                </div>
            </Show>
            <img
                ref={imgRef}
                alt="Camera feed"
                src={src()}
                onLoad={handleLoad}
                onError={handleError}
                class="object-cover w-full h-full"
                classList={{
                    hidden: loading() || error(),
                    'opacity-0': loading(),
                }}
            />
        </div>
    )
}

export default Camera
