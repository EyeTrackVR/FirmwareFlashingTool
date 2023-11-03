import { Image } from '@kobalte/core'
import { Link } from '@solidjs/router'
import { JSXElement, Show } from 'solid-js'
import CustomPopover from '@components/CustomPopOver'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import './styles.css'

interface Iprops {
    name: string
    hideButtons: boolean
    onClick: () => void
}

const Header = (props: Iprops) => {
    const HeaderMenu = (): JSXElement => {
        return (
            <div>
                <CustomSlideAnimation
                    firstChild={
                        <Link href="/" class="no-underline flex">
                            <CustomPopover
                                styles="h-full"
                                popoverContent="Tracker manager"
                                class="pl-[1.5rem] pr-[1.5rem]"
                                icon=""
                            />
                        </Link>
                    }
                    secondChild={
                        <Link href="/appSettings" class="no-underline flex">
                            <CustomPopover
                                styles="h-full"
                                popoverContent="App settings"
                                class="pl-[1.5rem] pr-[1.5rem]"
                                icon=""
                            />
                        </Link>
                    }
                />
            </div>
        )
    }

    const Logo = (): JSXElement => {
        return (
            <Link href="/" class="no-underline" onClick={() => props.onClick()}>
                <Image.Root>
                    <Image.Img src="images/logo.png" alt="logo" width="51px" />
                </Image.Root>
            </Link>
        )
    }

    return (
        <header class="pr-4 pl-4 grow content-center">
            <div class="flex grow justify-between items-center mt-[1rem]">
                <Logo />
                <Show when={!props.hideButtons}>
                    <HeaderMenu />
                </Show>
                <div class="inline-flex mt-[5px] justify-center rounded-xl bg-[#0e0e0e] bg-opacity-100 font-medium">
                    <div class="flex rounded-3 h-full flex-row basis-full justify-center content-stretch pt-[11.3px] pb-[11.3px] pr-[1.5rem] pl-[1.5rem]">
                        <span class="quick-menu-text-gradient text-white text-sm">
                            {props.name}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
