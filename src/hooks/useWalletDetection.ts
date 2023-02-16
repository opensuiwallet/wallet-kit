import { useEffect, useRef, useState } from "react";
import { DEPRECATED_getWallets, Wallet, Wallets } from "@wallet-standard/core";
import { MyWalletAdapter } from "../types";
import { Adapter } from "../core";
import { isNonEmptyArray, isStandardWalletCompatible } from "../utils";

export function useWalletAdapterDetection() {
  const standardWalletManager = useRef<Wallets>();
  const [availableWalletAdapters, setAvailableWalletAdapters] = useState<
    MyWalletAdapter[]
  >([]);

  function getInitStandardWalletAdapters(): Wallet[] {
    if (!standardWalletManager.current) return [];
    const initWalletAdapters = standardWalletManager.current.get();
    return initWalletAdapters.filter(isStandardWalletCompatible);
  }

  useEffect(() => {
    standardWalletManager.current = DEPRECATED_getWallets();
    const initWalletAdapters = getInitStandardWalletAdapters();

    if (isNonEmptyArray(initWalletAdapters)) {
      setAvailableWalletAdapters(
        initWalletAdapters.map((newAdapter) => new Adapter(newAdapter))
      );
    }

    const clearListeners = standardWalletManager.current.on(
      "register",
      (...newAdapters: Wallet[]) => {
        if (!standardWalletManager.current) return;
        const initWalletAdapters = getInitStandardWalletAdapters();
        const allAdapters = [...initWalletAdapters];
        newAdapters
          .filter(isStandardWalletCompatible)
          .filter(
            (newAdapter) =>
              !allAdapters.find(
                (existAdapter) => existAdapter.name === newAdapter.name
              )
          )
          .forEach((newAdapter) => {
            allAdapters.push(newAdapter);
          });
        setAvailableWalletAdapters(
          allAdapters.map((wallet) => new Adapter(wallet))
        );
      }
    );
    return () => {
      clearListeners();
    };
  }, []);

  return {
    data: availableWalletAdapters,
  };
}
