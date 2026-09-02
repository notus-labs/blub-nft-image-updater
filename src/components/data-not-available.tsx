import { SmileyXEyes } from '@phosphor-icons/react';

import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

interface IDataNotAvailableProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DataNotAvailable = ({
  message = 'No data available. Please check back later or try another filter.',
  className,
  size = 'md',
}: IDataNotAvailableProps) => {
  const { mobile } = useBreakpoint();

  return (
    <div
      className={cn(
        'flex h-136 items-center justify-center rounded-3xl border transition-background',
        {
          'h-30': size === 'sm',
          'h-56': mobile,
        },
        className
      )}
    >
      <div className="flex w-full max-w-108 flex-col items-center justify-center gap-4 text-balance text-center">
        <SmileyXEyes
          weight="fill"
          size={mobile ? 48 : 64}
          className={cn('text-patara-black-100 dark:text-patara-white-100')}
        />
        <p
          className={cn(
            'text-title font-medium text-patara-black-100 dark:text-patara-white-100',
            {
              'text-paragraph': size === 'sm' || mobile,
            }
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
