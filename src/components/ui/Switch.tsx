import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

export const Switch = forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center',
      'border-[var(--border-width)] border-[var(--color-border)]',
      'bg-[var(--color-surface)]',
      'shadow-[3px_3px_0px_0px_var(--color-shadow)]',
      'transition-all',
      'focus:outline-none',
      'data-[state=checked]:bg-[var(--color-primary)]',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block h-4 w-4 bg-[var(--color-text)] shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1" />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'
