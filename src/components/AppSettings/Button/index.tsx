import { createMemo, createSignal } from 'solid-js'
import { classNames } from '@src/utils'

export interface IProps {
    styles?: string
    onClick: () => void
    name: string
    historyDescription?: string
    img?: string
    secondImg?: string
    enableChangeImage?: boolean
}

const Button = (props: IProps) => {
    const [changeImage, setChangeImage] = createSignal(false)

    const img = createMemo(() => {
        if (!props.secondImg) {
            return props.img
        }
        return changeImage() ? props.secondImg : props.img
    })

    return (
        <div class="w-full">
            <div
                class={
                    'flex flex-col justify-between w-full min-h-[139px] h-full  bg-[#333742] hover:bg-[#0071FE] cursor-pointer rounded-xl p-5'
                }
                onMouseEnter={() => setChangeImage(true)}
                onMouseLeave={() => setChangeImage(false)}>
                <div class="h-full w-full">
                    <img
                        src={img()}
                        alt=""
                        class={
                            img() &&
                            classNames(
                                'h-full w-full max-h-[46px] max-w-[58px] m-auto',
                                props.styles,
                            )
                        }
                    />
                </div>
                <div class="pt-2 h-full w-full text-white text-xl">
                    <p>{props.name}</p>
                </div>
            </div>
        </div>
    )
}

export default Button
