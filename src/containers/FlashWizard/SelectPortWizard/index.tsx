// we have to somehow combine
// select mode
// update network
// change device mode
// setup wizard

import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    DEVICE_MODE_WIZARD,
    FLASH_WIZARD_STEPS,
    INIT_WIZARD_STEPS,
    MODAL_TYPE,
    SELECT_MODE_WIZARD,
    SELECT_PORT_WIZARD,
    STEP_ACTION,
} from '@interfaces/enums'
import { logger } from '@src/logger'
import { detectDeviceMode } from '@store/actions/animation/detectDeviceMode'
import { verifyPortConnection } from '@store/actions/animation/verifyPortConnection'
import { downloadAsset } from '@store/actions/firmware/downloadAsset'
import { installOpenIris } from '@store/actions/terminal/installOpenIris'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { setActivePort } from '@store/esp/esp'
import { activePort } from '@store/esp/selectors'
import { firmwareType } from '@store/firmware/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { activeStepAction } from '@store/ui/selectors'
import { setOpenModal } from '@store/ui/ui'
import { BiRegularChip, BiRegularLoaderAlt } from 'solid-icons/bi'
import { BsDisplayport } from 'solid-icons/bs'
import { batch, createMemo, Match, Show, Switch } from 'solid-js'

const SelectPortWizard = () => {
    const buttonDescription = createMemo(() => {
        switch (activeStepAction()) {
            case STEP_ACTION.SELECT_MODE: {
                return 'Verify connection'
            }
            default:
                return 'Select port'
        }
    })

    const selectPortButtonDescription = createMemo(() => {
        switch (activeStepAction()) {
            case STEP_ACTION.CHANGE_DEVICE_MODE: {
                return 'Detect device'
            }
            case STEP_ACTION.SELECT_MODE: {
                return 'Verify connection'
            }
            case STEP_ACTION.INSTALL_OPENIRIS: {
                return 'Install openiris'
            }
            default:
                break
        }
    })

    const selectPortDescription = createMemo(() => {
        switch (activeStepAction()) {
            case STEP_ACTION.INSTALL_OPENIRIS:
                return 'Choose the port your device is connected to, then click the button below to begin flashing and follow the on-screen instructions.'
            default:
                return 'Choose the port your device is connected to, then click the button below.'
        }
    })

    const beforeProceedingDescription = createMemo(() => {
        switch (activeStepAction()) {
            case STEP_ACTION.CHANGE_DEVICE_MODE:
            case STEP_ACTION.SELECT_MODE:
                return 'Unplug your board, then reconnect it to the PC without pressing any buttons to ensure it starts fresh.'
            default:
                return undefined
        }
    })

    return (
        <Switch>
            <Match when={activeStep() === SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING}>
                <Card
                    primaryButtonLabel={buttonDescription()}
                    isActive
                    icon={BiRegularChip}
                    onClickBack={() => {
                        switch (activeStepAction()) {
                            case STEP_ACTION.CHANGE_DEVICE_MODE:
                            case STEP_ACTION.UPDATE_NETWORK: {
                                batch(() => {
                                    setStep(INIT_WIZARD_STEPS.SELECT_PROCESS, false)
                                    setAction(ACTION.PREV)
                                })
                                break
                            }
                            case STEP_ACTION.SELECT_MODE: {
                                batch(() => {
                                    setStep(SELECT_MODE_WIZARD.SELECT_MODE, false)
                                    setAction(ACTION.PREV)
                                })
                                break
                            }
                            case STEP_ACTION.INSTALL_OPENIRIS: {
                                batch(() => {
                                    setStep(INIT_WIZARD_STEPS.SELECT_BOARD, false)
                                    setAction(ACTION.PREV)
                                })
                                break
                            }
                            default:
                                break
                        }
                    }}
                    onClickPrimary={async () => {
                        switch (activeStepAction()) {
                            case STEP_ACTION.CHANGE_DEVICE_MODE:
                            case STEP_ACTION.INSTALL_OPENIRIS:
                            case STEP_ACTION.UPDATE_NETWORK: {
                                setActivePort('')
                            }

                            case STEP_ACTION.SELECT_MODE: {
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    setStep(SELECT_PORT_WIZARD.SELECT_CHECK_PORT_CONNECTION)
                                    verifyPortConnection().catch(() => {})
                                })
                                break
                            }
                            default: {
                                batch(() => {
                                    setStep(SELECT_PORT_WIZARD.SELECT_PORT, false)
                                    setAction(ACTION.NEXT)
                                })
                            }
                        }
                    }}
                    label="Before proceeding"
                    description={beforeProceedingDescription()}>
                    <Show when={activeStepAction() === STEP_ACTION.INSTALL_OPENIRIS}>
                        <div class="flex flex-col gap-14 pb-24">
                            <Typography color="white" text="caption" class="text-left">
                                Make sure to follow the steps below 👇
                            </Typography>
                            <div class="flex flex-col gap-14">
                                <Typography color="white" text="caption" class="text-left">
                                    &#x2022; hold B button while plugging the board in
                                </Typography>
                            </div>
                        </div>
                    </Show>
                </Card>
            </Match>
            <Match when={activeStep() === SELECT_PORT_WIZARD.SELECT_CHECK_PORT_CONNECTION}>
                <Card isLoader icon={BiRegularLoaderAlt} label="Connecting">
                    <Typography text="caption" color="white" class="leading-[18px]">
                        Verifying port connection status.
                        <br /> <code class="text-purple-100">process can take up to (5s)</code>
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === SELECT_PORT_WIZARD.SELECT_PORT}>
                <Card
                    primaryButtonLabel={selectPortButtonDescription()}
                    isActive={activePort() !== ''}
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
                        })
                    }}
                    onClickPrimary={() => {
                        switch (activeStepAction()) {
                            case STEP_ACTION.CHANGE_DEVICE_MODE: {
                                batch(() => {
                                    detectDeviceMode().catch(() => {})
                                    setStep(DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE, false)
                                    setAction(ACTION.NEXT)
                                })
                                break
                            }
                            case STEP_ACTION.SELECT_MODE: {
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    verifyPortConnection().catch(() => {})
                                    setStep(SELECT_PORT_WIZARD.SELECT_CHECK_PORT_CONNECTION)
                                })
                                break
                            }
                            case STEP_ACTION.INSTALL_OPENIRIS: {
                                batch(() => {
                                    logger.infoStart('INIT_WIZARD_STEPS.SELECT_PORT')
                                    logger.add(`firmware type : ${firmwareType()}`)
                                    logger.add(`active port : ${activePort()}`)
                                    setAction(ACTION.NEXT)
                                    setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS)
                                    setAbortController('openiris')
                                    setProcessStatus(true)
                                    restartFirmwareState()
                                    installOpenIris(activePort(), async () => {
                                        await downloadAsset(firmwareType())
                                    }).catch(() => {})
                                })
                                break
                            }

                            default:
                                break
                        }
                    }}
                    label="Select Port"
                    description={selectPortDescription()}>
                    <SelectButton
                        tabIndex={0}
                        type="button"
                        label={activePort() === '' ? 'Select Port' : activePort()}
                        onClick={() => {
                            setOpenModal({ open: true, type: MODAL_TYPE.SELECT_PORT })
                        }}
                    />
                </Card>
            </Match>
        </Switch>
    )
}

export default SelectPortWizard
