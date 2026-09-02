import {
  WalletIcon,
  WalletWithRequiredFeatures,
} from '@mysten/wallet-standard';

export enum WalletType {
  EXTENSION = 'extension',
  WEB = 'web',
}

export enum WalletName {
  SUI_WALLET = 'Sui Wallet',
  NIGHTLY = 'Nightly',
  SUIET = 'Suiet',
  MSAFE_WALLET = 'MSafe Wallet',
  STASHED = 'Stashed',
}

type WalletPlatform = 'iOS' | 'android' | 'extension';

export interface WalletConnector {
  name: string;
  isInstalled?: boolean;
  iconUrl?: WalletIcon;
  type: WalletType;
  downloadUrls?: Record<WalletPlatform, string | undefined>;
  raw?: WalletWithRequiredFeatures;
}
