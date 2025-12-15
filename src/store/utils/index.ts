import { Accessor } from 'solid-js'

export const createStoreSelectors = <T extends object>(
    store: () => T,
): { [K in keyof T]: Accessor<T[K]> } => {
    const keys = Object.keys(store()) as (keyof T)[]
    const selectors = keys.reduce(
        (acc, key) => {
            acc[key] = () => store()[key]
            return acc
        },
        {} as { [K in keyof T]: Accessor<T[K]> },
    )
    return selectors
}
