import { JsonRpcProvider } from "@mysten/sui.js";
import { useMemo } from "react";

export function useEndpointProvider(endpoint: string): JsonRpcProvider {
  return useMemo<JsonRpcProvider>(
    () => new JsonRpcProvider(endpoint),
    [endpoint]
  );
}
