import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'severity';
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-primary text-white hover:bg-primary-dark',
    secondary: 'border-transparent bg-secondary text-muted-foreground hover:bg-secondary/20',
    destructive: 'border-transparent bg-destructive text-white hover:bg-destructive-dark',
    outline: 'text-foreground border border-border',
    severity: 'border-transparent bg-[--color-severity-moderate] text-white hover:bg-[--color-severity-moderate-hover]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
