import type { JsonRpcProvider } from '@mysten/sui.js';
import type { Chain } from '../type';
import { Decimal } from 'decimal.js';
import useSWR from 'swr';

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
      }));
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
  if (chain === 'sui') {
    return useSuiBalance({ provider, accountAddress });
  }

  throw new Error(`Unsupported chain: ${chain}`);
};
