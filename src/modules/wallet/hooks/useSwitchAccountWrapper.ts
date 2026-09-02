import { useSwitchAccount } from '@mysten/dapp-kit';
import { WalletAccount } from '@mysten/wallet-standard';
import { useCallback } from 'react';

import { useToast } from '@/components/toaster';
import { formatAddress } from '@/lib/format';

export const useSwitchAccountWrapper = () => {
  const { mutate: switchAccount } = useSwitchAccount();
  const { toast } = useToast();

  const switchAccountWrapper = useCallback(
    (_account: WalletAccount, addressNameServiceName?: string) => {
      const accountLabel =
        _account?.label ??
        addressNameServiceName ??
        formatAddress(_account.address);

      try {
        switchAccount(
          { account: _account },
          {
            onSuccess: () => {
              toast.info(`Switched to ${accountLabel}`, {
                description: _account?.label
                  ? (addressNameServiceName ?? formatAddress(_account.address))
                  : undefined,
              });
            },
            onError: () => {
              toast.error(`Failed to switch to ${accountLabel}`);
            },
          }
        );
      } catch {
        toast.error(`Failed to switch to ${accountLabel}`);
      }
    },
    [switchAccount]
  );

  return { switchAccount: switchAccountWrapper };
};
