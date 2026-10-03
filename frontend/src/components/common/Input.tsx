import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: LucideIcon
  error?: string
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, suffix, className, ...props }, ref) => {
    return (
      <div className="grid gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[--color-fg-2]">{label}</label>
        )}
        <div
          className={cn(
            'relative flex items-center h-12 bg-white border rounded-lg transition-all',
            error
              ? 'border-[--color-danger-text] shadow-[0_0_0_3px_rgba(180,35,62,0.12)]'
              : 'border-[--color-border] focus-within:border-[--color-accent] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.18)]'
          )}
        >
          {Icon && (
            <span className="absolute left-3.5 text-[--color-muted] pointer-events-none">
              <Icon size={20} />
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-full px-3.5 bg-transparent outline-none text-[--color-fg]',
              Icon && 'pl-11',
              suffix && 'pr-12',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {suffix && <span className="absolute right-3.5 flex items-center">{suffix}</span>}
        </div>
        {error && (
          <span className="text-sm text-[--color-danger-text]" role="alert">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'