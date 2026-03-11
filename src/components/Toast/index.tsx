import DefaultButton from '@components/Buttons/DefaultButton'
import ProgressBar from '@components/ProgressBar'
import Typography from '@components/Typography'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { IToast } from '@interfaces/notifications/interfaces'
import theme from '@src/common/theme'
import {
    AiOutlineCheckCircle,
    AiOutlineClose,
    AiOutlineInfoCircle,
    AiTwotoneWarning,
} from 'solid-icons/ai'
import {
    Accessor,
    Component,
    createEffect,
    createMemo,
    createSignal,
    JSX,
    onCleanup,
    onMount,
    Show,
} from 'solid-js'

interface IProps {
    toast: IToast
    index: number
    total: number
    hovering: boolean
    onStartRemoving: (id: number) => void
    dismiss: (id: number) => void
}

const Toast: Component<IProps> = (props) => {
    const [removing, setRemoving] = createSignal(false)
    const [mounted, setMounted] = createSignal(false)

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

    const outerTransform = createMemo(() => {
        const scale = props.hovering ? 1 : 1 - props.index * 0.042
        const translateY = props.hovering ? props.index * multiplier() : props.index * 10

        if (removing()) {
            return `translateY(calc(-100% - 32px)) scale(${scale})`
        }
        if (!mounted()) {
            return `translateY(calc(-100% - 12px)) scale(${scale}) translateX(0px)`
        }
        return `translateY(${translateY}px) scale(${scale}) translateX(${0}px)`
    })

    const outerOpacity = createMemo(() => {
        if (removing()) return '0'
        if (!mounted()) return '0'
        if (props.hovering && props.index <= 5) return '1'
        return String(props.index >= 4 ? 0 : 1 - props.index * 0.13)
    })

    const outerTransition = createMemo(() => {
        if (removing()) {
            return 'transform 0.34s cubic-bezier(0.4, 0, 1, 1), opacity 0.26s ease'
        }
        return 'transform 0.42s cubic-bezier(0.25, 1.0, 0.5, 1), opacity 0.34s ease'
    })

    const icon: Accessor<Record<NOTIFICATION_TYPE, JSX.Element>> = createMemo(() => {
        return {
            [NOTIFICATION_TYPE.SUCCESS]: <AiOutlineCheckCircle color={'#fff'} />,
            [NOTIFICATION_TYPE.DEFAULT]: <AiOutlineInfoCircle color={'#fff'} />,
            [NOTIFICATION_TYPE.WARNING]: <AiTwotoneWarning color={'#fff'} />,
            [NOTIFICATION_TYPE.INFO]: <AiOutlineInfoCircle color={'#fff'} />,
            [NOTIFICATION_TYPE.ERROR]: <AiTwotoneWarning color={'#fff'} />,
        }
    })

    return (
        <div
            class="absolute top-24 left-0 w-[400px]"
            style={{
                transform: outerTransform(),
                opacity: outerOpacity(),
                transition: outerTransition(),
                'z-index': String(props.total - props.index),
                'will-change': 'transform, opacity',
            }}>
            <div class="relative bg-black-900 border border-black-800 rounded-14 px-14 pt-14 pb-16 overflow-hidden backdrop-blur-md select-none">
                <div class="flex flex-row w-full justify-start gap-12">
                    <div class="flex items-center justify-center">{icon()[props.toast.type]}</div>
                    <div class="flex flex-row w-full justify-between">
                        <div class="flex flex-col items-start justify-center gap-12">
                            <Typography color="white" text="caption" class="text-left">
                                {props.toast.message}
                            </Typography>
                            <Show when={props.toast.description}>
                                <Typography color="white" text="caption" class="text-left">
                                    {props.toast.description}
                                </Typography>
                            </Show>
                        </div>
                    </div>
                    <div class="flex items-center justify-center">
                        <DefaultButton onClick={removeToast}>
                            <AiOutlineClose />
                        </DefaultButton>
                    </div>
                </div>
                <ProgressBar
                    duration={props.toast.duration}
                    color={theme.colors.transparentPurple[100]}
                    paused={props.hovering}
                />
            </div>
        </div>
    )
}

export default Toast
