import Toast from '@components/Toast'
import { classNames } from '@src/utils'
import { dismissNotification } from '@store/notifications/notifications'
import { notifications } from '@store/notifications/selectors'
import { createSignal, For } from 'solid-js'

export const Toaster = () => {
    const [removingIds, setRemovingIds] = createSignal<Set<number>>(new Set())
    const [hovering, setHovering] = createSignal(false)

    const onStartRemoving = (id: number): void => {
        setRemovingIds((prev) => new Set([...prev, id]))
        setTimeout(() => {
            setRemovingIds((prev) => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }, 400)
    }

    const effectiveIndex = (id: number): number => {
        const removing = removingIds()
        let idx = 0
        for (const t of notifications()) {
            if (t.id === id) return idx
            if (!removing.has(t.id)) idx++
        }
        return idx
    }

    return (
        <div
            data-tauri-drag-region
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            class={classNames(
                ' fixed top-6 left-1/2 -translate-x-1/2 w-[400px] z-[999] transition-[height] duration-[380ms] [cubic-bezier(0.34,1.1,0.64,1)]',
                notifications().length ? 'pointer-events-auto' : 'pointer-events-none',
            )}
            style={{
                height: hovering() ? `${Math.min(notifications().length, 5) * 72 + 2}px` : '80px',
                'transition-timing-function': 'cubic-bezier(0.34, 1.1, 0.64, 1)',
            }}>
            <For each={notifications()}>
                {(t) => (
                    <Toast
                        toast={t}
                        index={effectiveIndex(t.id)}
                        total={notifications().length}
                        hovering={hovering()}
                        onStartRemoving={onStartRemoving}
                        dismiss={dismissNotification}
                    />
                )}
            </For>
        </div>
    )
}
