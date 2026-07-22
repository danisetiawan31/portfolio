import * as React from 'react'
import {
  Button as PrimitiveButton,
  buttonVariants,
  type ButtonProps as PrimitiveButtonProps,
} from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends PrimitiveButtonProps {
  fullWidth?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ fullWidth, loading, className, children, disabled, ...props }, ref) => {
    return (
      <PrimitiveButton
        ref={ref}
        className={cn(
          'box-border whitespace-normal',
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </PrimitiveButton>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
