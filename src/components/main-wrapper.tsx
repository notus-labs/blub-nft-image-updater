import React from 'react';

import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

interface MainWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const MainWrapper = ({ children, id, className }: MainWrapperProps) => {
  const { mobile } = useBreakpoint();

  return (
    <div
      id={id}
      className={cn(
        'mx-auto flex max-w-[65.5rem] flex-col',
        {
          'px-2': mobile,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
