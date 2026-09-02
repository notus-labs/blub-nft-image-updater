import { useConnectWallet } from '@mysten/dapp-kit';
import { useCallback } from 'react';

import { useToast } from '@/components/toaster';

import { WalletConnector } from '../@types';

export const useConnectWalletWrapper = () => {
  const { mutate: connectWallet } = useConnectWallet();
  const { toast } = useToast();

  const connectWalletWrapper = useCallback(
    (walletConnector: WalletConnector) => {
      try {
        if (!walletConnector.raw) throw new Error('Missing wallet');

        connectWallet(
          { wallet: walletConnector.raw },
          {
            onSuccess: () => {
              toast.info(`Connected ${walletConnector.name}`);
            },
            onError: () => {
              toast.error(`Failed to connect ${walletConnector.name}`);
            },
          }
        );
      } catch {
        toast.error(`Failed to connect ${walletConnector.name}`);
      }
    },
    [connectWallet]
  );

  return { connectWallet: connectWalletWrapper };
};
