import { Provider } from "./providers";
import { AccountBalance } from "./balance";

export class Account {
  public address: string;
  public balance: AccountBalance;
  constructor(provider: Provider, address: string) {
    this.address = address;
    this.balance = new AccountBalance(provider, address);
  }
}
