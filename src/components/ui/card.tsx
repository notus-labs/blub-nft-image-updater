import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

const cardVariants = cva(
  'rounded-3xl border border-patara-light-mode-200 text-patara-black-100 transition-background dark:border-patara-dark-mode-200 dark:text-patara-white-100',
  {
    variants: {
      variant: {
        primary: 'bg-transparent dark:bg-transparent',
        secondary: 'bg-patara-light-mode-100 dark:bg-patara-dark-mode-100',
      },
      padding: {
        default: 'p-2',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      padding: 'default',
    },
  }
);

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding }), className)}
    {...props}
  />
));
Card.displayName = 'Card';

const cardContentVariants = cva('rounded-xl transition-background', {
  variants: {
    variant: {
      primary: 'bg-patara-light-mode-100 dark:bg-patara-dark-mode-100',
      secondary: 'bg-background dark:bg-black',
    },
    padding: {
      default: 'p-2',
      none: 'p-0',
    },
  },
  defaultVariants: {
    variant: 'primary',
    padding: 'default',
  },
});

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof cardContentVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden',
      cardContentVariants({ variant, padding }),
      className
    )}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const cardHeaderVariants = cva(
  'flex flex-row items-center justify-between px-6 text-heading-6 font-medium tracking-tighter',
  {
    variants: {
      paddingY: {
        default: 'pb-5 pt-3',
        small: 'pb-[1.6875rem] pt-[0.8125rem]',
      },
      mobile: {
        true: 'px-2 pb-4 pt-2 text-subheader tracking-normal',
        false: '',
      },
    },
    defaultVariants: {
      paddingY: 'default',
    },
  }
);

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, paddingY, ...props }, ref) => {
  const { mobile } = useBreakpoint();
  return (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ paddingY, mobile }), className)}
      {...props}
    />
  );
});
CardHeader.displayName = 'CardHeader';

const CardHeaderItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
CardHeaderItem.displayName = 'CardHeaderItem';

export { Card, CardContent, CardHeader, CardHeaderItem };
