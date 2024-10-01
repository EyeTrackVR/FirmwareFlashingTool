import { Toaster, ToasterStore, Transition, useToaster } from 'solid-headless'
import { createEffect, createSignal, For, onCleanup } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import CustomToast from './CustomToast'
import { Notifications } from '@src/static/types/interfaces'
import { useAppNotificationsContext } from '@store/notifications/notifications'

const ToastNotificationWindow = () => {
    const { getNotifications, getEnableNotifications } = useAppNotificationsContext()
    const notifs = useToaster(getNotifications() as ToasterStore<Notifications>)
    const [isOpen, setIsOpen] = createSignal(false)
    const closeNotifs = () => {
        setIsOpen(false)
    }
    const clearNotifs = () => {
        getNotifications()?.clear()
    }
    createEffect(() => {
        if (getEnableNotifications()) {
            if (notifs().length > 0) {
                debug(`[Notifications]: Notifications Added - ${notifs().length}`)
                setIsOpen(true)
            }
            const timeout = setTimeout(() => {
                closeNotifs()
                debug('[Notifications] Closed - Cleaned up')
            }, 5000)
            onCleanup(() => {
                clearTimeout(timeout)
            })
        }
    })
    return (
        <Toaster class="absolute p-2 fixed-0 right-0 bottom-0 z-10">
            <Transition
                show={isOpen()}
                class="relative transition"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-50 translate-y-full"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-50  translate-y-full"
                afterLeave={clearNotifs}>
                <div class="flex-1 flex flex-col-reverse space-y-reverse space-y-1 overflow-y-hidden overflow-x-hidden rounded-lg">
                    <For each={notifs().slice(0).reverse()}>
                        {(item) => {
                            debug(`[Notifications]: Rendering - ${item.id}`)
                            return <CustomToast id={item.id} notif={item.data} />
                        }}
                    </For>
                </div>
            </Transition>
        </Toaster>
    )
}

export default ToastNotificationWindow
