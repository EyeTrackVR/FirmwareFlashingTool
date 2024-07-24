import { Component, createMemo, createSignal, For, onCleanup, onMount } from 'solid-js'

export interface IProps {
    items: string[]
}

export const VirtualList: Component<IProps> = (props) => {
    const [scrollTop, setScrollTop] = createSignal(0)

    let parentRef
    const itemHeight = 24
    const viewportHeight = 1200

    const startIdx = () => {
        return Math.floor(scrollTop() / itemHeight)
    }

    const endIdx = () => {
        return Math.min(props.items.length, Math.ceil((scrollTop() + viewportHeight) / itemHeight))
    }

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop)
    }

    onMount(() => {
        if (parentRef) {
            parentRef.addEventListener('scroll', handleScroll)
        }

        onCleanup(() => {
            if (parentRef) {
                parentRef.removeEventListener('scroll', handleScroll)
            }
        })
    })

    const items = createMemo(() => {
        return props.items.slice(startIdx(), endIdx())
    })

    const height = createMemo(() => {
        const height = props.items.length * itemHeight
        return height > 600 ? '600px' : 'auto'
    })

    return (
        <div
            ref={(el) => (parentRef = el)}
            style={{ height: height(), width: '100%', overflow: 'auto' }}>
            <div
                style={{
                    height: `${props.items.length * itemHeight}px`,
                    'max-height': `${viewportHeight}px`,
                    position: 'relative',
                    width: '100%',
                }}>
                <For each={items()}>
                    {(item, index) => {
                        return (
                            <div
                                class="flex select-text"
                                style={{
                                    top: `${(index() + startIdx()) * itemHeight}px`,
                                    height: `${itemHeight}px`,
                                    position: 'absolute',
                                    width: '100%',
                                    left: 0,
                                }}>
                                <pre
                                    style={{
                                        'white-space': item.match(/\n/) ? 'nowrap' : 'none',
                                        hyphens: 'none',
                                    }}>
                                    {item}
                                </pre>
                            </div>
                        )
                    }}
                </For>
            </div>
        </div>
    )
}
