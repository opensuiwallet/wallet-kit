import React, { useCallback, useEffect, useState } from "react";
import { Extendable, MyWallet } from "../../types";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogContentProps } from "@radix-ui/react-dialog";
import classnames from "classnames";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useWalletKit } from "../../hooks";
import { isNonEmptyArray, WalletKitError, Icon } from "../../utils";
import "./index.scss";

export type BaseModalProps = Extendable & {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentProps?: DialogContentProps;
};

export type ConnectModalProps = Extendable & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type WalletItemProps = Extendable & {
  wallet: MyWallet;
  onSelect?: (wallet: MyWallet) => void;
};

type InstallGuideProps = Extendable & {
  wallet: MyWallet;
  onNavBack?: () => void;
};

type ConnectingProps = Extendable & {
  wallet: MyWallet;
  onNavBack?: () => void;
};

export const BasicModal = (props: BaseModalProps) => {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={"osw-dialog__overlay"}>
          <Dialog.Content
            {...props.contentProps}
            className={classnames("osw-dialog__content", props.className)}
            style={props.style}
          >
            {props.children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const WalletItem = (props: WalletItemProps) => {
  const { wallet } = props;
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    if (!wallet.iconUrl) return;
    setIcon(wallet.iconUrl);
  }, [wallet.iconUrl]);

  return (
    <div
      className={"osw-select-item"}
      key={wallet.name}
      onClick={() => {
        props.onSelect?.(wallet);
      }}
    >
      <Icon
        icon={icon}
        className={"osw-select-item__icon"}
        elClassName={"osw-select-item__icon"}
      />
      {wallet.name}
    </div>
  );
};

const WalletList = (props: {
  title: string;
  wallets: MyWallet[];
  onSelect?: (wallet: MyWallet) => void;
}) => {
  if (!isNonEmptyArray(props.wallets)) return null;
  return (
    <div className={"osw-select__container"}>
      <div className={"osw-select__title"}>{props.title}</div>
      {isNonEmptyArray(props.wallets) &&
        props.wallets.map((wallet) => {
          return (
            <WalletItem
              key={wallet.name}
              wallet={wallet}
              onSelect={props.onSelect}
            />
          );
        })}
    </div>
  );
};

const InstallGuide = (props: InstallGuideProps) => {
  const { wallet } = props;
  return (
    <section>
      <div className={"osw-dialog__header"}>
        <Dialog.Title
          className={"osw-dialog__title"}
          style={{ margin: "-8px 12px -6px -8px" }}
        >
          <span className="osw-dialog__close" onClick={props.onNavBack}>
            <ArrowLeftIcon />
          </span>
        </Dialog.Title>

        <Dialog.Title className={"osw-dialog__title"}>
          Install Wallet
        </Dialog.Title>
      </div>
      <div className="osw-install">
        <img
          className="osw-install__logo"
          src={wallet.iconUrl}
          alt={`${wallet.name} logo`}
        />
        <h1 className="osw-install__title">You haven’t install this wallet</h1>
        <p className="osw-install__description">
          Install wallet via Chrome Extension Store
        </p>
        <button
          className="osw-button osw-install__button"
          onClick={() => {
            if (!wallet.downloadUrl?.browserExtension) {
              throw new WalletKitError(
                `no downloadUrl config on this wallet: ${wallet.name}`
              );
            }
            window.open(wallet.downloadUrl.browserExtension, "_blank");
          }}
        >
          Get Wallet
        </button>
      </div>
    </section>
  );
};

const Connecting = (props: ConnectingProps) => {
  const { wallet } = props;
  return (
    <section>
      <div className={"osw-dialog__header"}>
        <Dialog.Title
          className={"osw-dialog__title"}
          style={{ margin: "-6px 12px -6px -8px" }}
        >
          <span className="osw-dialog__close" onClick={props.onNavBack}>
            <ArrowLeftIcon />
          </span>
        </Dialog.Title>

        <Dialog.Title className={"osw-dialog__title"}>Connecting</Dialog.Title>
      </div>
      <div className="osw-connecting">
        <img
          className="osw-connecting__logo"
          src={wallet.iconUrl}
          alt={`logo of ${wallet.name}`}
        />
        <h1 className="osw-connecting__title">Opening {wallet.name}</h1>
        <p className="osw-connecting__description">
          Confirm connection in the extension
        </p>
      </div>
    </section>
  );
};

export const ConnectWalletModal = (props: ConnectModalProps) => {
  const {
    recommendedWallets,
    configuredWallets,
    detectedWallets,
    select,
    connecting,
  } = useWalletKit();

  const [activeWallet, setActiveWallet] = useState<MyWallet | undefined>();

  const handleSelectWallet = useCallback(
    (wallet: MyWallet) => {
      setActiveWallet(wallet);
      if (wallet.installed) {
        select(wallet.name);
      }
    },
    [select]
  );

  function renderBody() {
    if (activeWallet) {
      if (!activeWallet.installed) {
        return (
          <InstallGuide
            wallet={activeWallet}
            onNavBack={() => {
              setActiveWallet(undefined);
            }}
          />
        );
      }
      if (connecting) {
        return (
          <Connecting
            wallet={activeWallet}
            onNavBack={() => {
              setActiveWallet(undefined);
            }}
          />
        );
      }
    }
    return (
      <div>
        <div className={"osw-dialog__header"}>
          <Dialog.Title className={"osw-dialog__title"}>
            {"Connect Wallet"}
          </Dialog.Title>
          <Dialog.Close
            style={{ position: "absolute", right: "16px", top: "16px" }}
            className={"osw-dialog__close"}
          >
            <XMarkIcon />
          </Dialog.Close>
        </div>
        <div className="osw-select__scroll">
          <WalletList
            title={"Recommended"}
            wallets={recommendedWallets}
            onSelect={handleSelectWallet}
          />
          <WalletList
            title={"Others"}
            wallets={configuredWallets.slice(1).concat(detectedWallets)}
            onSelect={handleSelectWallet}
          />
        </div>
        <div style={{ height: "41px", flexShrink: "0" }}></div>
        <div className={"osw-support"}>
          Supported by &nbsp;
          <a
            className={"osw-new-to-sui__link"}
            href="https://opensuiwallet.com"
            target="_blank"
          >
            OpenSui
          </a>
          &nbsp; & All rights reserved
        </div>
      </div>
    );
  }

  return (
    <BasicModal
      open={props.open}
      onOpenChange={props.onOpenChange}
      trigger={props.children}
      contentProps={{
        onOpenAutoFocus: (e: Event) => {
          e.preventDefault();
        },
      }}
    >
      {renderBody()}
    </BasicModal>
  );
};

export default ConnectWalletModal;
