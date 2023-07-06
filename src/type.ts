export type ValueOf<T> = T[keyof T];

export const Chain = {
  SUI: 'sui',
  APTOS: 'aptos',
} as const;
export type Chain = ValueOf<typeof Chain>;

export const Network = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
} as const;
export type Network = ValueOf<typeof Network>;
