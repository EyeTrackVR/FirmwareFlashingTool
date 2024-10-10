import { Accessor, createMemo } from 'solid-js'

export function createStoreSelectors<T extends object>(
    store: () => T,
): { [K in keyof T]: Accessor<T[K]> } {
    const keys = Object.keys(store()) as (keyof T)[]
    return keys.reduce(
        (acc, key) => {
            acc[key] = createMemo(() => store()[key])
            return acc
        },
        {} as { [K in keyof T]: Accessor<T[K]> },
    )
}
