import { createSignal, JSX } from 'solid-js'
import { ANIMATION_MODE, POPOVER_ID } from '@src/static/types/enums'

export interface IProps {
    firstChild: JSX.Element
    secondChild: JSX.Element
}

const CustomSlideAnimation = (props: IProps) => {
    const [hoverMode, setHoverMode] = createSignal(ANIMATION_MODE.GRIP)
    const [displayMode, setDisplayMode] = createSignal(POPOVER_ID.GRIP)

    return (
        <div class="relative h-[45px] ml-auto flex leading-5 font-sans font-medium rounded-xl p-1 bg-[#0e0e0e]">
            <div class="relative flex">
                <div
                    class={`absolute bg-[#252536] w-1/2 h-full rounded-lg pointer-events-none ease-in duration-150  ${
                        hoverMode().match(ANIMATION_MODE.LIST) ? 'right-[0%]' : 'right-[50%]'
                    }`}
                />
                <div
                    class="no-underline flex "
                    onMouseLeave={() => {
                        setHoverMode(
                            displayMode().match(hoverMode())
                                ? ANIMATION_MODE.GRIP
                                : ANIMATION_MODE.LIST,
                        )
                    }}
                    onMouseEnter={() => setHoverMode(ANIMATION_MODE.GRIP)}
                    onClick={() => setDisplayMode(POPOVER_ID.GRIP)}>
                    {props.firstChild}
                </div>
                <div
                    class="no-underline flex "
                    onMouseLeave={() => {
                        setHoverMode(
                            displayMode().match(hoverMode())
                                ? ANIMATION_MODE.LIST
                                : ANIMATION_MODE.GRIP,
                        )
                    }}
                    onMouseEnter={() => setHoverMode(ANIMATION_MODE.LIST)}
                    onClick={() => setDisplayMode(POPOVER_ID.LIST)}>
                    {props.secondChild}
                </div>
            </div>
        </div>
    )
}

export default CustomSlideAnimation
