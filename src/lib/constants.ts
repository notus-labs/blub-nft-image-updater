export const MAINNET_RPC_URL = 'https://fullnode.mainnet.sui.io:443';

export function buildAddressUrl(address: string) {
  return `https://suiscan.xyz/mainnet/account/${address}`;
}
