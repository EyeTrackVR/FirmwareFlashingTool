export * as O from 'fp-ts/Option'
import type { JSXElement } from 'solid-js'
import { IETVRConfigResponse } from './services/interfaces'

//********************************* Utility *************************************/
export type Context = {
    [key: string]: JSXElement
}

export type PersistentSettings = {
    config: IETVRConfigResponse
}
