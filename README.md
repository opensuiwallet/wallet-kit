# OpenSui wallet kit, connect with every wallet on Sui

OpenSui wallet kit is a React toolkit for DApps to interact with all the wallets in Sui easily.

<a href="https://github.com/wallet-standard/wallet-standard">
  <img src="https://badgen.net/badge/wallet-standard/supported/green" />
</a>

# Features

* Support all the official [Sui Wallet Standard](https://github.com/opensuiLabs/sui/tree/main/sdk/wallet-adapter/packages/wallet-standard) defined by Sui
* Automatically detect all the installed wallets implemented wallet-standard
* Provide `UI components` and `React Provider` & `Hooks`
* Can customize component style and many hooks

# Getting started

To get started in a React application, you can install the following packages:

```bash
npm install @opensui/wallet-kit
```

# Usage
At the root of your application, you can then set up the wallet kit provider:

```jsx
import { WalletKitProvider } from "@opensui/wallet-kit";

export function App() {
    return <WalletKitProvider>{/* Your application... */}</WalletKitProvider>;
}
```

The WalletKitProvider also supports an adapters prop, which lets you override the default Sui Wallet Adapters.

You can then add a connect-wallet button to your page:

```jsx
import { ConnectWalletButton } from "@opensui/wallet-kit";

function ConnectToWallet() {
    return (
        <div>
            Connect wallet to get started:
            <ConnectWalletButton />
        </div>
    );
}
```

To get access to the currently connected wallet, use the useWalletKit() hook to interact with the wallet, such as proposing transactions:

```jsx
import { useWalletKit } from "@opensui/wallet-kit";

export function SendTransaction() {
  const { signAndExecuteTransaction } = useWalletKit();

  const handleClick = async () => {
    await signAndExecuteTransaction({
      kind: "moveCall",
      data: {
        packageObjectId: "0x2",
        module: "devnet_nft",
        function: "mint",
        typeArguments: [],
        arguments: [
          "name",
          "capy",
          "https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop",
        ],
        gasBudget: 10000,
      },
    });
  };

  return (
    <Button onClick={handleClick} disabled={!connected}>
      Send Transaction
    </Button>
  );
}
```

# More Info

Here are our official website [opensuiwallet.com](https://opensuiwallet.com) & [kit docs](https://kit.opensuiwallet.com)

# Demo
> Here is a [Demo Playground](https://master.d1sepqty4ktlu4.amplifyapp.com/) for you experience. 