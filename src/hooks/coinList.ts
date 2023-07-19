import { useQuery } from '@tanstack/react-query';
import type { Chain, CoinProfile } from '../type';
import { fetchCoinList } from '@umi-ag/sui-coin-list';

export const useSuiCoinList = () => {
  const query = useQuery({
    queryKey: ['sui', 'coinList'],
    // TODO: Implement this
    queryFn: async () => fetchCoinList(),
    refetchInterval: 60_000, // 1 min
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useCoinList = ({
  chain = 'sui',
}: {
  chain: Chain;
}) => {
  if (chain === 'sui') {
    return useSuiCoinList();
  }

  throw new Error(`Unsupported chain: ${chain}`);
};

export const initialCoinSelection: Record<Chain, { source: CoinProfile, target: CoinProfile }> = {
  sui: {
    source: {
      'coinType': '0x2::sui::SUI',
      'decimals': 9,
      'name': 'Sui',
      'symbol': 'SUI',
      'description': '',
      'iconUrl': null,
      'id': '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
    },
    target: {
      'coinType': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
      'decimals': 6,
      'name': 'USD Coin',
      'symbol': 'USDC',
      'description': '',
      'iconUrl': null,
      'id': '0x4fbf84f3029bd0c0b77164b587963be957f853eccf834a67bb9ecba6ec80f189'
    },
  },
  aptos: {
    source: null as never,
    target: null as never,
  },
};
