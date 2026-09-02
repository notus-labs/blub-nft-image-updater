import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/twind';

const buttonVariants = cva(
  'flex shrink-0 items-center justify-center whitespace-nowrap rounded text-center font-semibold transition-background',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500/[30%] disabled:bg-primary-500/[12%] disabled:text-primary-300 dark:disabled:bg-primary-500/[8%] dark:disabled:text-primary-700',
        secondary:
          'bg-patara-light-mode-100 text-patara-black-200 hover:bg-patara-light-mode-200 focus-visible:ring-patara-light-mode-200/[22%] disabled:bg-patara-light-mode-100/[66%] disabled:text-patara-light-mode-950 dark:bg-patara-dark-mode-100 dark:text-patara-white-200 dark:hover:bg-patara-dark-mode-200',
        accent:
          'bg-patara-black-200 text-patara-light-mode-100 hover:bg-patara-black-100 focus-visible:ring-patara-light-mode-200 disabled:bg-patara-light-mode-400 dark:bg-patara-white-200 dark:text-patara-dark-mode-100',
        emphasized:
          'bg-primary text-patara-light-mode-100 hover:bg-primary-500 focus-visible:ring-primary-500/10 disabled:bg-patara-light-mode-400 disabled:text-patara-light-mode-950 dark:disabled:bg-patara-dark-mode-400 dark:disabled:text-patara-dark-mode-950',
        muted:
          'border border-patara-light-mode-100 bg-background font-medium text-patara-light-mode-950 hover:bg-patara-light-mode-100 hover:text-patara-light-mode-800 focus-visible:bg-patara-light-mode-200 focus-visible:ring-patara-light-mode-200 disabled:bg-background disabled:text-patara-light-mode-400 dark:border-patara-dark-mode-100 dark:bg-black dark:text-patara-dark-mode-950 dark:hover:bg-patara-dark-mode-100',
        colorless:
          'border border-background text-patara-light-mode-950 hover:border-patara-light-mode-200 hover:text-foreground focus-visible:text-primary-50 disabled:text-patara-light-mode-400 dark:border-black dark:text-patara-dark-mode-950 dark:hover:border-patara-dark-mode-200',
        destructive:
          'bg-red-500/10 text-red-700 hover:bg-red-500/20 focus-visible:ring-red-500/10 disabled:bg-red-500/10 disabled:text-red-300',
      },
      outline: {
        true: 'border bg-background disabled:bg-background',
        false: '',
      },
      size: {
        default: 'h-15 px-4 text-subheader focus-visible:ring-4',
        sm: 'h-12 min-w-21 gap-2 p-2 text-paragraph',
        xs: 'h-11 min-w-16 gap-2 p-2',
        icon: 'aspect-square h-12 p-3',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        outline: true,
        className: 'border-primary-50/[88%]',
      },
      {
        variant: 'secondary',
        outline: true,
        className:
          'border-patara-light-mode-200 dark:border-patara-dark-mode-200',
      },
      {
        variant: 'accent',
        outline: true,
        className:
          'border-patara-black-100 text-patara-black-100 hover:text-patara-light-mode-100 disabled:border-current disabled:text-patara-light-mode-400 dark:text-patara-white-100',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, outline = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className, outline }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
