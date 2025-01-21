import { typography } from '@common/typography'
import { VariantProps } from 'class-variance-authority'
import { createMemo, ParentComponent } from 'solid-js'

export interface IProps {
    classList?: {
        [k: string]: boolean | undefined
    }
    class?: string
}

export interface TypographyProps extends IProps, VariantProps<typeof typography> {}

const Typography: ParentComponent<TypographyProps> = (props) => {
    const styles = createMemo(() => {
        return {
            ...props,
            class: props?.class ?? '',
            classList: props?.classList ?? {},
        }
    })

    return (
        <p classList={props.classList} class={typography(styles())}>
            {props.children}
        </p>
    )
}

export default Typography
