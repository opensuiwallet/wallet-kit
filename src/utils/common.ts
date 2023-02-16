import { MyDefaultWallet } from "../types";

export function createDefault(params: MyDefaultWallet) {
  return Object.freeze(params);
}
