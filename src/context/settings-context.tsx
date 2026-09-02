import { SuiGrpcClient } from '@mysten/sui/grpc';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useIsClient } from 'usehooks-ts';

import { MAINNET_RPC_URL } from '@/lib/constants';

interface SettingsContext {
  suiGrpcClient: SuiGrpcClient;
}

const defaultContextValue: SettingsContext = {
  suiGrpcClient: new SuiGrpcClient({
    network: 'mainnet',
    baseUrl: MAINNET_RPC_URL,
  }),
};

const SettingsContext = createContext<SettingsContext>(defaultContextValue);

export const useSettingsContext = () => useContext(SettingsContext);

export function SettingsContextProvider({ children }: PropsWithChildren) {
  const suiGrpcClient = useMemo(
    () =>
      new SuiGrpcClient({
        network: 'mainnet',
        baseUrl: MAINNET_RPC_URL,
      }),
    []
  );

  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <SettingsContext.Provider value={{ suiGrpcClient }}>
      {children}
    </SettingsContext.Provider>
  );
}
