import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold cursor-pointer',
          'border-[var(--border-width)] border-[var(--color-border)]',
          'transition-all duration-150 ease-in-out',
          'select-none',
          variant === 'primary' && 'bg-[var(--color-primary)] text-[var(--color-secondary)]',
          variant === 'primary' && 'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
          variant === 'primary' && 'hover:bg-[var(--color-primary-hover)]',
          variant === 'primary' && 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)]',
          variant === 'secondary' && 'bg-[var(--color-surface)] text-[var(--color-text)]',
          variant === 'secondary' && 'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
          variant === 'secondary' && 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)]',
          variant === 'ghost' && 'bg-transparent text-[var(--color-text)] border-transparent',
          variant === 'ghost' && 'hover:bg-[var(--color-surface)] hover:border-[var(--color-border)]',
          variant === 'danger' && 'bg-[var(--color-error)] text-white',
          variant === 'danger' && 'shadow-[var(--shadow-offset)_0px_0px_var(--color-shadow)]',
          variant === 'danger' && 'active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--color-shadow)]',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-base',
          size === 'lg' && 'px-7 py-3.5 text-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
