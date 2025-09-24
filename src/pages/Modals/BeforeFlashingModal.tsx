import { Button } from '@components/Buttons/Button'
import CheckboxButton from '@components/Buttons/Checkbox'
import { Modal } from '@components/Modal/Modal'
import ModalHeader from '@components/Modal/ModalHeader'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { BEFORE_FLASHING_MODE } from '@src/static'
import { Component } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClickInstallOpeniris: () => void
    onClickCheckbox: () => void
    isActive: boolean
    checked: boolean
    version: string
}

const BeforeFlashingModal: Component<IProps> = (props) => {
    return (
        <Modal
            version={props.version}
            id={BEFORE_FLASHING_MODE}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14">
                <ModalHeader label="Reminder!" onClick={props.onClickClose} />
                <div class="flex flex-col gap-14">
                    <Typography color="purple" text="h3" class="text-left">
                        Before flashing
                    </Typography>
                    <Typography color="white" text="caption" class="text-left">
                        Make sure to follow the steps below 👇
                    </Typography>
                    <div class="flex flex-col gap-14">
                        <Typography color="white" text="caption" class="text-left">
                            &#x2022; hold B button while plugging the board in
                        </Typography>
                        <Typography color="white" text="caption" class="text-left leading-[26px]">
                            &#x2022; Make sure you have the antenna and camera plugged into the
                            board if you plan on using them wirelessly
                        </Typography>
                        <Typography color="white" text="caption" class="text-left leading-[26px]">
                            &#x2022; Make sure your password and ssid do not have special characters
                        </Typography>
                        <Typography color="white" text="caption" class="text-left">
                            &#x2022; Make sure you have a stable internet connection
                        </Typography>
                    </div>
                </div>
                <div class="flex gap-10 justify-between">
                    <CheckboxButton
                        onClick={props.onClickCheckbox}
                        checked={props.checked}
                        label="Don’t show this again"
                    />
                    <div>
                        <Button
                            type="button"
                            isActive={true}
                            label="Install Openiris"
                            onClick={() => {
                                const el = document.getElementById(BEFORE_FLASHING_MODE)
                                if (el instanceof HTMLDialogElement) {
                                    el.close()
                                }
                                props.onClickInstallOpeniris()
                            }}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default BeforeFlashingModal
