import {
  SuiClientProvider,
  useAccounts,
  useCurrentAccount,
  useCurrentWallet,
  WalletProvider,
} from '@mysten/dapp-kit';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { WalletConnector } from '@/modules/wallet/@types';
import { DEFAULT_EXTENSION_WALLET_NAMES } from '@/modules/wallet/data/wallet-connectors';
import { useConnectWalletWrapper } from '@/modules/wallet/hooks/useConnectWalletWrapper';
import { useDisconnectWalletWrapper } from '@/modules/wallet/hooks/useDisconnectWalletWrapper';
import {
  SignedExecutedTransaction,
  useSignExecuteAndWaitForTransaction,
} from '@/modules/wallet/hooks/useSignExecuteAndWaitForTransaction';
import { useSwitchAccountWrapper } from '@/modules/wallet/hooks/useSwitchAccountWrapper';
import { useWalletConnectors } from '@/modules/wallet/hooks/useWalletConnectors';

import { useSettingsContext } from './settings-context';

interface WalletContext {
  walletConnectors: WalletConnector[];
  walletConnector?: WalletConnector;
  connectWallet: (walletConnector: WalletConnector) => void;
  disconnectWallet: () => void;

  accounts: readonly WalletAccount[];
  account?: WalletAccount;
  switchAccount: (
    account: WalletAccount,
    addressNameServiceName?: string
  ) => void;

  address?: string;
  signExecuteAndWaitForTransaction: (
    transaction: Transaction
  ) => Promise<SignedExecutedTransaction>;
}

const WalletContext = createContext<WalletContext>({
  walletConnectors: [],
  walletConnector: undefined,
  connectWallet: () => {
    throw new Error('WalletContextProvider not initialized');
  },
  disconnectWallet: () => {
    throw new Error('WalletContextProvider not initialized');
  },

  accounts: [],
  account: undefined,
  switchAccount: () => {
    throw new Error('WalletContextProvider not initialized');
  },

  address: undefined,
  signExecuteAndWaitForTransaction: async () => {
    throw new Error('WalletContextProvider not initialized');
  },
});

function Inner({ children }: PropsWithChildren) {
  const walletConnectors = useWalletConnectors();

  const { currentWallet: rawWallet } = useCurrentWallet();
  const walletConnector = useMemo(
    () =>
      rawWallet
        ? walletConnectors.find((w) => w.name === rawWallet.name)
        : undefined,
    [rawWallet, walletConnectors]
  );

  const connectWalletWrapper = useConnectWalletWrapper();
  const disconnectWalletWrapper = useDisconnectWalletWrapper();

  const accounts = useAccounts();
  const account = useCurrentAccount() ?? undefined;

  const switchAccountWrapper = useSwitchAccountWrapper();

  const signExecuteAndWaitForTransaction = useSignExecuteAndWaitForTransaction({
    account,
  });

  const contextValue = useMemo(
    () => ({
      walletConnectors,
      walletConnector,
      connectWallet: connectWalletWrapper.connectWallet,
      disconnectWallet: disconnectWalletWrapper.disconnectWallet,

      accounts,
      account,
      switchAccount: switchAccountWrapper.switchAccount,

      address: account?.address,
      signExecuteAndWaitForTransaction,
    }),
    [
      walletConnectors,
      walletConnector,
      connectWalletWrapper,
      disconnectWalletWrapper,
      accounts,
      account,
      switchAccountWrapper,
      signExecuteAndWaitForTransaction,
    ]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

const SuiNSContext = createContext<{
  addressNameServiceNameMap: Record<string, string | undefined>;
  getLabel: (address?: string) => string;
}>({
  addressNameServiceNameMap: {},
  getLabel: () => '',
});

function SuiNSProvider({ children }: PropsWithChildren) {
  const { suiGrpcClient } = useSettingsContext();
  const { accounts, address } = useWalletContext();

  const [addressNameServiceNameMap, setAddressNameServiceNameMap] = useState<
    Record<string, string | undefined>
  >({});

  const addressesBeingLookedUpRef = useRef<string[]>([]);
  const addressesToLookUp = useMemo(
    () =>
      Array.from(
        new Set(
          [address, ...accounts.map((_account) => _account.address)].filter(
            Boolean
          ) as string[]
        )
      ).filter(
        (_address) =>
          !Object.keys(addressNameServiceNameMap).includes(_address) &&
          !addressesBeingLookedUpRef.current.includes(_address)
      ),
    [address, accounts, addressNameServiceNameMap]
  );

  useEffect(() => {
    (async () => {
      if (addressesToLookUp.length === 0) return;

      try {
        addressesBeingLookedUpRef.current.push(...addressesToLookUp);

        const result = await Promise.all(
          addressesToLookUp.map((_address) =>
            resolveDefaultNameServiceName(suiGrpcClient, _address)
          )
        );

        setAddressNameServiceNameMap((o) =>
          result.reduce(
            (acc, name, index) => ({
              ...acc,
              [addressesToLookUp[index]]: name,
            }),
            o
          )
        );
      } catch {
        setAddressNameServiceNameMap((o) =>
          addressesToLookUp.reduce(
            (acc, _address) => ({ ...acc, [_address]: undefined }),
            o
          )
        );
      }
    })();
  }, [addressesToLookUp, suiGrpcClient]);

  const getLabel = useCallback(
    (address?: string) =>
      address
        ? (addressNameServiceNameMap[address] ??
          accounts.find((_account) => _account.address === address)?.label ??
          '')
        : '-',
    [addressNameServiceNameMap, accounts]
  );

  return (
    <SuiNSContext.Provider value={{ addressNameServiceNameMap, getLabel }}>
      {children}
    </SuiNSContext.Provider>
  );
}

export function WalletContextProvider({ children }: PropsWithChildren) {
  const appName = 'Blub NFT Image Fixer';

  return (
    <SuiClientProvider>
      <WalletProvider
        preferredWallets={DEFAULT_EXTENSION_WALLET_NAMES}
        autoConnect
        slushWallet={{ name: appName }}
      >
        <Inner>
          <SuiNSProvider>{children}</SuiNSProvider>
        </Inner>
      </WalletProvider>
    </SuiClientProvider>
  );
}

export const useWalletContext = () => useContext(WalletContext);
export const useSuiNSContext = () => useContext(SuiNSContext);

async function resolveDefaultNameServiceName(
  suiGrpcClient: SuiGrpcClient,
  address: string
): Promise<string | undefined> {
  try {
    const { response } = await suiGrpcClient.nameService.reverseLookupName({
      address,
    });
    return response.record?.name ?? undefined;
  } catch {
    return undefined;
  }
}
