import { appWindow } from '@tauri-apps/api/window'
import { createEffect, createMemo, Show } from 'solid-js'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { OPERATING_SYSTEM_MODAL_ID } from '@src/static'
import { checkSystem } from '@src/utils'

const OperatingSystem = () => {
    const system = createMemo(() => {
        return checkSystem()
    })

    createEffect(() => {
        if (/Linux/.test(system())) {
            const el = document.getElementById(OPERATING_SYSTEM_MODAL_ID)
            if (el instanceof HTMLDialogElement) {
                el.showModal()
            }
        }
    })

    return (
        <Show when={/Linux/.test(system())}>
            <dialog id={OPERATING_SYSTEM_MODAL_ID} class="modal">
                <Titlebar
                    onClickHeader={(action: TITLEBAR_ACTION) => {
                        switch (action) {
                            case TITLEBAR_ACTION.MINIMIZE:
                                appWindow.minimize()
                                break
                            case TITLEBAR_ACTION.MAXIMIZE:
                                appWindow.toggleMaximize()
                                break
                            case TITLEBAR_ACTION.CLOSE:
                                appWindow.close()
                                break
                            default:
                                return
                        }
                    }}
                />
                <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                    <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                        <div class="flex flex-col gap-[14px]">
                            <div class="flex flex-col gap-[14px]">
                                <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                    Important!
                                </p>
                                <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                    Currently there is no available support.
                                </p>
                                <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                    Try accessing the system from a supported platform such as
                                    <code class="code">Windows, macOS</code>. Thank you for your
                                    understanding.
                                </p>
                                <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                    Stay tuned for future updates!.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </Show>
    )
}

export default OperatingSystem
