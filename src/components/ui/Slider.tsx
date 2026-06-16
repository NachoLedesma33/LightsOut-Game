import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

export const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex h-6 w-full touch-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow bg-[var(--color-border)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--color-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--color-shadow)] cursor-pointer hover:bg-[var(--color-primary)] focus:outline-none transition-colors" />
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'
