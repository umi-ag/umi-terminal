import { create } from 'zustand';
import { Decimal } from 'decimal.js';
import type { Chain, CoinProfile } from '../type';
import type { QuoteQuery } from '@umi-ag/sui-sdk';
import { initialCoinSelection, useCoinList } from '../hooks/coinList';
import { useBalance } from '../hooks/balance';
import { useQuoteApi, useQuoteQuery } from '../hooks/quoteApi';

type State = {
  chain: Chain;
  sourceCoin: CoinProfile;
  targetCoin: CoinProfile;
  sourceVolume: number;
  targetVolume: number;
  quoteQuery: QuoteQuery;
  coinListQuery: ReturnType<typeof useCoinList>;
  balanceQuery: ReturnType<typeof useBalance>;
  quoteApiQuery: ReturnType<typeof useQuoteApi>;
  // quote: () => (TradingRoute | null);
  setChain: (chain: Chain) => void;
  setSourceCoin: (coinType: string) => void;
  setTargetCoin: (coinType: string) => void;
  switchCoin: () => void;
  setSourceVolume: (volume: number) => void;
  maxSourceVolume: () => void;
  currentBalance: () => number | undefined;
  setQuoteQuery: (quoteQuery: QuoteQuery) => void;
  routeDigest: () => string | undefined;
};

export type UseTradeContextProps = {
  chain: Chain;
  // coinList: CoinProfile[];
  // balances: CoinBalance[];
};

// export const useTradeContext = ({ chain }: UseTradeContextProps) => {
export const useTradeContext = create<State>()((set, get) => {
  // const { balances, findBalance } = useBalance({ chain });
  // const { coinList } = useCoinList({ chain });
  const chain = 'sui';
  const balanceQuery = useBalance({ chain });
  const coinListQuery = useCoinList({ chain });

  const initialCoin = initialCoinSelection[chain];

  const { quoteQuery, setQuoteQuery } = useQuoteQuery({
    sourceAmount: 0,
    sourceCoin: initialCoin.source.coinType,
    targetCoin: initialCoin.target.coinType,
  });

  const quoteApiQuery = useQuoteApi({
    chain,
    quoteQuery,
  });

  return {
    chain,
    coinListQuery,
    balanceQuery,
    sourceCoin: initialCoin.source,
    targetCoin: initialCoin.target,
    sourceVolume: 0,
    targetVolume: 0,
    quoteQuery,
    // quote: null,
    // quote: () => {
    //   const quoteQuery = get().quoteQuery;
    //   const { data } = useQuoteApi({ chain, quoteQuery });
    //   return data ?? null;
    // },
    quoteApiQuery,
    setChain: (chain) => {
      set({
        chain,
        sourceCoin: initialCoinSelection[chain].source,
        targetCoin: initialCoinSelection[chain].target,
        quoteQuery: {
          ...get().quoteQuery,
          sourceCoin: initialCoinSelection[chain].source.coinType,
          targetCoin: initialCoinSelection[chain].target.coinType,
        }
      });
    },
    setSourceCoin: (coinType) => {
      const coin = coinListQuery.coinList.find(coin => coin.coinType === coinType);
      if (!coin) return;
      set({
        sourceCoin: coin,
        quoteQuery: {
          ...get().quoteQuery,
          sourceAmount: new Decimal(get().sourceVolume).mul(10 ** coin.decimals).toNumber(),
          sourceCoin: coin.coinType,
        }
      });
    },
    setTargetCoin: (coinType) => {
      const coin = coinListQuery.coinList.find(coin => coin.coinType === coinType);
      if (!coin) return;
      set({
        targetCoin: coin,
        quoteQuery: {
          ...get().quoteQuery,
          targetCoin: coin.coinType,
        }
      });
    },
    switchCoin: () => {
      const { sourceCoin, targetCoin, sourceVolume } = get();
      set({
        sourceCoin: targetCoin,
        targetCoin: sourceCoin,
        quoteQuery: {
          ...get().quoteQuery,
          sourceAmount: new Decimal(sourceVolume).mul(10 ** targetCoin.decimals).toNumber(),
          sourceCoin: targetCoin.coinType,
          targetCoin: sourceCoin.coinType,
        }
      });
    },
    setSourceVolume: (volume) => {
      set({
        sourceVolume: volume,
        quoteQuery: {
          ...get().quoteQuery,
          sourceAmount: new Decimal(volume).mul(10 ** get().sourceCoin.decimals).toNumber(),
        }
      });
    },
    maxSourceVolume: () => {
      const balance = balanceQuery.findBalance(get().sourceCoin.coinType)
        ?.totalBalance
        .toNumber();

      if (!balance) return;
      set({ sourceVolume: balance });
    },
    routeDigest: () => {
      const quote = get().quoteApiQuery.quote;
      if (!quote) return;
      const venues = [...new Set(quote.paths
        .flatMap(p => p.path.steps
          .flatMap(s => s.venues
            .flatMap(v => v.venue.name)))),
      ];
      const venuesCount = venues.length;
      const venueNames = venues.join(', ');
      return `Swap via ${venuesCount} venue${venuesCount > 1 ? 's' : ''}: ${venueNames}`;
    },
    currentBalance: () => {
      const balance = balanceQuery.findBalance(get().sourceCoin.coinType)
        ?.totalBalance;

      if (!balance) return;
      return balance
        .div(10 ** get().sourceCoin.decimals)
        .toNumber();
    },
    setQuoteQuery,
  };
});
