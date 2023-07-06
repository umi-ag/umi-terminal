/* eslint-disable max-len */
import React, { useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import umiLogo from '../../assets/umi.jpeg';
import refreshIcon from '../../assets/refresh.svg';
import './style.scss';
import type { JsonRpcProvider } from '@mysten/sui.js';
import { useBalance } from '../../hooks/balance';
import type { Chain, CoinProfile } from '../../type';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { initialCoinSelection, useCoinList } from '../../hooks/coinList';
import { useQuoteApi, useQuoteQuery } from '../../hooks/quoteApi';
import { buildTransactionBlockForUmiAgSwap } from '@umi-ag/sui-sdk';
import Decimal from 'decimal.js';

export const InputBase: React.FC = (props) => {
  return (
    <input type="text" inputMode="numeric" className="text-3xl font-semibold text-right bg-transparent outline-none w-[70%]" { ...props } />
  );
};

export type SwapWidgetProps = {
  accountAddress?: string;
  wallet?: {
    signAndExecuteTransactionBlock: (p: any) => Promise<any>;
  } | null;
  provider?: JsonRpcProvider;
};

export const UmiSwapWidgetContent: React.FC<SwapWidgetProps> = (props) => {
  const [chain, setChain] = useState<Chain>('sui');
  const balances = useBalance({
    chain,
    provider: props.provider,
    accountAddress: props.accountAddress,
  });
  const coinList = useCoinList({
    chain,
  });

  const initialCoin = useMemo(() => initialCoinSelection[chain], [chain]);
  const [sourceCoin, setSourceCoinInner] = useState<CoinProfile>(initialCoin.source);
  const [targetCoin, setTargetCoinInner] = useState<CoinProfile>(initialCoin.target);

  const setSourceCoin = (coinType: string) => {
    const coin = coinList.data?.find(coin => coin.coinType === coinType);
    if (!coin) return;
    setSourceCoinInner(coin);
    setQuoteQuery({
      ...quoteQuery,
      sourceCoin: coin.coinType,
    });
  };

  const setTargetCoin = (coinType: string) => {
    const coin = coinList.data?.find(coin => coin.coinType === coinType);
    if (!coin) return;
    setTargetCoinInner(coin);
    setQuoteQuery({
      ...quoteQuery,
      targetCoin: coin.coinType,
    });
  };

  const switchCoin = () => {
    const tmp = sourceCoin;
    setSourceCoin(targetCoin.coinType);
    setTargetCoin(tmp.coinType);
  };

  const setSourceVolume = (volume: number) => {
    setQuoteQuery({
      ...quoteQuery,
      sourceAmount: new Decimal(volume).mul(10 ** sourceCoin.decimals).toNumber(),
    });
  };

  const targetVolume = () => new Decimal(quote.data?.target_amount || 0)
    .div(10 ** targetCoin.decimals)
    .toNumber();

  const { quoteQuery, setQuoteQuery } = useQuoteQuery({
    sourceAmount: 0,
    sourceCoin: sourceCoin.coinType,
    targetCoin: targetCoin.coinType,
  });

  const quote = useQuoteApi({
    chain,
    quoteQuery,
  });

  const routeDigest = () => {
    if (!quote.data) return;

    const venues = [...new Set(quote.data.paths
      .flatMap(p => p.path.steps
        .flatMap(s => s.venues
          .flatMap(v => v.venue.name)))
    )];
    const venuesCount = venues.length;
    const venueNames = venues.join(', ');

    return `Swap via ${venuesCount} venue${venuesCount > 1 ? 's' : ''}: ${venueNames}`;
  };

  // TODO: Add support for Aptos
  const swap = async () => {
    if (!props.wallet) return;
    if (!props.provider) return;
    if (!props.accountAddress) return;
    if (!quote.data) return;

    const txb = await buildTransactionBlockForUmiAgSwap({
      provider: props.provider,
      accountAddress: props.accountAddress,
      quote: quote.data,
      slippageTolerance: 1,
    });
    const { digest } = await props.wallet.signAndExecuteTransactionBlock({ transactionBlock: txb });
    console.log(digest);
  };

  return (
    <div className="p-4 text-black bg-white swap-form w-[600px] rounded-2xl">
      <p>{chain}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-between gap-4"><img src={umiLogo} alt="umi logo" className="w-8 h-8 rounded-full" /> Umi.ag</div>
        <div className="flex justify-between gap-4">
          <select
            className="h-8 px-2 rounded-full outline-none cursor-pointer border-[1px] bg-slate-50"
            onChange={e => setChain(e.currentTarget.value as Chain)}
            defaultValue="Network"
          >
            <option value="sui">Sui</option>
            <option value="aptos" disabled>Aptos</option>
          </select>
          <button className="w-8 h-8 rounded-full outline-none grid place-items-center border-[1px] bg-slate-50">
            <img src={refreshIcon} alt="🔃" className="w-6 h-6" />
          </button>
          <button className="h-8 px-2 rounded-full outline-none border-[1px] bg-slate-50">0.5%</button>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-100 border-slate-200 border-[1px] rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-left text-gray-500">From</span>
          {
            balances.data && <button className="px-2 py-1 text-sm text-gray-100 bg-blue-400 rounded-md">
              Max: {balances.data.find(b => b.coinType === sourceCoin.coinType)?.totalBalance.toFixed(4) ?? 0}
            </button>
          }
        </div>
        <div className="flex items-center justify-between mb-2">
          <select
            className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]"
            value={sourceCoin?.coinType}
            onChange={e => setSourceCoin(e.currentTarget.value)}
          >
            {coinList.data?.map((coin) => (
              <option key={coin.id} value={coin.coinType}>{coin.symbol}</option>
            ))}
          </select>
          <NumericFormat
            value={0}
            onValueChange={val => setSourceVolume(val.floatValue ?? 0)}
            customInput={InputBase}
          />
        </div>
        <p className="text-left text-gray-500">Sui</p>
      </div>

      <div className="flex items-center justify-center p-2">
        <button
          className="w-10 h-10 border-gray-400 rounded-full grid place-items-center border-[1px] hover:bg-slate-100"
          onClick={switchCoin}
        >↑↓</button>
      </div>

      <div className="px-4 py-2 mb-4 bg-white border-slate-200 border-[1px] rounded-xl">
        <p className="mb-2 text-left text-gray-500">To</p>
        <div className="flex items-center justify-between mb-2">
          <select
            className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]"
            value={targetCoin?.coinType}
            onChange={e => setTargetCoin(e.currentTarget.value)}
          >
            {coinList.data?.map((coin) => (
              <option key={coin.id} value={coin.coinType}>{coin.symbol}</option>
            ))}
          </select>
          <NumericFormat
            customInput={InputBase}
            value={targetVolume()}
            disabled
          />
        </div>
        <p className="text-left text-gray-500">USD Coin</p>
      </div>

      <p className="h-4 px-2 mb-4 text-gray-500">{routeDigest()}</p>

      <button
        className="w-full p-4 text-2xl rounded-full bg-emerald-300 hover:bg-emerald-400"
        onClick={swap}
      >
        Swap
      </button>
    </div>
  );
};

export const UmiSwapWidget: React.FC<SwapWidgetProps> = (props) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UmiSwapWidgetContent {...props} />
    </QueryClientProvider>
  );
};
