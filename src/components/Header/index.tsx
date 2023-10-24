import { Image } from '@kobalte/core'
import { Link } from '@solidjs/router'
import CustomPopover from './CustomPopover'
import icons from '@assets/images'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import './styles.css'

interface Iprops {
    name: string
    hideButtons: boolean
    onClick: () => void
}

const Header = (props: Iprops) => {
    return (
        <header class="pr-4 pl-4 grow content-center">
            <div>
                <div class="flex grow justify-between items-center mt-[1rem]">
                    <div>
                        <Link href="/" class="no-underline" onClick={() => props.onClick()}>
                            <Image.Root>
                                <Image.Img src={icons.logo} alt="logo" width="51px" />
                            </Image.Root>
                        </Link>
                    </div>
                    {props.hideButtons ? null : (
                        <div>
                            <CustomSlideAnimation
                                firstChild={
                                    <Link href="/" class="no-underline flex">
                                        <CustomPopover
                                            styles="h-full"
                                            popoverContent="Tracker manager"
                                            icon={icons.cameraSolid}
                                        />
                                    </Link>
                                }
                                secondChild={
                                    <Link href="/appSettings" class="no-underline flex">
                                        <CustomPopover
                                            styles="h-full"
                                            popoverContent="App settings"
                                            icon={icons.gearSolid}
                                        />
                                    </Link>
                                }
                            />
                        </div>
                    )}
                    <div>
                        <div class="inline-flex mt-[5px] justify-center rounded-xl bg-[#0e0e0e] bg-opacity-100 font-medium">
                            <div>
                                <div class="flex rounded-3 h-full flex-row basis-full justify-center content-stretch pt-[11.3px] pb-[11.3px] pr-[1.5rem] pl-[1.5rem]">
                                    <div>
                                        <span class="quick-menu-text-gradient text-white text-sm">
                                            {props.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
