import { Component } from 'solid-js'
import { Image } from '@kobalte/core'
import Typography from '@components/Typography'
import { Button } from '@components/Buttons/Button'

export interface IProps {
    onClickSetup: () => void
    onClickAddExisting: () => void
}

const Welcome: Component<IProps> = (props) => {
    return (
        <div class="w-full h-full flex flex-col items-center justify-center gap-32">
            <Image.Root class="select-none">
                <Image.Img
                    src="images/logo.png"
                    alt="logo"
                    width="128px"
                    class="min-w-[128px] min-h-[128px]"
                />
            </Image.Root>
            <Typography text="h1" color="white">
                Welcome Traveler!
            </Typography>
            <div class="flex flex-col gap-6">
                <Button
                    disabled={false}
                    isLoadingPrimaryButton={false}
                    isActive={true}
                    type="button"
                    label="Full ETVR Setup"
                    onClick={props.onClickSetup}
                />
                <Button
                    disabled={false}
                    isLoadingPrimaryButton={false}
                    isActive={false}
                    type="button"
                    label="Add Existing boards"
                    onClick={props.onClickAddExisting}
                />
            </div>
        </div>
    )
}

export default Welcome
