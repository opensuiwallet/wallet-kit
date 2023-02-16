import { MyWalletAdapter } from "../types";
import {
  ConnectInput,
  ConnectMethod,
  ConnectOutput,
  DisconnectMethod,
  EventsListeners,
  EventsOnMethod,
  SuiSignAndExecuteTransactionInput,
  SuiSignAndExecuteTransactionOutput,
  EventsNames,
  SuiSignAndExecuteTransactionMethod,
  Wallet,
} from "@mysten/wallet-standard";
import { has } from "lodash-es";
import { WalletError, WalletNotImplementError } from "../utils";

export enum Standards {
  STANDARD__CONNECT = "standard:connect",
  STANDARD__DISCONNECT = "standard:disconnect",
  STANDARD__EVENTS = "standard:events",
  SUI__SIGN_AND_TRANSACTION = "sui:signAndExecuteTransaction",
}

export class Adapter implements MyWalletAdapter {
  private readonly standardWalletAdapter: Wallet;

  constructor(standardWalletAdapter: Wallet) {
    this.standardWalletAdapter = standardWalletAdapter;
  }

  get name() {
    return this.standardWalletAdapter.name;
  }

  get chains() {
    return this.standardWalletAdapter.chains;
  }

  get icon() {
    return this.standardWalletAdapter.icon;
  }

  get version() {
    return this.standardWalletAdapter.version;
  }

  get accounts() {
    return this.standardWalletAdapter.accounts;
  }

  get features() {
    return this.standardWalletAdapter.features as any;
  }

  hasFeature(name: string): boolean {
    const { features } = this.standardWalletAdapter;
    return has(features, name);
  }

  private getFeature<T = any>(name: string): T {
    const { features } = this.standardWalletAdapter;
    if (!has(features, name)) {
      throw new WalletNotImplementError(name);
    }
    return (features as any)[name];
  }

  async connect(input: ConnectInput | undefined): Promise<ConnectOutput> {
    const feature = this.getFeature<{ connect: ConnectMethod }>(
      Standards.STANDARD__CONNECT
    );
    try {
      return await feature.connect(input);
    } catch (e) {
      throw new WalletError((e as any).message);
    }
  }

  async disconnect(): Promise<void> {
    const feature = this.getFeature<{ disconnect: DisconnectMethod }>(
      Standards.STANDARD__DISCONNECT
    );
    try {
      return await feature.disconnect();
    } catch (e) {
      throw new WalletError((e as any).message);
    }
  }

  on(event: EventsNames, listener: EventsListeners[EventsNames]): () => void {
    const feature = this.getFeature<{ on: EventsOnMethod }>(
      Standards.STANDARD__EVENTS
    );
    try {
      return feature.on<EventsNames>(event, listener);
    } catch (e) {
      throw new WalletError((e as any).message);
    }
  }

  async signAndExecuteTransaction(
    input: SuiSignAndExecuteTransactionInput
  ): Promise<SuiSignAndExecuteTransactionOutput> {
    const feature = this.getFeature<{
      signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod;
    }>(Standards.SUI__SIGN_AND_TRANSACTION);
    try {
      return await feature.signAndExecuteTransaction(input);
    } catch (e) {
      throw new WalletError((e as any).message);
    }
  }
}
