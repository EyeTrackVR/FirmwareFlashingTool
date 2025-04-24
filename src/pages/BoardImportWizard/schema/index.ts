import { validateAddress } from '@src/utils'
import * as yup from 'yup'

export const trackerSchema = yup.object({
    editBoard: yup.string().optional(),
    label: yup.string().required('Camera label is required'),
    address: yup
        .string()
        .required('Camera address is required')
        .test('is-valid-address', 'Invalid COM or IP address', (value) => validateAddress(value)),
})
