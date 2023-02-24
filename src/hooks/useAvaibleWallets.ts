import { MyDefaultWallet, MyWallet } from "../types";
import { useWalletAdapterDetection } from "./useWalletDetection";
import { useMemo } from "react";
import { isNonEmptyArray } from "../utils";

export const useAvailableWallets = (defaultWallets: MyDefaultWallet[]) => {
  const { data: availableWalletAdapters } = useWalletAdapterDetection();

  // recommended wallets
  const recommendedWallets = useMemo(() => {
    if (!isNonEmptyArray(defaultWallets)) return [];
    if (!isNonEmptyArray(availableWalletAdapters)) {
      return defaultWallets.slice(0, 1).map(
        (item) =>
          ({
            ...item,
            adapter: undefined,
            installed: false,
          } as MyWallet)
      );
    }

    return defaultWallets.slice(0, 1).map((item) => {
      const foundAdapter = availableWalletAdapters?.find(
        (walletAdapter) => item.name === walletAdapter.name
      );
      if (foundAdapter) {
        return {
          ...item,
          adapter: foundAdapter,
          installed: true,
        } as MyWallet;
      }
      return {
        ...item,
        adapter: undefined,
        installed: false,
      } as MyWallet;
    });
  }, [defaultWallets, availableWalletAdapters]);

  // configured wallets
  const configuredWallets = useMemo(() => {
    if (!isNonEmptyArray(defaultWallets)) return [];
    if (!isNonEmptyArray(availableWalletAdapters)) {
      return defaultWallets.map(
        (item) =>
          ({
            ...item,
            adapter: undefined,
            installed: false,
          } as MyWallet)
      );
    }

    return defaultWallets.map((item) => {
      const foundAdapter = availableWalletAdapters.find(
        (walletAdapter) => item.name === walletAdapter.name
      );
      if (foundAdapter) {
        return {
          ...item,
          adapter: foundAdapter,
          installed: true,
        } as MyWallet;
      }
      return {
        ...item,
        adapter: undefined,
        installed: false,
      } as MyWallet;
    });
  }, [defaultWallets, availableWalletAdapters]);

  // detected wallets
  const detectedWallets = useMemo(() => {
    if (!isNonEmptyArray(availableWalletAdapters)) return [];
    return availableWalletAdapters
      .filter((adapter) => {
        // filter adapters not shown in the configured list
        return !defaultWallets.find((wallet) => wallet.name === adapter.name);
      })
      .map((adapter) => {
        // normalized detected adapter to MyWallet
        return {
          name: adapter.name,
          adapter: adapter,
          installed: true,
          iconUrl: adapter.icon,
          downloadUrl: "",
        };
      });
  }, [defaultWallets, availableWalletAdapters]);

  // filter installed wallets
  const allAvailableWallets = useMemo(() => {
    return [...configuredWallets, ...detectedWallets].filter(
      (wallet) => wallet.installed
    );
  }, [configuredWallets, detectedWallets]);

  return {
    allAvailableWallets,
    recommendedWallets,
    configuredWallets,
    detectedWallets,
  };
};
