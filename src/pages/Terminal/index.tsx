import { Button } from '@components/Buttons/Button'
import TerminalHeader from '@components/TerminalHeader'
import Typography from '@components/Typography'
import { IDropdownList } from '@interfaces/interfaces'
import { Component, createMemo, createSignal, For, onCleanup, onMount } from 'solid-js'

export interface IProps {
    onClickDownloadLogs: () => void
    onClickSelectPort: () => void
    onClickOpenDocs: () => void
    onClickGetLogs: () => void
    onClickBack: () => void
    logs: string[]
    firmwareVersion: string
    activePortName: string
    ports: IDropdownList[]
}

const Terminal: Component<IProps> = (props) => {
    const [containerHeight, setContainerHeight] = createSignal(400)
    const [scrollTop, setScrollTop] = createSignal(0)
    let containerRef: HTMLDivElement | undefined

    const overscanCount = 5
    const rowHeight = 20

    onMount(() => {
        if (containerRef) {
            const measure = () => {
                const height = containerRef!.clientHeight
                setContainerHeight(height)
            }

            measure()
            const resizeObserver = new ResizeObserver(measure)
            resizeObserver.observe(containerRef)

            onCleanup(() => resizeObserver.disconnect())
        }
    })

    const getVisibleStartIndex = () => {
        return Math.max(0, Math.floor(scrollTop() / rowHeight) - overscanCount)
    }

    const getVisibleEndIndex = () => {
        const visibleRowCount = Math.ceil(containerHeight() / rowHeight)
        return Math.min(
            props.logs.length - 1,
            Math.floor(scrollTop() / rowHeight) + visibleRowCount + overscanCount,
        )
    }

    const getVisibleItems = () => {
        const start = getVisibleStartIndex()
        const end = getVisibleEndIndex()
        return props.logs.slice(start, end + 1)
    }

    const handleScroll = (e: Event) => {
        const target = e.target as HTMLDivElement
        setScrollTop(target.scrollTop)
    }

    const getTotalHeight = createMemo(() => props.logs.length * rowHeight)
    const getOffsetY = createMemo(() => getVisibleStartIndex() * rowHeight)

    const updatedVisibleItems = createMemo(() => {
        return getVisibleItems().map((el) => {
            return el
                .split(' ')
                .map((el) => (!el ? '\u2004' : el))
                .join(' ')
                .replace('[0m', '')
                .replace('[0;32m', '')
                .replace('[0;31m', '')
        })
    })

    return (
        <div class="flex flex-col justify-between h-full gap-12 pt-24 px-24 pb-48">
            <div class="flex h-full justify-center items-center overflow-hidden">
                <div class="max-w-[1800px] h-full w-full bg-black-900 p-12 pb-0 flex flex-col gap-12 rounded-12 border-solid border-1 border-black-800 ">
                    <div class="flex flex-col gap-12">
                        <TerminalHeader onClickOpenDocs={props.onClickOpenDocs} />
                    </div>
                    <div
                        ref={containerRef}
                        class="flex flex-col overflow-hidden w-full flex-1 bg-black-700 p-24 rounded-12">
                        <div class="overflow-auto w-full h-full" onScroll={handleScroll}>
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: `${getTotalHeight()}px`,
                                }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: `${getOffsetY()}px`,
                                        left: 0,
                                        right: 0,
                                    }}>
                                    <For each={updatedVisibleItems()}>
                                        {(item) => (
                                            <div
                                                class="w-full flex items-center "
                                                style={{
                                                    height: `${rowHeight}px`,
                                                    display: 'flex',
                                                    'padding-left': '8px',
                                                }}>
                                                <Typography
                                                    nowrap
                                                    select
                                                    text="caption"
                                                    color={
                                                        item.includes('WIFI_MANAGER')
                                                            ? 'orange'
                                                            : item.startsWith('I ') &&
                                                                !item.includes('LOGO')
                                                              ? 'green'
                                                              : item.startsWith('E ')
                                                                ? 'red'
                                                                : 'lightBlue'
                                                    }>
                                                    {item}
                                                </Typography>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-12 flex-row w-full justify-between overflow-hidden overflow-x-auto scrollbarX pb-12">
                        <div class="flex">
                            <Button type="button" label="Back" onClick={props.onClickBack} />
                        </div>
                        <div class="flex flex-row gap-12">
                            <div class="flex">
                                <Button
                                    type="button"
                                    label={
                                        !props.activePortName ? 'Select port' : props.activePortName
                                    }
                                    onClick={props.onClickSelectPort}
                                />
                            </div>
                            <div class="flex">
                                <Button
                                    type="button"
                                    label="Show logs"
                                    onClick={props.onClickGetLogs}
                                />
                            </div>
                            <div class="flex">
                                <Button
                                    type="button"
                                    label="Download logs"
                                    onClick={props.onClickDownloadLogs}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terminal
