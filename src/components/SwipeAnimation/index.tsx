import { ACTION } from '@interfaces/animation/enums'
import { setActiveStep, setShowComponent } from '@store/animation/animation'
import { action, activeStep, showComponent, step } from '@store/animation/selectors'
import { createMemo, ParentComponent } from 'solid-js'

const SwipeAnimation: ParentComponent = (props) => {
    const animationClass = createMemo(() => {
        if (step() !== activeStep()) {
            return action() === ACTION.NEXT
                ? 'animate-slide-left-exit w-full'
                : 'animate-slide-right-exit w-full'
        }
        return action() === ACTION.NEXT
            ? 'animate-slide-right-enter w-full'
            : 'animate-slide-left-enter w-full'
    })

    const handleAnimationEnd = () => {
        if (step() !== activeStep()) {
            setActiveStep(step())
            setShowComponent(true)
        }
    }

    return (
        <div
            class={animationClass()}
            onAnimationEnd={handleAnimationEnd}
            onAnimationStart={() => setShowComponent(false)}
            style={!showComponent() ? { opacity: '0' } : { opacity: '1' }}>
            {props.children}
        </div>
    )
}

export default SwipeAnimation
