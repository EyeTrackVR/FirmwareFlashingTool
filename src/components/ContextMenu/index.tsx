import { createEffect, Show, onMount, onCleanup, type Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { onClickOutside, useEventListener } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import type { NewMenu } from '@static/types/interfaces'
import { useAppUIContext } from '@store/ui/ui'
import './styles.css'

const NewContextMenu: Component<NewMenu> = (props) => {
    const { menuOpenStatus, setMenu, getContextAnchor } = useAppUIContext()

    onMount(() => {
        if (getContextAnchor()) {
            useEventListener(getContextAnchor(), 'contextmenu', (e) => {
                e.preventDefault()
                setMenu({ x: e['x'], y: e['y'] })
                debug('[Context Window]: opening menu')
                //debug('[Context Window]: ', e)
            })
        }
    })

    createEffect(() => {
        if (!menuOpenStatus()) return

        const cleanup = useEventListener('click', () => {
            onClickOutside(getContextAnchor(), () => {
                setMenu(null)
            })
        })

        onCleanup(() => {
            debug('[Context Window]: cleaning up')
            cleanup()
        })
    })
    return (
        <Show when={menuOpenStatus() ?? false}>
            <Portal mount={getContextAnchor()!}>
                <div
                    id={props.id}
                    class="context-menu shadow-lg dark:text-white dark:border-gray-700 border border-gray-600 z-50 absolute"
                    style={{
                        top: `${menuOpenStatus()?.y ?? 0}px`,
                        left: `${menuOpenStatus()?.x ?? 0}px`,
                    }}>
                    {props.children}
                </div>
            </Portal>
        </Show>
    )
}

export default NewContextMenu
