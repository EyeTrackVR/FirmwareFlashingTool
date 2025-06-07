import { Component, createSignal, onCleanup, Show } from 'solid-js'
export interface IProps {
    streamSource: string
    fallbackImage?: string
}

const Camera: Component<IProps> = (props) => {
    const [retryCount, setRetryCount] = createSignal(0)
    const [loading, setLoading] = createSignal(true)
    const [error, setError] = createSignal(false)
    const RETRY_DELAY = 2000
    const MAX_RETRIES = 10

    let retryTimer: number
    let imgRef: HTMLImageElement | undefined

    const handleError = () => {
        if (retryCount() < MAX_RETRIES) {
            retryTimer = setTimeout(() => {
                const newSrc = props.streamSource
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
        <div class="w-full h-full bg-gray-100">
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
                src={props.streamSource}
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
