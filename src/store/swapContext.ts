import { useEffect } from 'react';
import { useBalance } from '../hooks/balance';
import { useCoinList } from '../hooks/coinList';
import { useQuoteApi, useQuoteQuery } from '../hooks/quoteApi';
import type { UmiTerminalProps } from '../type';
import { useCoinStore } from './coin';
import { useConfigStore } from './config';
import Decimal from 'decimal.js';

export type SwapContextProps = Pick<UmiTerminalProps, 'accountAddress' | 'provider'>;

export const useSwapContext = ({
  accountAddress,
  provider,
}: SwapContextProps) => {
  const configStore = useConfigStore();
  const chain = configStore.chain;

  const coinStore = useCoinStore();
  if (coinStore.sourceCoin === null || coinStore.targetCoin === null) {
    coinStore.initCoins(chain);
  }

  const { coinList } = useCoinList({ chain });
  const { balances, mutate: reloadBalances } = useBalance({ chain, accountAddress, provider });

  const { quoteQuery, setQuoteQuery } = useQuoteQuery({
    sourceAmount: 0,
    sourceCoin: coinStore.sourceCoin?.coinType ?? '',
    targetCoin: coinStore.targetCoin?.coinType ?? '',
  });
  useEffect(() => {
    const sourceAmount = new Decimal(coinStore.sourceVolume)
      .mul(10 ** (coinStore.sourceCoin?.decimals ?? 0))
      .toNumber();
    setQuoteQuery({
      ...quoteQuery,
      sourceCoin: coinStore.sourceCoin?.coinType ?? '',
      targetCoin: coinStore.targetCoin?.coinType ?? '',
      sourceAmount,
    });
  }, [coinStore.sourceCoin, coinStore.targetCoin, coinStore.sourceVolume]);

  const { quote, mutate: reloadQuote } = useQuoteApi({ chain, quoteQuery });

  return {
    ...configStore,
    ...coinStore,
    setSourceCoin: (coinType: string) => coinStore.setSourceCoin(coinList, coinType),
    setTargetCoin: (coinType: string) => coinStore.setTargetCoin(coinList, coinType),
    maxSourceVolume: () => coinStore.maxSourceVolume(balances),
    sourceCoinBalance: () => coinStore.sourceCoinBalance(balances),
    get targetVolume() {
      return new Decimal(quote?.target_amount ?? 0)
        .div(10 ** (coinStore.targetCoin?.decimals ?? 0))
        .toFixed(coinStore.targetCoin?.decimals ?? 0);
    },
    coinList,
    balances,
    reloadBalances,
    quoteQuery,
    setQuoteQuery,
    quote,
    reloadQuote,
  };
};
