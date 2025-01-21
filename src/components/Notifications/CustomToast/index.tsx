import Typography from '@components/Typography'
import { ENotificationType } from '@src/static/types/enums'
import type { Notifications } from '@src/static/types/interfaces'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import { Alert, Toast, Transition } from 'solid-headless'
import { AiOutlineCheckCircle } from 'solid-icons/ai'
import { FiAlertOctagon, FiAlertTriangle } from 'solid-icons/fi'
import { IoAlertCircleSharp, IoCloseSharp } from 'solid-icons/io'
import { Component, createSignal, Show } from 'solid-js'

interface ToastProps {
    id: string
    notif: Notifications
}

const CustomToast: Component<ToastProps> = (props) => {
    const [isOpen, setIsOpen] = createSignal(true)

    const { getNotifications } = useAppNotificationsContext()

    const dismiss = () => {
        setIsOpen(false)
    }

    return (
        <Transition
            show={isOpen()}
            class="relative transition rounded-lg bg-black-900"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-50"
            afterLeave={() => {
                getNotifications()?.remove(props.id)
            }}>
            <Toast class="flex justify-between items-center">
                <Alert class="bg-black-900 flex flex-row items-center gap-6 p-12 rounded-6 border border-solid border-black-800 max-w-[400px]">
                    <div>
                        <Show when={props.notif.type === ENotificationType.SUCCESS}>
                            <AiOutlineCheckCircle size={25} color="#68D391" />
                        </Show>
                        <Show when={props.notif.type === ENotificationType.ERROR}>
                            <FiAlertOctagon size={25} color="#F56565" />
                        </Show>
                        <Show when={props.notif.type === ENotificationType.WARNING}>
                            <FiAlertTriangle size={25} color="#F6E05E" />
                        </Show>
                        <Show when={props.notif.type === ENotificationType.INFO}>
                            <IoAlertCircleSharp size={25} color="#90CDF4" />
                        </Show>
                    </div>
                    <Typography color="white" text="small" ellipsis>
                        {props.notif.message}
                    </Typography>
                    <button
                        type="button"
                        class="rounded-100 w-16 h-16 focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-100 flex justify-center items-center"
                        onClick={dismiss}>
                        <IoCloseSharp size={16} />
                    </button>
                </Alert>
            </Toast>
        </Transition>
    )
}

export default CustomToast
