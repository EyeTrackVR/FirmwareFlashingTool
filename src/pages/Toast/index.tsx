import DefaultButton from '@components/Buttons/DefaultButton'
import ProgressBar from '@components/ProgressBar'
import Typography from '@components/Typography'
import { IToast } from '@interfaces/notifications/interfaces'
import { AiOutlineCheckCircle, AiOutlineClose } from 'solid-icons/ai'
import {
    Component,
    createEffect,
    createMemo,
    createSignal,
    onCleanup,
    onMount,
    Show,
} from 'solid-js'

interface ToastComponentProps {
    toast: IToast
    index: number
    total: number
    hovering: boolean
    onStartRemoving: (id: number) => void
    dismiss: (id: number) => void
}

const Toast: Component<ToastComponentProps> = (props) => {
    const [removing, setRemoving] = createSignal(false)
    const [mounted, setMounted] = createSignal(false)

    const theme = createMemo(() => {
        return {
            bg: '#0d5c3a',
            border: '#1a8c59',
            icon: '#5deca0',
            text: '#e8fff4',
            sub: '#9de8c0',
            glow: 'rgba(29,174,100,0.35)',
        }
    })

    let timer: ReturnType<typeof setTimeout> | undefined
    let remaining = props.toast.duration
    let startTime = Date.now()

    onMount(() => {
        setTimeout(() => {
            setMounted(true)
        }, 20)
    })

    const removeToast = (): void => {
        setRemoving(true)
        props.onStartRemoving(props.toast.id)
        setTimeout(() => props.dismiss(props.toast.id), 340)
    }

    createEffect(() => {
        if (props.hovering) {
            clearTimeout(timer)
            remaining -= Date.now() - startTime
            return
        }

        timer = setTimeout(removeToast, remaining)
        startTime = Date.now()
        onCleanup(() => clearTimeout(timer))
    })

    const multiplier = createMemo(() => {
        if (props.toast.description) {
            return 75
        }
        return 55
    })

    const outerTransform = (): string => {
        const scale = props.hovering ? 1 : 1 - props.index * 0.042
        const translateY = props.hovering ? props.index * multiplier() : props.index * 10

        if (removing()) {
            return `translateY(calc(-100% - 32px)) scale(${scale})`
        }
        if (!mounted()) {
            return `translateY(calc(-100% - 12px)) scale(${scale}) translateX(0px)`
        }
        return `translateY(${translateY}px) scale(${scale}) translateX(${0}px)`
    }

    const outerOpacity = (): string => {
        if (removing()) return '0'
        if (!mounted()) return '0'
        if (props.hovering && props.index <= 5) return '1'
        return String(props.index >= 4 ? 0 : 1 - props.index * 0.13)
    }

    const outerTransition = (): string => {
        if (removing()) {
            return 'transform 0.34s cubic-bezier(0.4, 0, 1, 1), opacity 0.26s ease'
        }
        return 'transform 0.42s cubic-bezier(0.25, 1.0, 0.5, 1), opacity 0.34s ease'
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '360px',
                transform: outerTransform(),
                opacity: outerOpacity(),
                transition: outerTransition(),
                'z-index': String(props.total - props.index),
                'will-change': 'transform, opacity',
            }}>
            <div
                style={{
                    position: 'relative',
                    background: theme().bg,
                    border: `1px solid ${theme().border}`,
                    'border-radius': '13px',
                    padding: '13px 14px 16px',
                    overflow: 'hidden',
                    'backdrop-filter': 'blur(12px)',
                    'user-select': 'none',
                }}>
                <div class="flex flex-row w-full justify-start gap-12">
                    <div
                        style={{
                            'margin-top': '1px',
                            'flex-shrink': '0',
                            filter: `drop-shadow(0 0 6px ${theme().icon}90)`,
                        }}>
                        <AiOutlineCheckCircle color={theme().icon} />
                    </div>
                    <div class="flex flex-row w-full justify-between">
                        <div class="flex flex-col items-start justify-center ">
                            <Typography color="white" text="caption">
                                {props.toast.message}
                            </Typography>
                            <Show when={props.toast.description}>
                                <Typography color="white" text="caption" class="text-left">
                                    {props.toast.description}
                                </Typography>
                            </Show>
                        </div>
                        <DefaultButton onClick={removeToast}>
                            <AiOutlineClose />
                        </DefaultButton>
                    </div>
                </div>
                <ProgressBar
                    duration={props.toast.duration}
                    color={theme().icon}
                    paused={props.hovering}
                />
            </div>
        </div>
    )
}

export default Toast
