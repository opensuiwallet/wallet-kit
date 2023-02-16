import { ErrorCode } from "../types";

export class BasicError extends Error {
  private code: ErrorCode;
  private details: Record<string, any> | undefined;

  constructor(
    message: string,
    details?: Record<string, any>,
    code = ErrorCode.UNKNOWN_ERROR
  ) {
    super(message);
    this.details = details;
    this.code = code;
  }
}

export class WalletKitError extends BasicError {
  constructor(
    message = "wallet kit unknown error",
    details?: Record<string, any>
  ) {
    super("[WalletKitError] " + message, details, ErrorCode.KIT__UNKNOWN_ERROR);
  }
}

export class WalletError extends BasicError {
  constructor(message = "wallet unknown error", details?: Record<string, any>) {
    super("[WalletError] " + message, details, ErrorCode.WALLET__UNKNOWN_ERROR);
  }
}

export class WalletNotImplementError extends WalletError {
  constructor(method: string) {
    super(`wallet does not implement function: ${method}`);
  }
}

export class UserRejectionError extends BasicError {
  constructor(message = "user rejection", details?: Record<string, any>) {
    super(message, details, ErrorCode.USER__REJECTION);
  }
}
