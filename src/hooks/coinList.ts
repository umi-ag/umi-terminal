import type { Chain, CoinProfile } from '../type';
import { fetchCoinList } from '@umi-ag/sui-coin-list';
import { match } from 'ts-pattern';
import useSWR from 'swr';

const SUI = {
  'coinType': '0x2::sui::SUI',
  'decimals': 9,
  'name': 'Sui',
  'symbol': 'SUI',
  'description': '',
  'iconUrl': 'https://strapi.scand.app/uploads/644b3314022eae0001db3110_coin_logo_bb22eaf116.png',
  'id': '0x9258181f5ceac8dbffb7030890243caed69a9599d2886d957a9cb7656af3bdb3'
};

const USDC_SUI = {
  'coinType': '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  'decimals': 6,
  'name': 'USD Coin',
  'symbol': 'USDC',
  'description': '',
  'iconUrl': 'https://strapi.scand.app/uploads/usdc_019d7ef24b.png',
  'id': '0x4fbf84f3029bd0c0b77164b587963be957f853eccf834a67bb9ecba6ec80f189'
};

export const useSuiCoinList = () => {
  const query = useSWR(
    ['sui', 'coinList'],
    async () => {
      return fetchCoinList();
    },
    {
      refreshInterval: 60_000, // 1 min
      revalidateOnFocus: false,
    }
  );

  return query;
};

export const useCoinList = ({
  chain = 'sui',
}: {
  chain: Chain;
}) => {
  const r = match(chain)
    .with('sui', () => useSuiCoinList())
    .otherwise(() => {
      throw new Error(`Unsupported chain: ${chain}`);
    });

  const coinList = r.data ?? [];

  return {
    ...r,
    coinList,
    // TODO: Support fuzzy search
    findCoin: (coinType: string) => coinList.find(c => c.coinType === coinType),
  };
};

export const initialCoinSelection: Record<Chain, { source: CoinProfile, target: CoinProfile }> = {
  sui: {
    source: SUI,
    target: USDC_SUI,
  },
  aptos: {
    source: null as never,
    target: null as never,
  },
};
