import { create } from 'zustand';
import { Decimal } from 'decimal.js';
import type { Chain, CoinProfile } from '../type';
import type { QuoteQuery } from '@umi-ag/sui-sdk';
import { initialCoinSelection, useCoinList } from '../hooks/coinList';
import { useBalance } from '../hooks/balance';

type State = {
  chain: Chain;
  sourceCoin: CoinProfile;
  targetCoin: CoinProfile;
  sourceVolume: number;
  quoteQuery: QuoteQuery;
  // quote: TradingRoute | null;
  // quote: () => (TradingRoute | null);
  setChain: (chain: Chain) => void;
  setSourceCoin: (coinType: string) => void;
  setTargetCoin: (coinType: string) => void;
  switchCoin: () => void;
  setSourceVolume: (volume: number) => void;
  // maxSourceVolume: () => void;
  // routeDigest: () => string | undefined;
};

export type UseTradeContextProps = {
  chain: Chain;
  // coinList: CoinProfile[];
  // balances: CoinBalance[];
};

export const useTradeContext = ({ chain }: UseTradeContextProps) => {
  // const { balances, findBalance } = useBalance({ chain });
  // const { coinList } = useCoinList({ chain });
  const balanceQuery = useBalance({ chain });
  const coinListQuery = useCoinList({ chain });

  const initialCoin = initialCoinSelection[chain];

  return create<State>()((set, get) => ({
    chain: 'sui',
    coinListQuery,
    balanceQuery,
    sourceCoin: initialCoin.source,
    targetCoin: initialCoin.target,
    sourceVolume: 0,
    quoteQuery: {
      sourceAmount: 0,
      sourceCoin: initialCoin.source.coinType,
      targetCoin: initialCoin.target.coinType,
    },
    // quote: null,
    // quote: () => {
    //   const quoteQuery = get().quoteQuery;
    //   const { data } = useQuoteApi({ chain, quoteQuery });
    //   return data ?? null;
    // },
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
    // routeDigest: () => {
    //   // if (!quote.data) return;
    //   const quote = get().quote();
    //   const venues = [...new Set(quote.paths.flatMap(p => p.path.steps.flatMap(s => s.venues.flatMap(v => v.venue.name))))];
    //   const venuesCount = venues.length;
    //   const venueNames = venues.join(', ');
    //   return `Swap via ${venuesCount} venue${venuesCount > 1 ? 's' : ''}: ${venueNames}`;
    // },
  }));
};
