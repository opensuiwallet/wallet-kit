import { useEffect, useRef } from "react";
import { isNonEmptyArray, Storage } from "../utils";
import { MyWallet, StorageKey } from "../types";

export function useAutoConnect(
  select: (name: string) => Promise<void>,
  allAvailableWallets: MyWallet[],
  autoConnect: boolean
) {
  const init = useRef(false);

  useEffect(() => {
    if (!autoConnect || init.current || !isNonEmptyArray(allAvailableWallets))
      return;

    const storage = new Storage();
    const lastConnectedWalletName = storage.getItem(
      StorageKey.LAST_CONNECT_WALLET_NAME
    );
    if (!lastConnectedWalletName) return;

    if (
      allAvailableWallets.find((item) => item.name == lastConnectedWalletName)
    ) {
      select(lastConnectedWalletName);
      init.current = true;
    }
  }, [allAvailableWallets]);
}
