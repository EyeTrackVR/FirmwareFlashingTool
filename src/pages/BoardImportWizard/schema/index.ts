import { IBoard } from '@interfaces/boards/interfaces'
import * as yup from 'yup'

export const boardSchema = (boards: IBoard[], isEditBoard: boolean) => {
    return yup.object({
        label: yup.string().required('Camera label is required'),
        address: yup
            .string()
            .required('Camera address is required')
            .test({
                name: 'validate_duplicate_address',
                test: (value) => {
                    if (isEditBoard) return true
                    return boards.every((board) => board.address !== value)
                },
                message: 'This camera address is already in use. Please provide a unique address.',
            }),
    })
}
