import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

interface ILoaderProps {
  className?: string;
}

export const Loader = ({ className }: ILoaderProps) => {
  const { mobile } = useBreakpoint();

  return (
    <div
      className={cn(
        'h-18 w-18 shrink-0 bg-inherit p-0.5',
        {
          'h-14 w-14': mobile,
        },
        className
      )}
    >
      <div className="relative size-full animate-spin overflow-hidden rounded-full bg-primary-50 p-2">
        <div className="relative z-10 size-full rounded-full bg-background transition-background dark:bg-black"></div>
        <div className="absolute left-0 top-0 size-full translate-x-1/2 bg-primary-400">
          <div className="absolute left-0 top-0 size-2 -translate-x-1/2 rounded-full bg-inherit"></div>
          <div className="absolute bottom-0 left-0 size-2 -translate-x-1/2 rounded-full bg-inherit"></div>
        </div>
      </div>
    </div>
  );
};
