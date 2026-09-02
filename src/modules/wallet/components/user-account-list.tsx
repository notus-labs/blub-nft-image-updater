import { WalletAccount } from '@mysten/wallet-standard';
import { ArrowCircleUpRight, Check, Copy } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';

import { UserIcon } from '@/components/icons';
import { useSuiNSContext, useWalletContext } from '@/context/wallet-context';
import { buildAddressUrl } from '@/lib/constants';
import { formatAddress } from '@/lib/format';
import { cn } from '@/utils/twind';

interface IUserAccountList {
  variant?: 'primary' | 'secondary';
}

export const UserAccountList = ({ variant = 'primary' }: IUserAccountList) => {
  const { address, accounts, switchAccount } = useWalletContext();
  return (
    <div
      className={cn('space-y-2', {
        'space-y-1': variant === 'secondary',
      })}
    >
      {accounts.length > 0 ? (
        accounts?.map((account) => (
          <UserAccount
            key={account.address}
            variant={variant}
            account={account}
            onClick={() => switchAccount(account)}
          />
        ))
      ) : (
        <UserAccount
          account={{
            address,
          }}
          variant={variant}
          active
        />
      )}
    </div>
  );
};

const UserAccount = ({
  account,
  variant,
  active,
  onClick,
}: {
  account: Partial<WalletAccount>;
  variant: 'primary' | 'secondary';
  active?: boolean;
  onClick?: () => void;
}) => {
  const secondary = variant === 'secondary';
  const { getLabel } = useSuiNSContext();
  const addressUrl = buildAddressUrl(account.address || '');
  const [copied, setCopied] = useState(false);

  const copyAddressToClipboard = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.address || '');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      className={cn(
        'h-18 w-full rounded border border-patara-light-mode-200 bg-background transition-background hover:bg-patara-light-mode-200 dark:border-patara-dark-mode-200 dark:bg-patara-dark-mode-200 dark:hover:bg-patara-dark-mode-300',
        {
          'border-primary-100 outline-primary-50/[44%]': active && !secondary,
          'h-16 border-patara-light-mode-200 dark:border-patara-dark-mode-200':
            secondary,
        }
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <UserIcon
              className={cn('size-10', {
                'size-8': secondary,
              })}
            />
          </div>
          <div className="flex flex-col">
            {getLabel(account.address) && (
              <p
                className={cn(
                  'h-5 text-start text-subheader font-semibold text-patara-black-100 dark:text-patara-white-100',
                  {
                    'h-4 text-paragraph': secondary,
                  }
                )}
              >
                {getLabel(account.address)}
              </p>
            )}
            <p
              className={cn(
                'h-5 text-start text-paragraph font-medium text-patara-light-mode-950 dark:text-patara-dark-mode-950',
                {
                  'h-4 text-metadata-1': secondary,
                }
              )}
            >
              {account?.address ? formatAddress(account?.address) : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-patara-light-mode-950 dark:text-patara-dark-mode-950">
          {!copied ? (
            <Copy
              className="size-6 cursor-pointer"
              onClick={copyAddressToClipboard}
              role="button"
            />
          ) : (
            <Check
              className="size-6 cursor-pointer"
              onClick={copyAddressToClipboard}
              role="button"
            />
          )}
          {!secondary && account.address && (
            <Link href={addressUrl} target="_blank">
              <ArrowCircleUpRight className="size-6 cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
    </button>
  );
};
