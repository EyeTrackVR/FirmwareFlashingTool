import type { Meta, StoryObj } from 'storybook-solidjs-vite'
import { Footer } from './index'

const meta: Meta<typeof Footer> = {
    title: 'Components/Components/Footer',
    component: Footer,
    argTypes: {},
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
    args: {
        primaryLabel: 'Next',
        secondLabel: 'Cancel',
        onClickSecond: () => {},
        onClickPrimary: () => {},
    },
}
