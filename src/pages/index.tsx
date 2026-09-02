import { useState } from 'react';

import { WalletDialog } from '@/components/dialogs/wallet-dialog';
import { DataNotAvailable } from '@/components/data-not-available';
import { MainWrapper } from '@/components/main-wrapper';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/context/wallet-context';
import useBreakpoint from '@/hooks/useBreakpoint';
import { BlubImageMigration } from '@/modules/portfolio/components/blub-image-migration';
import { cn } from '@/utils/twind';

export default function Home() {
  const { address } = useWalletContext();
  const { mobile } = useBreakpoint();

  return (
    <MainWrapper
      className={cn('mb-5 mt-5', {
        'mt-4': mobile,
      })}
    >
      {address ? <BlubImageMigration /> : <ConnectWalletPrompt />}
    </MainWrapper>
  );
}

function ConnectWalletPrompt() {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <DataNotAvailable
        className="w-full border-none"
        message="Connect your wallet to check your Blub NFTs."
      />
      <Button onClick={() => setIsWalletDialogOpen(true)}>
        Connect Wallet
      </Button>
      {isWalletDialogOpen && (
        <WalletDialog onClose={() => setIsWalletDialogOpen(false)} />
      )}
    </div>
  );
}
