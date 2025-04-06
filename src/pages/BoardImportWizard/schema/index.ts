import { IBoard } from '@interfaces/boards/interfaces'
import { boards } from '@store/boards/selectors'
import * as yup from 'yup'

export const boardSchema = yup.object({
    editBoard: yup.string().optional(),
    label: yup.string().required('Camera label is required'),
    address: yup
        .string()
        .required('Camera address is required')
        .test({
            name: 'validate_duplicate_address',
            test: (value, context) => {
                if (context.parent.editBoard) return true
                return boards().every((board: IBoard) => board.address !== value)
            },
            message: 'This camera address is already in use. Please provide a unique address.',
        }),
})
