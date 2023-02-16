import { Chain } from "../types";

export enum SuiChainId {
  DevNet = "sui:devnet",
  TestNet = "sui:testnet",
}

export const SuiDevNetChain: Chain = {
  id: SuiChainId.DevNet,
  name: "Sui DevNet",
  rpcUrl: "https://fullnode.devnet.sui.io",
};
export const SuiTestNetChain: Chain = {
  id: SuiChainId.TestNet,
  name: "Sui TestNet",
  rpcUrl: "https://fullnode.testnet.sui.io",
};

export const UnknownChain: Chain = {
  id: "unknown:unknown",
  name: "Unknown Network",
  rpcUrl: "",
};

export const defaultChains = [SuiDevNetChain, SuiTestNetChain];
