import classnames from "classnames";
import React, { useCallback, useState } from "react";
import { useWalletKit, useAccountBalance } from "../../hooks";
import { Extendable } from "../../types";
import { shortenAddress, fmtCurrency } from "../../utils";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import type { WalletAccount } from "@mysten/wallet-standard";
import { UnknownChain } from "../../core";
import "./index.scss";

export type ConnectedButtonProps = Extendable & {
  label?: string;
  onDisconnect?: () => void;
};

function ConnectedWalletInfo(props: ConnectedButtonProps) {
  const { disconnect, account, connectedChain, connected } = useWalletKit();
  const { balance } = useAccountBalance();
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);

  const renderBalance = useCallback(() => {
    if (!connectedChain || connectedChain.id === UnknownChain.id) {
      return <>Unknown Chain</>;
    }
    return <>{fmtCurrency(Number(balance))} SUI</>;
  }, [balance, connectedChain]);

  if (!connected) return null;

  return (
    <div className={classnames("osw-connected-container")}>
      <button
        className={classnames("osw-connected-button")}
        onClick={() => {
          setShowDisconnectButton(!showDisconnectButton);
        }}
      >
        <span className={"osw-connected-button__balance"}>
          {renderBalance()}
        </span>
        <div className={"osw-connected-button__divider"}></div>
        <div className={"osw-address-select"}>
          <span className={"osw-address-select__address"}>
            {shortenAddress((account as WalletAccount)?.address)}
          </span>
          <span className={"osw-address-select__right-arrow"}>
            <ArrowDownIcon />
          </span>
        </div>
      </button>

      {showDisconnectButton && (
        <div className="osw-disconnect-button__container">
          <button
            className={"osw-disconnect-button"}
            onClick={() => {
              setShowDisconnectButton(false);
              disconnect().then(() => {
                props.onDisconnect?.();
              });
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectedWalletInfo;
