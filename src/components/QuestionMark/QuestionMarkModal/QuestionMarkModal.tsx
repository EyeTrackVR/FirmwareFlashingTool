import { FaSolidXmark } from 'solid-icons/fa'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
}

export const QuestionMarkModal: Component<IProps> = (props) => {
    return (
        <>
            <div
                onClick={() => {
                    props.onClick()
                }}
                class={'z-10 w-[100vw] h-[100vh] absolute top-0 left-0 bg-black opacity-[0.8]'}
            />
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[350px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                <div class="flex flex-col gap-[14px]">
                    <div class="flex justify-between">
                        <div>
                            <p class="text-left text-[18px] text-white font-[500] leading-[20px] not-italic">
                                Build Types
                            </p>
                        </div>
                        <div
                            class="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                props.onClick()
                            }}>
                            <p class="text-white text-left">
                                <FaSolidXmark size={20} fill="#FFFFFF" />
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <p class="text-left text-[14px] text-[#9793FD] font-[500] leading-[20px] not-italic">
                                Debug
                            </p>
                        </div>
                        <div>
                            <p class="text-left text-[12px] text-white font-[500] leading-[20px] not-italic">
                                The debug environment is the default environment and does not need
                                to be specified. It has a lot of logging so it is useful for getting
                                everything setup for the first time and to see what is going on.
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <p class="text-left text-[14px] text-[#9793FD] font-[500] leading-[20px] not-italic">
                                _release
                            </p>
                        </div>
                        <div>
                            <p class="text-left text-[12px] text-white font-[500] leading-[20px] not-italic">
                                Has a lot less debugging, may also be missing some things available
                                only in debug for debug purposes, this should be flashed when
                                everything is working.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionMarkModal
