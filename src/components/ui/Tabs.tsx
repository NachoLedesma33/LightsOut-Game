import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'
import { forwardRef } from 'react'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex border-[var(--border-width)] border-[var(--color-border)]',
      'bg-[var(--color-surface)]',
      'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold',
      'cursor-pointer',
      'transition-colors',
      'data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-[var(--color-secondary)]',
      'data-[state=inactive]:bg-[var(--color-surface)] data-[state=inactive]:text-[var(--color-text)]',
      'data-[state=inactive]:hover:bg-[var(--color-bg)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4', className)}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'
