import { StandardWalletAdapterWallet, Wallet } from "@mysten/wallet-standard";

export function isNonEmptyArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function isStandardWalletCompatible(
  wallet: Wallet
): wallet is StandardWalletAdapterWallet {
  return (
    "standard:connect" in wallet.features &&
    "standard:events" in wallet.features &&
    "sui:signAndExecuteTransaction" in wallet.features
  );
}

export default function isValidKey(
  key: number | string,
  object: object
): key is keyof typeof object {
  return key in object;
}
