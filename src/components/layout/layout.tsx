import { useCurrentWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useIsClient } from 'usehooks-ts';

import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/twind';

import { Loader } from '../loader';
import { Header } from './header/header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isReady } = useRouter();
  const isClient = useIsClient();
  const { isConnecting: connecting } = useCurrentWallet();
  const { mobile } = useBreakpoint();

  if (!isClient || !isReady || connecting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background transition-background dark:bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="group/layout relative grid min-h-screen grid-rows-[auto_1fr] overflow-x-clip">
      <Header />
      <main
        className={cn('z-0 overflow-hidden py-5', {
          'px-4': !mobile,
        })}
      >
        {children}
      </main>
    </div>
  );
};
