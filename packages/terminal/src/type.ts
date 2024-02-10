import type { SuiClient } from '@mysten/sui.js/client';
import type Decimal from 'decimal.js';

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

export type CoinProfile = {
  coinType: string;
  decimals: number;
  name: string;
  symbol: string;
  description: string;
  iconUrl: string | null;
  id: string;
};

export type CoinBalance = {
  coinType: string;
  totalBalance: Decimal;
};

export type UmiTerminalProps = {
  /**
   * The address of the account to use for the swap.
   */
  accountAddress?: string;
  /**
   * The wallet to use for the swap.
   */
  wallet?: {
    signAndExecuteTransactionBlock: (p: never) => Promise<unknown>;
  } | null;
  /**
   * Sui Client
   */
  provider?: SuiClient;
  /**
   * Partner policy object id for Sui
   */
  partnerPolicyObjectId?: string;
};
