import { CaretDown, Power } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { WalletDialog } from '@/components/dialogs/wallet-dialog';
import { UserIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useSuiNSContext, useWalletContext } from '@/context/wallet-context';
import useBreakpoint from '@/hooks/useBreakpoint';
import { formatAddress } from '@/lib/format';
import { UserAccountList } from '@/modules/wallet/components/user-account-list';
import { cn } from '@/utils/twind';

export const UserAccountNav = () => {
  const { address, disconnectWallet } = useWalletContext();
  const { getLabel } = useSuiNSContext();
  const [expanded, setExpanded] = useState(false);

  const { mobile } = useBreakpoint();

  if (mobile) {
    return <MobileView />;
  }

  return (
    <div
      className="relative rounded-lg bg-patara-light-mode-100 p-1 transition-background hover:bg-patara-light-mode-200 dark:bg-patara-dark-mode-100 dark:hover:bg-patara-dark-mode-200"
      onClick={() => setExpanded(!expanded)}
      role="none"
    >
      <div className="flex cursor-pointer flex-nowrap items-center">
        <div className="flex items-center gap-2 rounded bg-patara-light-mode-300 p-1 transition-background dark:bg-patara-dark-mode-300">
          <div className="shrink-0">
            <UserIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-paragraph font-semibold leading-[1.1] text-patara-black dark:text-patara-white">
              {getLabel(address)}
            </span>
            <span className="text-metadata-1 font-normal text-patara-light-mode-950 dark:text-patara-dark-mode-950">
              {address ? formatAddress(address) : '-'}
            </span>
          </div>
        </div>
        <div className="shrink-0 p-2">
          <CaretDown
            weight="regular"
            className="size-6 text-patara-black-100 dark:text-patara-white-100"
          />
        </div>
      </div>

      <div className="absolute right-0 top-0">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={cn(
                'pointer-events-none fixed inset-0 z-[9998] bg-black/20 dark:bg-black/60',
                {
                  'pointer-events-auto': open,
                }
              )}
              onClick={() => setExpanded(false)}
              role="none"
            />
          )}
        </AnimatePresence>

        <div
          className={cn(
            'absolute right-0 top-0 z-[9999] flex max-h-[calc(100vh-2rem)] w-100 translate-x-full flex-col rounded-xl border bg-background p-2 opacity-0 transition-all duration-500 dark:bg-black',
            {
              'translate-x-0 opacity-100': expanded,
            }
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          role="none"
        >
          <div className="mx-2 mt-2 flex items-center justify-between">
            <div>
              <h5 className="text-title font-medium text-patara-light-mode-950 dark:text-patara-dark-mode-950">
                Connected Wallet
              </h5>
            </div>
            <div
              className="flex size-10 cursor-pointer items-center justify-center rounded border transition-background hover:bg-patara-light-mode-200 dark:hover:bg-patara-dark-mode-200"
              onClick={() => disconnectWallet()}
              role="none"
            >
              <Power className="size-6 text-patara-light-mode-950 dark:text-patara-dark-mode-950" />
            </div>
          </div>

          <div className="my-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 shrink-0">
                <UserIcon className="h-15 w-15" />
              </div>
              <p className="text-heading-6 font-medium text-patara-black-100 dark:text-patara-white-100">
                {getLabel(address)}
              </p>
              <p className="text-paragraph font-medium text-patara-light-mode-950 dark:text-patara-dark-mode-950">
                {address ? formatAddress(address) : '-'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll rounded-lg bg-patara-light-mode-100 p-2 hidden-scroll transition-background dark:bg-patara-dark-mode-100">
            <UserAccountList />
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileView = () => {
  const { address, disconnectWallet } = useWalletContext();
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  if (!address) {
    return (
      <>
        <div className="relative flex flex-nowrap items-center justify-self-end px-2">
          <Button
            id="id-btn-connect-wallet"
            className="h-10 w-full"
            onClick={() => setWalletDialogOpen(true)}
          >
            Connect Wallet
          </Button>
          {walletDialogOpen && (
            <WalletDialog onClose={() => setWalletDialogOpen(false)} />
          )}
        </div>
      </>
    );
  }
  const { getLabel } = useSuiNSContext();

  const label = getLabel(address);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex cursor-pointer items-center gap-1 rounded-full bg-foreground/[0.08] p-0.5 dark:bg-patara-white/[0.12]">
          <div className="shrink-0">
            <UserIcon className="size-9" />
          </div>
          <span
            className="pr-2.5 text-subheader font-semibold tracking-tight dark:text-patara-white-200"
            title={address}
          >
            {label || (address ? formatAddress(address, 3) : '-')}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader
          title="Connected Wallet"
          actionButton={
            <div
              className="hover:bg-patara-light-100 flex size-10 cursor-pointer items-center justify-center rounded border transition-colors"
              onClick={() => disconnectWallet()}
              role="none"
            >
              <Power className="size-6 text-[#343330]" />
            </div>
          }
        />
        <div className="w-full">
          <div className="my-8 mt-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 shrink-0">
                <UserIcon className="h-15 w-15" />
              </div>
              <p className="text-heading-6 font-medium text-foreground">
                {getLabel(address)}
              </p>
              <p className="text-paragraph font-medium text-[#303030]">
                {address ? formatAddress(address) : '-'}
              </p>
            </div>
          </div>

          <div className="bg-patara-light-50 rounded-lg p-2">
            <UserAccountList />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
