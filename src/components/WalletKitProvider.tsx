import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ConnectInput,
  SuiSignAndExecuteTransactionInput,
  WalletAccount,
} from "@mysten/wallet-standard";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAvailableWallets, useAutoConnect, WalletContext } from "../hooks";
import { WalletKitError, Storage, isNonEmptyArray } from "../utils";
import {
  defaultWallets as AllDefaultWallets,
  defaultChains as AllDefaultChains,
  Standards,
  UnknownChain,
} from "../core";
import {
  Chain,
  WalletEvent,
  WalletEventListeners,
  ConnectionStatus,
  MyDefaultWallet,
  MyWalletAdapter,
  Extendable,
  StorageKey,
} from "../types";

const queryClient = new QueryClient();

export type WalletProviderProps = Extendable & {
  defaultWallets?: MyDefaultWallet[];
  chains?: Chain[];
  autoConnect?: boolean;
};

export const WalletKitProvider = (props: WalletProviderProps) => {
  const {
    defaultWallets = AllDefaultWallets,
    chains = AllDefaultChains,
    autoConnect = false,
    children,
  } = props;

  const {
    allAvailableWallets,
    recommendedWallets,
    configuredWallets,
    detectedWallets,
  } = useAvailableWallets(defaultWallets);

  const [walletAdapter, setWalletAdapter] = useState<
    MyWalletAdapter | undefined
  >();
  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );
  const [chain, setChain] = useState(() => {
    if (isNonEmptyArray(chains)) return chains[0]; // first one as default chain
    return UnknownChain;
  });
  const walletOffListeners = useRef<(() => void)[]>([]);

  const isCallable = (
    walletAdapter: MyWalletAdapter | undefined,
    status: ConnectionStatus
  ) => {
    return walletAdapter && status === ConnectionStatus.CONNECTED;
  };

  const account = useMemo<WalletAccount | undefined>(() => {
    if (!isCallable(walletAdapter, status)) return;
    return (walletAdapter as MyWalletAdapter).accounts[0]; // use first account by default
  }, [walletAdapter, status]);

  const ensureCallable = (
    walletAdapter: MyWalletAdapter | undefined,
    status: ConnectionStatus
  ) => {
    if (!isCallable(walletAdapter, status)) {
      throw new WalletKitError("Failed to call function, wallet not connected");
    }
  };

  const connect = useCallback(
    async (adapter: MyWalletAdapter, opts?: ConnectInput) => {
      if (!adapter) throw new WalletKitError("param adapter is missing");

      setStatus(ConnectionStatus.CONNECTING);
      try {
        const res = await adapter.connect(opts);
        // hack
        // implementation for getting current network when connected still waiting for wallet-standard's progress
        if (isNonEmptyArray((res as any)?.chains)) {
          const chainId = (res as any)?.chains[0];
          const targetChain = chains.find((item) => item.id === chainId);
          setChain(targetChain ?? UnknownChain);
        }

        setWalletAdapter(adapter);
        setStatus(ConnectionStatus.CONNECTED);

        const storage = new Storage();
        storage.setItem(StorageKey.LAST_CONNECT_WALLET_NAME, adapter.name);
        return res;
      } catch (e) {
        setWalletAdapter(undefined);
        setStatus(ConnectionStatus.DISCONNECTED);
        throw e;
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    ensureCallable(walletAdapter, status);
    const adapter = walletAdapter as MyWalletAdapter;
    if (isNonEmptyArray(walletOffListeners.current)) {
      walletOffListeners.current.forEach((off) => {
        try {
          off();
        } catch (e) {
          console.error(
            "error when clearing wallet listener",
            (e as any).message
          );
        }
      });
      walletOffListeners.current = [];
    }
    try {
      if (adapter.hasFeature(Standards.STANDARD__DISCONNECT)) {
        await adapter.disconnect();
      }
    } finally {
      setWalletAdapter(undefined);
      setStatus(ConnectionStatus.DISCONNECTED);
      setChain(chains?.[0] ?? UnknownChain);
    }
  }, [walletAdapter, status]);

  const select = useCallback(
    async (walletName: string) => {
      if (isCallable(walletAdapter, status)) {
        const adapter = walletAdapter as MyWalletAdapter;
        if (walletName === adapter.name) return;
        await disconnect();
      }

      const wallet = allAvailableWallets.find(
        (wallet) => wallet.name === walletName
      );
      if (!wallet) {
        const availableWalletNames = allAvailableWallets.map(
          (wallet) => wallet.name
        );
        throw new WalletKitError(
          `select failed: wallet ${walletName} is not available, all wallets are listed here: [${availableWalletNames.join(
            ", "
          )}]`
        );
      }
      await connect(wallet.adapter as MyWalletAdapter);
    },
    [walletAdapter, status, allAvailableWallets]
  );

  const on = useCallback(
    (event: WalletEvent, listener: WalletEventListeners[WalletEvent]) => {
      ensureCallable(walletAdapter, status);
      const _wallet = walletAdapter as MyWalletAdapter;

      const off = _wallet.on("change", (params) => {
        if (event === "change") {
          const _listener = listener as WalletEventListeners["change"];
          _listener(params);
          return;
        }
        if (params.chains && event === "chainChange") {
          const _listener = listener as WalletEventListeners["chainChange"];
          _listener({ chain: (params.chains as any)?.[0] });
          return;
        }
        if (params.accounts && event === "accountChange") {
          const _listener = listener as WalletEventListeners["accountChange"];
          _listener({ account: (params.accounts as any)?.[0] });
          return;
        }
        if (params.features && event === "featureChange") {
          const _listener = listener as WalletEventListeners["featureChange"];
          _listener({ features: params.features });
          return;
        }
      });
      walletOffListeners.current.push(off);
      return off;
    },
    [walletAdapter, status]
  );

  const getAccounts = useCallback(() => {
    ensureCallable(walletAdapter, status);
    const _wallet = walletAdapter as MyWalletAdapter;
    return _wallet.accounts;
  }, [walletAdapter, status]);

  const signAndExecuteTransaction = useCallback(
    async (transaction: SuiSignAndExecuteTransactionInput) => {
      ensureCallable(walletAdapter, status);
      const _wallet = walletAdapter as MyWalletAdapter;
      return await _wallet.signAndExecuteTransaction(transaction);
    },
    [walletAdapter, status]
  );

  useAutoConnect(select, allAvailableWallets, autoConnect);

  useEffect(() => {
    if (!walletAdapter || status !== "connected") return;
    const off = on("chainChange", (params: { chain: string }) => {
      if (params.chain === chain.id) return;
      const newChain = chains.find((item) => item.id === params.chain);
      if (!newChain) {
        setChain(UnknownChain);
        return;
      }
      setChain(newChain);
    });
    return () => {
      off();
    };
  }, [walletAdapter, status, chain, chains, on]);

  return (
    <WalletContext.Provider
      value={{
        name: walletAdapter?.name,
        chains,
        connectedChain: chain,
        allAvailableWallets,
        recommendedWallets,
        configuredWallets,
        detectedWallets,
        adapter: walletAdapter,
        status,
        connecting: status === ConnectionStatus.CONNECTING,
        connected: status === ConnectionStatus.CONNECTED,
        select,
        disconnect,
        on,
        getAccounts,
        account,
        signAndExecuteTransaction,
        address: account?.address,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WalletContext.Provider>
  );
};
