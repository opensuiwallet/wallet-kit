import React, { ReactNode, useEffect, useState } from "react";
import classnames from "classnames";
import { Extendable } from "../../types";
import ConnectWalletModal from "../Modal/ConnectWalletModal";
import ConnectedWalletInfo from "../Dropdown/ConnectedWalletInfo";
import { useWalletKit } from "../../hooks";
import "./index.scss";

export type ConnectButtonProps = Extendable & {
  label?: string;
  children?: ReactNode;
};

export const ConnectWalletButton = (props: ConnectButtonProps) => {
  const { label = "Connect Button" } = props;
  const [showModal, setShowModal] = useState(false);
  const { connected } = useWalletKit();

  useEffect(() => {
    if (connected) {
      setShowModal(false);
    }
  }, [connected]);

  return (
    <ConnectWalletModal
      open={showModal}
      onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
        if (connected) return;
        setShowModal(open);
      }}
    >
      <div>
        {connected ? (
          <ConnectedWalletInfo
            onDisconnect={() => {
              setShowModal(false);
            }}
          />
        ) : (
          <button
            className={classnames("osw-button", props.className)}
            style={props.style}
          >
            {props.children || label}
          </button>
        )}
      </div>
    </ConnectWalletModal>
  );
};

export default ConnectWalletButton;
