import { useWalletKit } from "./useWalletKit";
import { useMemo } from "react";

export function useChain(chainId?: string) {
  const wallet = useWalletKit();
  if (!chainId) return wallet.connectedChain;

  return useMemo(() => {
    return wallet.chains.find((w) => w.id === chainId);
  }, [chainId, wallet.chains]);
}
