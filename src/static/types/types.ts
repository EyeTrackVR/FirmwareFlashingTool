export type IEventType = FocusEvent & {
    currentTarget: HTMLDivElement
    target: Element
}

export type IInputType = InputEvent & {
    currentTarget: HTMLInputElement
    target: HTMLInputElement
}
