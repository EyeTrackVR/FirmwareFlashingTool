import { Accessor, createMemo, createRoot } from 'solid-js'

export const createStoreSelectors = <T extends object>(
    store: () => T,
): { [K in keyof T]: Accessor<T[K]> } => {
    return createRoot(() => {
        const keys = Object.keys(store()) as (keyof T)[]
        const selectors = keys.reduce(
            (acc, key) => {
                /*@once*/
                acc[key] = createMemo(() => store()[key])
                return acc
            },
            {} as { [K in keyof T]: Accessor<T[K]> },
        )
        return selectors
    })
}
