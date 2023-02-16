import { useEffect } from "react";
import {
  ConnectButton,
  useAccountBalance,
  useWalletKit,
  useCoinBalance,
  useChain,
  SuiChainId,
} from "@opensui/wallet-kit";
import Image from "next/image";
// @ts-ignore
import logo from "./assets/logo.svg";
import * as tweetnacl from "tweetnacl";

function App() {
  const wallet = useWalletKit();
  const { balance } = useAccountBalance();

  const { data: coinBalance } = useCoinBalance();
  const chain = useChain(SuiChainId.DEVNET);

  useEffect(() => {
    console.log("chain config", chain);
    console.log("coin balance", coinBalance);
  }, [chain, coinBalance]);

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("listen to all change event");
    const off = wallet.on("change", (...args: any) => {
      console.log("wallet changed", ...args);
    });
    return () => {
      off();
    };
  }, [wallet.connected]);

  useEffect(() => {
    if (!wallet.connected) return;
    console.log("listen to chainChange event only");
    // @ts-ignore
    const off = wallet.on("chainChange", ({ chain }) => {
      console.log("chainChange", chain);
    });
    return () => {
      off();
    };
  }, [wallet.connected]);

  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return "";
    // @ts-ignore
    return value.toString("hex");
  }

  async function handleExecuteMoveCall() {
    try {
      const data = {
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
      };
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data,
        },
      });
      // const resData = await executeMoveCall(data);
      console.log("executeMoveCall success", resData);
      alert("executeMoveCall succeeded (see response in the console)");
    } catch (e) {
      console.error("executeMoveCall failed", e);
      alert("executeMoveCall failed (see response in the console)");
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://github.com/opensuiwallet/wallet-kit" target="_self">
          <Image src={logo} className="logo" alt="OpenSui logo" />
        </a>
      </div>
      <h1 style={{ textAlign: "center" }}>React + OpenSui Kit</h1>
      <div className="card">
        <ConnectButton />

        {!wallet.connected ? (
          <div style={{ marginTop: "30px" }}>
            Connect DApp with OpenSui wallet
          </div>
        ) : (
          <>
            <>
              <div>current wallet: {wallet.adapter?.name}</div>
              <div>
                wallet status:{" "}
                {wallet.connecting
                  ? "connecting"
                  : wallet.connected
                  ? "connected"
                  : "disconnected"}
              </div>
              <div>wallet address: {wallet.account?.address}</div>
              <div>current network: {wallet.chain?.name}</div>
              <div>
                <>wallet balance: {balance} SUI</>
              </div>
              <div>
                wallet publicKey: {uint8arrayToHex(wallet.account?.publicKey)}
              </div>
            </>
            <div className={"btn-group"} style={{ margin: "8px 0" }}>
              <button onClick={handleExecuteMoveCall}>executeMoveCall</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
