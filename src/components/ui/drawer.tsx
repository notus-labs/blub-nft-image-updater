import { X } from '@phosphor-icons/react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/utils/twind';

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/20', className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className="drawer-content fixed inset-x-0 bottom-0 z-50 flex h-auto max-h-[90%] flex-col"
      {...props}
    >
      <div
        className={cn(
          'relative flex max-h-full w-full flex-col overflow-hidden rounded-t-xl border bg-background transition-background dark:bg-patara-dark-mode-50',
          className
        )}
      >
        <div className="mx-auto mt-2 h-0.5 w-8 shrink-0 rounded-full bg-[#D9D9D9]" />
        <div className="flex-1 overflow-y-scroll">{children}</div>
      </div>
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-subheader font-medium leading-none text-[#303030]',
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  actionButton?: React.ReactNode;
};

const DrawerHeader = ({
  className,
  title,
  actionButton,
  ...props
}: DrawerHeaderProps) => (
  <div
    className={cn('grid gap-1.5 px-4 py-2 text-center sm:text-left', className)}
    {...props}
  >
    <div className="flex items-center justify-between">
      <DrawerTitle>{title}</DrawerTitle>
      {actionButton || (
        <DrawerPrimitive.Close className="cursor-pointer" role="none">
          <div className="flex size-10 items-center justify-center">
            <X weight="regular" className="size-6" />
          </div>
        </DrawerPrimitive.Close>
      )}
    </div>
  </div>
);
DrawerHeader.displayName = 'DrawerHeader';

export { Drawer, DrawerContent, DrawerHeader, DrawerTrigger };
