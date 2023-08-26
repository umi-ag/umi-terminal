import type { JsonRpcProvider } from '@mysten/sui.js';
import type { Chain, CoinBalance } from '../type';
import { Decimal } from 'decimal.js';
import useSWR from 'swr';
import { match } from 'ts-pattern';

export const useSuiBalance = ({
  provider,
  accountAddress,
}: {
  provider?: JsonRpcProvider;
  accountAddress?: string;
}) => {
  const query = useSWR(
    ['sui', 'balances', accountAddress],
    async () => {
      if (!provider) {
        throw new Error('Provider is not set');
      }

      if (!accountAddress) {
        throw new Error('Account address is not set');
      }

      const balanceList = await provider.getAllBalances({
        owner: accountAddress,
      });

      return balanceList.map(b => ({
        coinType: b.coinType,
        totalBalance: new Decimal(b.totalBalance),
      }) as CoinBalance);
    },
    {
      refreshInterval: 60_000, // 1 min
      revalidateOnFocus: false,
      revalidateIfStale: !!accountAddress && !!provider,
    }
  );

  return query;
};

export const useBalance = ({
  chain = 'sui',
  accountAddress,
  provider,
}: {
  chain: Chain;
  accountAddress?: string;
  provider?: JsonRpcProvider;
}) => {
  const r = match(chain)
    .with('sui', () => useSuiBalance({ provider, accountAddress }))
    .otherwise(() => {
      throw new Error(`Unsupported chain: ${chain}`);
    });

  const balances = r.data ?? [];

  return {
    ...r,
    balances,
    findBalance: (coinType: string) => balances.find(b => b.coinType === coinType),
  };
};
