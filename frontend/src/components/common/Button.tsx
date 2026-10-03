import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'ghost' | 'danger' | 'social'
type Size = 'sm' | 'md' | 'lg' | 'callout'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-[--color-accent] text-white hover:bg-[--color-accent-hover] active:bg-[--color-accent-active]',
      ghost: 'bg-white border border-[--color-border] text-[--color-fg-2] hover:border-gray-300 hover:text-[--color-fg]',
      danger: 'bg-white border border-[--color-danger-text] text-[--color-danger-text] hover:bg-[--color-danger-bg]',
      social: 'bg-white border border-[--color-border] text-[--color-fg-2] hover:bg-[--color-surface-warm]',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-md',
      md: 'h-11 px-4 text-sm rounded-md',
      lg: 'h-12 px-6 text-base rounded-md',
      callout: 'h-14 px-6 text-base rounded-md',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'