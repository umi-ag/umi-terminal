import type { JsonRpcProvider } from '@mysten/sui.js';
import type { Chain } from '../type';
import { useQuery } from '@tanstack/react-query';
import { Decimal } from 'decimal.js';

export const useSuiBalance = ({
  provider,
  accountAddress,
}: {
  provider?: JsonRpcProvider;
  accountAddress?: string;
}) => {
  const query = useQuery({
    queryKey: ['sui', 'balances', accountAddress],
    queryFn: async () => {
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
    enabled: !!accountAddress && !!provider,
    refetchInterval: 60_000, // 1 min
    refetchOnWindowFocus: false,
  });

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
