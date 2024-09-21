import { AiFillHome } from 'solid-icons/ai'
import { BiSolidExtension } from 'solid-icons/bi'
import { IoSettingsSharp } from 'solid-icons/io'
import { Component } from 'solid-js'
import { NAVIGATION } from '@interfaces/enums'

export interface IProps {
    onClick: (route: NAVIGATION) => void
    navigation: string
}

const Sidebar: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col justify-between pr-[24px] pt-[10px]">
            <div class="flex flex-col gap-[24px]">
                <div
                    onClick={() => {
                        props.onClick(NAVIGATION.HOME)
                    }}
                    classList={{
                        'hover:bg-[#354473] bg-[#2B375E] focus-visible:border-[#fff]':
                            props.navigation === NAVIGATION.HOME,
                    }}
                    class="cursor-pointer rounded-[6px] p-[8px]">
                    <div class="flex flex-col justify-center items-center gap-[10px]">
                        <AiFillHome
                            size={34}
                            color={props.navigation === NAVIGATION.HOME ? '#9092FF' : '#192736'}
                        />
                        <p class="text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap text-center">
                            Home
                        </p>
                    </div>
                </div>
                <div
                    onClick={() => {
                        props.onClick(NAVIGATION.CONFIGURE_WIZARD)
                    }}
                    classList={{
                        'hover:bg-[#354473] bg-[#2B375E] focus-visible:border-[#fff]':
                            props.navigation === NAVIGATION.CONFIGURE_WIZARD,
                    }}
                    class="cursor-pointer p-[8px] rounded-[6px]">
                    <div class="flex flex-col justify-center items-center gap-[10px]">
                        <BiSolidExtension
                            size={34}
                            classList={{
                                '#9092FF': props.navigation === NAVIGATION.CONFIGURE_WIZARD,
                                '#192736': props.navigation !== NAVIGATION.CONFIGURE_WIZARD,
                            }}
                        />
                        <p class="text-[14px] text-white font-normal leading-[20px] not-italic text-center max-w-[66px] whitespace-wrap">
                            Configure setup
                        </p>
                    </div>
                </div>
            </div>
            <div
                onClick={() => {
                    props.onClick(NAVIGATION.SETTINGS)
                }}
                classList={{
                    'hover:bg-[#354473] bg-[#2B375E] focus-visible:border-[#fff]':
                        props.navigation === NAVIGATION.SETTINGS,
                }}
                class="rounded-[6px] p-[8px] cursor-pointer">
                <div class="flex flex-col justify-center items-center gap-[19px]">
                    <IoSettingsSharp
                        size={34}
                        color={props.navigation === NAVIGATION.SETTINGS ? '#9092FF' : '#192736'}
                    />
                    <p class="text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap text-center">
                        Settings
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
