import { create } from 'zustand';
import { Decimal } from 'decimal.js';
import type { Chain, CoinProfile, UmiTerminalProps } from '../type';
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
};

type Action = {
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

export type TradeContextProps = State & Action;

export const useTradeContext = ({
  wallet,
  provider,
  accountAddress,
  partnerPolicyObjectId,
}: UmiTerminalProps) => create<TradeContextProps>()((set, get) => {
  const chain = 'sui';

  const balanceQuery = useBalance({ chain, provider, accountAddress });
  const { balances } = balanceQuery;
  const coinListQuery = useCoinList({ chain });
  const { coinList } = coinListQuery;

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

  const setChain = (chain: Chain) => {
    set({
      chain,
      sourceCoin: initialCoinSelection[chain].source,
      targetCoin: initialCoinSelection[chain].target,
    });
    setQuoteQuery({
      ...get().quoteQuery,
      sourceCoin: initialCoinSelection[chain].source.coinType,
      targetCoin: initialCoinSelection[chain].target.coinType,
    });
  };

  const setSourceCoin = (coinType: string) => {
    const coin = coinList.find(coin => coin.coinType === coinType);
    if (!coin) return;
    set({
      sourceCoin: coin,
    });
    setQuoteQuery({
      ...get().quoteQuery,
      sourceAmount: new Decimal(get().sourceVolume).mul(10 ** coin.decimals).toNumber(),
      sourceCoin: coin.coinType,
    });
  };

  const setTargetCoin = (coinType: string) => {
    const coin = coinList.find(coin => coin.coinType === coinType);
    if (!coin) return;
    set({
      targetCoin: coin,
    });
    setQuoteQuery({
      ...get().quoteQuery,
      targetCoin: coin.coinType,
    });
  };

  const switchCoin = () => {
    const { sourceCoin, targetCoin, sourceVolume } = get();
    set({
      sourceCoin: targetCoin,
      targetCoin: sourceCoin,
    });
    setQuoteQuery({
      ...get().quoteQuery,
      sourceAmount: new Decimal(sourceVolume)
        .mul(10 ** targetCoin.decimals)
        .toNumber(),
      sourceCoin: targetCoin.coinType,
      targetCoin: sourceCoin.coinType,
    });
  };

  const setSourceVolume = (volume: number) => {
    console.log({ volume });

    set({
      sourceVolume: volume,
    });
    setQuoteQuery({
      ...get().quoteQuery,
      sourceAmount: new Decimal(volume)
        .mul(10 ** get().sourceCoin.decimals)
        .toNumber(),
    });

    console.log(get());
  };

  const maxSourceVolume = () => {
    const sourceVolume = balances.find(balance => balance.coinType === get().sourceCoin.coinType)
      ?.totalBalance
      .div(10 ** get().sourceCoin.decimals)
      .toNumber();

    if (!sourceVolume) return;
    setSourceVolume(sourceVolume);
  };

  const currentBalance = () => {
    const balance = balances.find(balance => balance.coinType === get().sourceCoin.coinType)
      ?.totalBalance;

    if (!balance) return;
    return balance
      .div(10 ** get().sourceCoin.decimals)
      .toNumber();
  };

  const routeDigest = () => {
    const quote = quoteApiQuery.quote;
    if (!quote) return;
    const venues = [...new Set(quote.paths
      .flatMap(p => p.path.steps
        .flatMap(s => s.venues
          .flatMap(v => v.venue.name)))),
    ];
    const venuesCount = venues.length;
    const venueNames = venues.join(', ');
    return `Swap via ${venuesCount} venue${venuesCount > 1 ? 's' : ''}: ${venueNames}`;
  };

  return {
    chain,
    coinListQuery,
    balanceQuery,
    sourceCoin: initialCoin.source,
    targetCoin: initialCoin.target,
    sourceVolume: 0,
    targetVolume: 0,
    quoteQuery,
    quoteApiQuery,
    setChain,
    setSourceCoin,
    setTargetCoin,
    switchCoin,
    setSourceVolume,
    maxSourceVolume,
    currentBalance,
    setQuoteQuery,
    routeDigest,
  };
})();
