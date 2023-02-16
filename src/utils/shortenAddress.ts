export function shortenAddress(address: string) {
  if (!address || !address.startsWith("0x") || address.length !== 42)
    return address;

  return address.slice(0, 4) + "...." + address.slice(-4);
}
