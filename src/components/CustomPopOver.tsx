import { Image, Popover } from '@kobalte/core'
import { JSXElement, createSignal, Show } from 'solid-js'

export interface ICustomPopover {
    icon: string | JSXElement
    popoverContent?: string
    disablePopover?: boolean
    styles?: string
    class?: string
}

const CustomPopover = (props: ICustomPopover) => {
    const [open, setOpen] = createSignal(false)

    const handlePopOver = () => {
        if (props.disablePopover) {
            setOpen(false)
        }
        setOpen(!open())
    }

    return (
        <div
            onMouseEnter={handlePopOver}
            onMouseLeave={handlePopOver}
            class="group relative inline-flex">
            <Popover.Root open={open()}>
                <Popover.Trigger class={`rounded-[8px] ${props.class}`}>
                    <Image.Root>
                        <Show
                            when={typeof props.icon !== 'string'}
                            fallback={
                                <Image.Img
                                    src={props.icon as string}
                                    alt="logo"
                                    width="20px"
                                    height="35px"
                                    class="pt-1 pb-1"
                                />
                            }>
                            {props.icon}
                        </Show>
                    </Image.Root>
                </Popover.Trigger>
                <Show when={!props.disablePopover}>
                    <Popover.Portal>
                        <Popover.Content class="popover__content">
                            <Popover.Arrow class="" />
                            <Popover.Description class="popover__description">
                                {props.popoverContent || ''}
                            </Popover.Description>
                        </Popover.Content>
                    </Popover.Portal>
                </Show>
            </Popover.Root>
        </div>
    )
}

export default CustomPopover
