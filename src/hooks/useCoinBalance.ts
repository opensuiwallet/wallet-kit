import { useWalletKit } from "./useWalletKit";
import { SUI_TYPE_ARG } from "@mysten/sui.js";
import { useQuery } from "react-query";
import { queryKey } from "../utils";
import { QueryKey } from "../types";
import { Account, Provider } from "../core";
import { useCallback } from "react";
import { useChain } from "./useChain";

export interface UseCoinBalanceParams {
  address?: string;
  typeArg?: string;
  chainId?: string;
}

export function useCoinBalance(params?: UseCoinBalanceParams) {
  const wallet = useWalletKit();
  const {
    address = wallet.address,
    typeArg = SUI_TYPE_ARG,
    chainId = wallet.connectedChain?.id,
  } = params || {};
  const chain = useChain(chainId);

  const key = queryKey(QueryKey.COIN_BALANCE, {
    address,
    typeArg,
    chainId,
  });

  const getCoinBalance = useCallback(() => {
    if (!address || !chain) return BigInt(0);

    const provider = new Provider(chain.rpcUrl);
    const account = new Account(provider, address);
    return account.balance.get(typeArg);
  }, [chain, address]);

  return useQuery(key, getCoinBalance, {
    initialData: BigInt(0),
  });
}
