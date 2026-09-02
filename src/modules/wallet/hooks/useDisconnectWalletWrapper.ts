import { useDisconnectWallet } from '@mysten/dapp-kit';
import { useCallback } from 'react';

import { useToast } from '@/components/toaster';

export const useDisconnectWalletWrapper = () => {
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { toast } = useToast();

  const disconnectWalletWrapper = useCallback(() => {
    try {
      disconnectWallet(undefined, {
        onSuccess: () => {
          toast.info('Disconnected wallet');
        },
        onError: () => {
          toast.error('Failed to disconnect wallet');
        },
      });
    } catch {
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnectWallet]);

  return { disconnectWallet: disconnectWalletWrapper };
};
