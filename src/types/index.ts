import {
  EventsListeners,
  Wallet,
  SuiChain,
  WalletAccount,
} from "@mysten/wallet-standard";
import {
  ConnectMethod,
  DisconnectMethod,
  SuiSignAndExecuteTransactionMethod,
  ConnectFeature,
  DisconnectFeature,
  EventsFeature,
  WalletWithFeatures,
  EventsOnMethod,
} from "@mysten/wallet-standard";
import { SuiSignAndExecuteTransactionFeature } from "@mysten/wallet-standard/src/features";
import { CSSProperties, ReactNode } from "react";

export type Chain = {
  id: string;
  name: string;
  rpcUrl: string;
};

export type WalletEvent =
  | keyof EventsListeners
  | "chainChange"
  | "featureChange"
  | "accountChange";

export type WalletEventListeners = EventsListeners & {
  chainChange: (params: ChainChangeParams) => void;
  featureChange: (params: FeatureChangeParams) => void;
  accountChange: (params: AccountChangeParams) => void;
};

export interface ChainChangeParams {
  chain: SuiChain;
}

export interface AccountChangeParams {
  account: WalletAccount;
}

export interface FeatureChangeParams {
  features: Wallet["features"];
}

export interface MyWallet {
  name: string;
  adapter: MyWalletAdapter | undefined;
  installed: boolean | undefined;
  iconUrl: string;
  downloadUrl?: string;
}

export type MyDefaultWallet = Omit<
  MyWallet,
  keyof {
    adapter: any;
    installed: any;
  }
>;

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTED = "connected",
  CONNECTING = "connecting",
}

export type MyWalletAdapter = WalletWithFeatures<
  ConnectFeature &
    EventsFeature &
    SuiSignAndExecuteTransactionFeature &
    Partial<DisconnectFeature>
> & {
  hasFeature: (name: string) => boolean;
  connect: ConnectMethod;
  disconnect: DisconnectMethod;
  signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod;
  on: EventsOnMethod;
};
export interface StyleExtendable {
  className?: string;
  style?: CSSProperties;
}
export type Extendable<T = ReactNode> = StyleExtendable & {
  children?: T;
};
export enum ErrorCode {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  KIT__UNKNOWN_ERROR = "KIT.UNKNOWN_ERROR",
  WALLET__UNKNOWN_ERROR = "WALLET.UNKNOWN_ERROR",
  USER__REJECTION = "USER.REJECTION",
}
export enum QueryKey {
  COIN_BALANCE = `OPENSUI_COIN_BALANCE`,
}

export enum Token {
  SUI = "SUI",
}

export enum StorageKey {
  LAST_CONNECT_WALLET_NAME = "WK__LAST_CONNECT_WALLET_NAME",
}
