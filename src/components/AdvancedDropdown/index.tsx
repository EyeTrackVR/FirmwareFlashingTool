import Typography from '@components/Typography'
import { RiArrowsArrowDownSLine } from 'solid-icons/ri'
import { createSignal, ParentComponent, Show } from 'solid-js'

const AdvancedDropdown: ParentComponent = (props) => {
    const [show, setShow] = createSignal(false)

    return (
        <section class="flex flex-col gap-12">
            <div
                class="flex flex-row items-center gap-6 cursor-pointer"
                onClick={() => setShow(!show())}>
                <Typography text="caption" color="white">
                    Advanced
                </Typography>
                <RiArrowsArrowDownSLine
                    size={16}
                    class={`transition-transform duration-300 ease-in-out ${show() ? 'rotate-180' : 'rotate-0'}`}
                />
                <div class="h-2 rounded-100 w-full bg-grey-300"></div>
            </div>
            <Show when={show()}>{props.children}</Show>
        </section>
    )
}

export default AdvancedDropdown
