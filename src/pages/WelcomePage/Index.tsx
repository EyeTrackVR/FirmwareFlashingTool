import { Image } from '@kobalte/core'
import { Component } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { NAVIGATION } from '@interfaces/enums'

export interface IProps {
    onClick: (navigation: NAVIGATION) => void
}

const WelcomePage: Component<IProps> = (props) => {
    return (
        <div class="w-full h-full flex flex-col justify-center items-center gap-[38px]">
            <div>
                <Image.Root>
                    <Image.Img
                        src="images/logo.png"
                        alt="logo"
                        width="64px"
                        class="min-w-[128px]"
                    />
                </Image.Root>
            </div>
            <div>
                <p class="text-[36px] text-white font-normal leading-[20px] not-italic whitespace-nowrap text-center">
                    Welcome traveler!
                </p>
            </div>
            <div class="flex flex-col gap-[12px]">
                <Button
                    onClick={() => {
                        props.onClick(NAVIGATION.CONFIGURE_BOARD)
                    }}
                    isActive={true}
                    label="full ETVR Setup"
                />
                <Button
                    onClick={() => {
                        props.onClick(NAVIGATION.CONFIGURE_SETUP)
                    }}
                    label="Add existing boards"
                />
            </div>
        </div>
    )
}

export default WelcomePage
