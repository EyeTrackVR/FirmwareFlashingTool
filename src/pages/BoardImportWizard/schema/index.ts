import * as yup from 'yup'

export const boardSchema = yup.object({
    editBoard: yup.string().optional(),
    label: yup.string().required('Camera label is required'),
    address: yup.string().required('Camera address is required'),
})
