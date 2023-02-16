import React from "react";
import ReactDOM from "react-dom/client";
import { WalletKitProvider, ConnectWalletButton } from "./components";
import { useWalletKit } from "./hooks";

function App() {
  const wallet = useWalletKit();
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
          "https://www.google.com.hk/url?sa=i&url=https%3A%2F%2Fwww.logodesign.net%2F&psig=AOvVaw22H35jGIzOl5dCqlsDrTrt&ust=1676481550255000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCPDS7s3Clf0CFQAAAAAdAAAAABAD",
        ],
        gasBudget: 10000,
      };
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: "moveCall",
          data,
        },
      });
      console.log("executeMoveCall success", resData);
      alert("executeMoveCall succeeded");
    } catch (e) {
      console.error("executeMoveCall failed", e);
      alert("executeMoveCall failed");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ConnectWalletButton />

      {!wallet.connected ? (
        <p>Connect DApp with OpenSui wallet</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p>
              <b>current wallet</b>: {wallet.adapter?.name}
            </p>
            <p>
              <b>wallet status</b>:{" "}
              {wallet.connecting
                ? "connecting"
                : wallet.connected
                ? "connected"
                : "disconnected"}
            </p>
            <p>
              <b>wallet address</b>: {wallet.account?.address}
            </p>
            <p>
              <b>current network</b>: {wallet.connectedChain?.name}
            </p>
          </div>

          <div style={{ margin: "12px 0" }}>
            <button
              style={{ height: "40px", padding: "0 10px", borderRadius: "5px" }}
              onClick={handleExecuteMoveCall}
            >
              executeMoveCall
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletKitProvider>
      <App />
    </WalletKitProvider>
  </React.StrictMode>
);
