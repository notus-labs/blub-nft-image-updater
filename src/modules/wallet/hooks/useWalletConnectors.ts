import { useWallets as useWalletsAPI } from '@mysten/dapp-kit';
import { useMemo } from 'react';

import { WalletConnector, WalletName, WalletType } from '../@types';
import {
  DEFAULT_EXTENSION_WALLET_NAMES,
  WALLET_DOWNLOAD_URLS_MAP,
  WALLET_LOGO_MAP,
  WEB_WALLET_NAMES,
} from '../data/wallet-connectors';

const isInMsafeApp = () => {
  try {
    return (
      typeof window !== 'undefined' &&
      Array.from(window.location.ancestorOrigins)[0]?.includes('m-safe.io')
    );
  } catch {
    return false;
  }
};

export const useWalletConnectors = () => {
  const wallets__installed = useWalletsAPI();

  const getInstalledWallet = (name: string) =>
    wallets__installed.find((w) => w.name === name);

  const wallets__extension_default: WalletConnector[] = useMemo(() => {
    const msafeWallet = {
      name: WalletName.MSAFE_WALLET,
      iconUrl: getInstalledWallet(WalletName.MSAFE_WALLET)?.icon,
      type: WalletType.EXTENSION,
      downloadUrls: WALLET_DOWNLOAD_URLS_MAP[WalletName.MSAFE_WALLET],
    };

    if (isInMsafeApp()) return [msafeWallet];
    return [
      {
        name: WalletName.SUI_WALLET,
        iconUrl:
          getInstalledWallet(WalletName.SUI_WALLET)?.icon ??
          WALLET_LOGO_MAP[WalletName.SUI_WALLET],
        type: WalletType.EXTENSION,
        downloadUrls: WALLET_DOWNLOAD_URLS_MAP[WalletName.SUI_WALLET],
      },
      {
        name: WalletName.NIGHTLY,
        iconUrl:
          getInstalledWallet(WalletName.NIGHTLY)?.icon ??
          WALLET_LOGO_MAP[WalletName.NIGHTLY],
        type: WalletType.EXTENSION,
        downloadUrls: WALLET_DOWNLOAD_URLS_MAP[WalletName.NIGHTLY],
      },
      {
        name: WalletName.SUIET,
        iconUrl:
          getInstalledWallet(WalletName.SUIET)?.icon ??
          WALLET_LOGO_MAP[WalletName.SUIET],
        type: WalletType.EXTENSION,
        downloadUrls: WALLET_DOWNLOAD_URLS_MAP[WalletName.SUIET],
      },
      msafeWallet,
    ];
  }, [getInstalledWallet]);

  const wallets__extension_installed_default: WalletConnector[] = useMemo(
    () =>
      wallets__extension_default
        .filter((w) =>
          w.name === WalletName.MSAFE_WALLET
            ? isInMsafeApp()
            : !!getInstalledWallet(w.name)
        )
        .map((w) => ({
          ...w,
          isInstalled: true,
          raw: getInstalledWallet(w.name),
        })),
    [wallets__extension_default, getInstalledWallet]
  );

  const wallets__extension_installed_notDefault: WalletConnector[] =
    useMemo(() => {
      if (isInMsafeApp()) return [];

      return wallets__installed
        .filter(
          (w) => !DEFAULT_EXTENSION_WALLET_NAMES.includes(w.name as WalletName)
        )
        .filter((w) => !WEB_WALLET_NAMES.includes(w.name as WalletName))
        .map((w) => ({
          name: w.name,
          isInstalled: true,
          iconUrl: w.icon,
          type: WalletType.EXTENSION,
          raw: w,
        }));
    }, [wallets__installed]);

  const wallets__extension_notInstalled_default: WalletConnector[] = useMemo(
    () =>
      wallets__extension_default
        .filter((w) =>
          w.name === WalletName.MSAFE_WALLET
            ? !isInMsafeApp()
            : !getInstalledWallet(w.name)
        )
        .map((w) => ({ ...w, isInstalled: false })),
    [wallets__extension_default, getInstalledWallet]
  );

  const wallets__web: WalletConnector[] = useMemo(() => {
    if (isInMsafeApp()) return [];

    return [
      {
        name: WalletName.STASHED,
        iconUrl: getInstalledWallet(WalletName.STASHED)?.icon,
        type: WalletType.WEB,
        raw: getInstalledWallet(WalletName.STASHED),
      },
    ];
  }, [getInstalledWallet]);

  const walletConnectors = useMemo(
    () => [
      ...wallets__extension_installed_default,
      ...wallets__extension_installed_notDefault,
      ...wallets__extension_notInstalled_default,
      ...wallets__web,
    ],
    [
      wallets__extension_installed_default,
      wallets__extension_installed_notDefault,
      wallets__extension_notInstalled_default,
      wallets__web,
    ]
  );

  return walletConnectors;
};
