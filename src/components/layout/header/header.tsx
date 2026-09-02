import { useState } from 'react';

import { WalletDialog } from '@/components/dialogs/wallet-dialog';
import { PataraFullLogo, PataraIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/wallet-context';
import useBreakpoint from '@/hooks/useBreakpoint';

import Link from 'next/link';
import { UserAccountNav } from './user-account-nav';

export const Header = () => {
  const { mobile } = useBreakpoint();
  const { address } = useWalletContext();
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  if (mobile) {
    return <MobileHeader />;
  }

  return (
    <header className="group/header peer z-50 grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b bg-background px-4 transition-background dark:bg-black">
      <div />

      <div className="cursor-pointer">
        <Link href="/">
          <PataraFullLogo className="aspect-square h-10" />
        </Link>
      </div>

      <div className="relative flex flex-nowrap items-center justify-self-end">
        {!address && (
          <>
            <Button
              id="id-btn-connect-wallet"
              className="h-12"
              onClick={() => setWalletDialogOpen(true)}
            >
              Connect Wallet
            </Button>
            {walletDialogOpen && (
              <WalletDialog onClose={() => setWalletDialogOpen(false)} />
            )}
          </>
        )}
        {address && <UserAccountNav />}
      </div>
    </header>
  );
};

const MobileHeader = () => {
  return (
    <header className="group/header peer z-50 grid h-17 grid-cols-[auto_1fr_auto] items-center px-4">
      <div className="flex items-center justify-center">
        <Link href="/" className="block overflow-hidden rounded-full">
          <PataraIcon className="aspect-square h-9 w-9 shrink-0" />
        </Link>
      </div>

      <div />

      <div className="inline-flex flex-nowrap items-center gap-2">
        <UserAccountNav />
      </div>
    </header>
  );
};
