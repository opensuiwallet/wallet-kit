export function queryKey(key: string, opts: Record<string, any>) {
  const uriQuery = new URLSearchParams(opts);
  return key + "?" + uriQuery.toString();
}
