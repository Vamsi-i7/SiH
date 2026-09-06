import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      default: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
      destructive: 'bg-destructive text-white hover:bg-destructive-dark shadow-sm',
      outline: 'border border-border bg-card hover:bg-secondary hover:text-foreground',
      secondary: 'bg-secondary text-muted-foreground hover:bg-secondary/20',
      ghost: 'bg-secondary/50 text-muted-foreground hover:bg-secondary/30 hover:text-primary',
      link: 'text-primary underline-offset-4 hover:text-primary-dark hover:underline',
    };

    const sizes = {
      default: 'h-11 px-3.5 py-1.5 text-sm',
      sm: 'h-8 px-2.5 text-xs',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
