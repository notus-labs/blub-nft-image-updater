import Image from 'next/image';

import { useWalletContext } from '@/context/wallet-context';
import { useIsAndroid } from '@/hooks/useIsAndroid';
import { useIsiOS } from '@/hooks/useIsiOS';
import useBreakpoint from '@/hooks/useBreakpoint';
import { WalletConnector, WalletType } from '@/modules/wallet/@types';
import { cn } from '@/utils/twind';

import { X } from '@phosphor-icons/react';
import { PataraIcon } from '../icons';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardHeaderItem } from '../ui/card';

interface WalletDialogProps {
  onClose: () => void;
}

export const WalletDialog = ({ onClose }: WalletDialogProps) => {
  const { walletConnectors } = useWalletContext();
  const { mobile } = useBreakpoint();

  return (
    <div
      className={cn(
        'z-5 fixed inset-0 left-0 top-0 flex h-full w-screen flex-col items-center bg-background py-4 transition-background dark:bg-black',
        {
          'pb-0': mobile,
        }
      )}
    >
      <PataraIcon className="mb-4 aspect-square h-10 shrink-0" />
      <Button
        className="absolute right-4 top-4 h-10 w-10 p-0"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
      <div className="w-full flex-1 shrink-0"></div>

      <Card
        className={cn(
          'absolute left-1/2 top-1/2 z-50 flex max-h-screen w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-scroll bg-background transition-background dark:bg-black',
          {
            'max-w-screen relative left-0 top-0 translate-x-0 translate-y-0 rounded-b-none':
              mobile,
          }
        )}
      >
        <CardHeader className="mx-2 mb-8 mt-6 flex-col gap-4 p-0 tracking-normal">
          <CardHeaderItem className="text-heading-5 font-semibold">
            Connect a Wallet
          </CardHeaderItem>
          <CardHeaderItem>
            <p className="max-w-md text-balance text-center text-paragraph font-medium leading-[1.125rem] text-patara-light-mode-950 dark:text-patara-dark-mode-950">
              You need a wallet to check and fix your Blub NFTs. Connect your
              wallet to get started.
            </p>
          </CardHeaderItem>
        </CardHeader>
        <CardContent
          variant="primary"
          className="overflow-y-scroll hidden-scroll"
        >
          <div className="flex flex-col gap-1">
            {walletConnectors.map((walletConnector) => (
              <WalletConnectorItem
                key={walletConnector.name}
                walletConnector={walletConnector}
              />
            ))}
            {walletConnectors.length === 0 && (
              <p className="flex items-center justify-center py-10 text-sm font-medium text-patara-light-mode-950 dark:text-patara-dark-mode-950">
                No wallets detected. Please install a Sui wallet.
              </p>
            )}
          </div>

          <div className="mb-6 mt-8 flex w-full flex-col text-center text-metadata-1 font-normal tracking-normal text-patara-light-mode-950 dark:text-patara-dark-mode-950">
            <div>By connecting a wallet, you will be asked to sign</div>
            <div>only the image-host update on Blub NFTs you own.</div>
          </div>
        </CardContent>
      </Card>

      {!mobile && <div className="w-full flex-1 shrink-0"></div>}

      <div className="absolute bottom-0 size-[58.5rem] translate-y-1/2 bg-gradient-radial-wallet-dialog"></div>
    </div>
  );
};

const WalletConnectorItem = ({
  walletConnector,
}: {
  walletConnector: WalletConnector;
}) => {
  const { connectWallet } = useWalletContext();

  const isiOS = useIsiOS();
  const isAndroid = useIsAndroid();

  const downloadUrl = isiOS
    ? walletConnector.downloadUrls?.iOS
    : isAndroid
      ? walletConnector.downloadUrls?.android
      : walletConnector.downloadUrls?.extension;

  const onClick = () => {
    if (
      walletConnector.type === WalletType.WEB ||
      walletConnector.isInstalled
    ) {
      connectWallet(walletConnector);
      return;
    }

    if (downloadUrl) window.open(downloadUrl, '_blank');
  };

  if (
    !(walletConnector.type === WalletType.WEB || walletConnector.isInstalled) &&
    !downloadUrl
  )
    return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-lg bg-patara-light-mode-200 p-4 transition-all hover:bg-patara-light-mode-300 dark:bg-patara-dark-mode-200 dark:hover:bg-patara-dark-mode-300"
    >
      <div className="flex flex-row items-center gap-2 text-sm font-semibold tracking-tight">
        <Image
          src={walletConnector.iconUrl ?? ''}
          alt={walletConnector.name}
          className="size-10 rounded-full"
          width={32}
          height={32}
        />
        {walletConnector.name}
      </div>
      <div
        className={cn(
          'flex h-6 w-16 items-center justify-center rounded text-metadata-1 font-medium transition-all',
          {
            'bg-primary-500/[12%] text-primary-500 hover:text-primary-600':
              !walletConnector.isInstalled,
            'bg-light-mode-green-100 text-light-mode-green-500':
              walletConnector.isInstalled,
          }
        )}
      >
        {walletConnector.isInstalled ? 'Installed' : 'Install'}
      </div>
    </button>
  );
};
