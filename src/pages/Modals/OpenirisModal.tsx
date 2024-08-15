import { Component } from 'solid-js'
import CheckboxButton from '@components/Buttons/CheckboxButton/Index'
import { Button } from '@components/Buttons/DefaultButton'
import { Modal } from '@components/Modal/Index'
import ModalHeader from '@components/ModalHeader/Index'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { openirisModalID } from '@src/static'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClickInstallOpeniris: () => void
    onClickCheckbox: () => void
    isActive: boolean
    checked: boolean
}

const OpenirisModal: Component<IProps> = (props) => {
    return (
        <Modal
            id={openirisModalID}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-[14px]">
                <ModalHeader label="Reminder!" onClick={props.onClickClose} />
                <div class="flex flex-col gap-[14px]">
                    <div>
                        <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                            Before flashing
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            Make sure to follow the steps below 👇
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            &#x2022; Press the "B" button on your board if it has one
                        </p>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic py-[10px]">
                            &#x2022; Make sure you have the antenna and camera plugged into the
                            board
                        </p>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            &#x2022; Make sure your password and ssid do not have special characters
                        </p>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            &#x2022; Make sure you have a stable internet connection
                        </p>
                    </div>
                </div>
                <div class="flex gap-[10px] justify-between">
                    <CheckboxButton
                        onClick={props.onClickCheckbox}
                        checked={props.checked}
                        label="Don’t show this again"
                    />
                    <Button
                        type={'button'}
                        isActive={true}
                        label="Install Openiris"
                        onClick={props.onClickInstallOpeniris}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default OpenirisModal
