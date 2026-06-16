import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 px-3 py-1.5 text-sm',
      'bg-[var(--color-secondary)] text-[var(--color-bg)]',
      'border-[var(--border-width)] border-[var(--color-border)]',
      'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
      'font-bold',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = 'TooltipContent'
