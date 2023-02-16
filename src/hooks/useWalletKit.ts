import { createContext, useContext } from "react";
import {
  SuiSignAndExecuteTransactionInput,
  SuiSignAndExecuteTransactionOutput,
  WalletAccount,
} from "@mysten/wallet-standard";
import {
  ConnectionStatus,
  MyWallet,
  MyWalletAdapter,
  WalletEvent,
  WalletEventListeners,
  Chain,
} from "../types";
import { WalletKitError } from "../utils";

export interface WalletContextState {
  recommendedWallets: MyWallet[];
  configuredWallets: MyWallet[];
  detectedWallets: MyWallet[];
  allAvailableWallets: MyWallet[];

  chains: Chain[];
  connectedChain: Chain | undefined;
  name: string | undefined;
  adapter: MyWalletAdapter | undefined;
  account: WalletAccount | undefined;
  address: string | undefined;

  connecting: boolean;
  connected: boolean;
  status: "disconnected" | "connected" | "connecting";

  select: (walletName: string) => void;
  disconnect: () => Promise<void>;
  getAccounts: () => readonly WalletAccount[];

  signAndExecuteTransaction(
    transaction: SuiSignAndExecuteTransactionInput
  ): Promise<SuiSignAndExecuteTransactionOutput>;

  on: <E extends WalletEvent>(
    event: E,
    listener: WalletEventListeners[E]
  ) => () => void;
}

function missProviderMessage(action: string) {
  return `Failed to call ${action}, missing context provider to run within`;
}

const DEFAULT_CONTEXT: WalletContextState = {
  recommendedWallets: [],
  configuredWallets: [],
  detectedWallets: [],
  allAvailableWallets: [],
  chains: [],
  connectedChain: undefined,
  name: undefined,
  adapter: undefined,
  connecting: false,
  connected: false,
  account: undefined,
  status: ConnectionStatus.DISCONNECTED,
  address: undefined,
  select() {
    throw new WalletKitError(missProviderMessage("select"));
  },
  on() {
    throw new WalletKitError(missProviderMessage("on"));
  },
  async disconnect() {
    throw new WalletKitError(missProviderMessage("disconnect"));
  },
  getAccounts() {
    throw new WalletKitError(missProviderMessage("getAccounts"));
  },
  async signAndExecuteTransaction() {
    throw new WalletKitError(missProviderMessage("signAndExecuteTransaction"));
  },
};

export const WalletContext = createContext<WalletContextState>(DEFAULT_CONTEXT);

export function useWalletKit(): WalletContextState {
  return useContext(WalletContext);
}
