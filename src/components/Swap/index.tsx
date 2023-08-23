/* eslint-disable max-len */
import React, { useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import umiLogo from '../../assets/umi.jpeg';
import refreshIcon from '../../assets/refresh.svg';
import './style.scss';
import type { JsonRpcProvider } from '@mysten/sui.js';
import { useBalance } from '../../hooks/balance';
import type { Chain, CoinProfile } from '../../type';
import { initialCoinSelection, useCoinList } from '../../hooks/coinList';
import { useQuoteApi, useQuoteQuery } from '../../hooks/quoteApi';
import { buildTransactionBlockForUmiAgSwap } from '@umi-ag/sui-sdk';
import Decimal from 'decimal.js';
import debounce from 'just-debounce';
import { CoinIcon } from './CoinIcon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ModalProps } from '../ModalBase';
import { Modal } from '../ModalBase';
import { InputBase } from '../InputBase';

export type SwapWidgetProps = {
  /**
   * The address of the account to use for the swap.
   */
  accountAddress?: string;
  /**
   * The wallet to use for the swap.
   */
  wallet?: {
    signAndExecuteTransactionBlock: (p: any) => Promise<any>;
  } | null;
  /**
   * Sui JsonRpcProvider
   */
  provider?: JsonRpcProvider;
  /**
   * Partner policy object id for Sui
   */
  partnerPolicyObjectId?: string;
};

// TODO: Refactor
const UmiSwapWidgetContent: React.FC<SwapWidgetProps> = (props) => {
  const [chain, setChain] = useState<Chain>('sui');
  const balances = useBalance({
    chain,
    provider: props.provider,
    accountAddress: props.accountAddress,
  });

  const coinList = useCoinList({
    chain,
  });

  const currentBalance = () => new Decimal(balances.data?.find(b => b.coinType === sourceCoin.coinType)?.totalBalance ?? 0)
    .div(10 ** sourceCoin.decimals)
    .toNumber();

  const initialCoin = useMemo(() => initialCoinSelection[chain], [chain]);
  const [sourceCoin, setSourceCoinInner] = useState<CoinProfile>(initialCoin.source);
  const [targetCoin, setTargetCoinInner] = useState<CoinProfile>(initialCoin.target);

  const setSourceCoin = (coinType: string) => {
    const coin = coinList.data?.find(coin => coin.coinType === coinType);
    if (!coin) return;
    setSourceCoinInner(coin);
    setQuoteQuery({
      ...quoteQuery,
      sourceAmount: new Decimal(sourceVolume).mul(10 ** coin.decimals).toNumber(),
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
    setSourceCoinInner(targetCoin);
    setTargetCoinInner(sourceCoin);
    setQuoteQuery({
      ...quoteQuery,
      sourceAmount: new Decimal(sourceVolume).mul(10 ** targetCoin.decimals).toNumber(),
      sourceCoin: targetCoin.coinType,
      targetCoin: sourceCoin.coinType,
    });
  };

  const [sourceVolume, setSourceVolumeInner] = useState<number>(0);

  const setSourceVolume = (volume: number) => {
    setQuoteQuery({
      ...quoteQuery,
      sourceAmount: new Decimal(volume).mul(10 ** sourceCoin.decimals).toNumber(),
    });
    setSourceVolumeInner(volume);
  };

  const maxSourceVolume = () => {
    const balance = currentBalance();
    setSourceVolume(balance);
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
      partnerPolicyObjectId: props.partnerPolicyObjectId,
    });
    const { digest } = await props.wallet.signAndExecuteTransactionBlock({ transactionBlock: txb });
    console.log(digest);

    await balances.mutate();
  };

  const refresh = debounce(
    async () => {
      await balances.mutate();
      await quote.mutate();
    },
    1000,
  );

  return (
    <div className="w-full p-4 text-black bg-white swap-form rounded-2xl">
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
          <button className="w-8 h-8 rounded-full outline-none grid place-items-center border-[1px] bg-slate-50" onClick={refresh}>
            <img src={refreshIcon} alt="🔃" className="w-6 h-6" />
          </button>
          <button className="h-8 px-2 rounded-full outline-none border-[1px] bg-slate-50">0.5%</button>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-100 border-slate-200 border-[1px] rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-left text-gray-500">From</span>
          {
            balances.data && <button className="px-2 py-1 text-sm text-gray-100 bg-blue-400 rounded-md" onClick={maxSourceVolume}>
              Max: {currentBalance()}
            </button>
          }
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 mr-2">
            <CoinIcon iconUrl={sourceCoin.iconUrl} />
          </div>

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
            value={sourceVolume}
            onValueChange={val => setSourceVolume(val.floatValue ?? 0)}
            customInput={InputBase}
          />
        </div>
        <p className="text-left text-gray-500">{sourceCoin?.name}</p>
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
          <div className="w-8 h-8 mr-2">
            <CoinIcon iconUrl={targetCoin.iconUrl} />
          </div>

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
        <p className="text-left text-gray-500">{targetCoin?.name}</p>
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

export type UmiSwapModalProps = SwapWidgetProps & ModalProps & {
  hideButton?: boolean;
};

export const UmiSwapModal: React.FC<UmiSwapModalProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen ?? false);

  const defaultButton = (
    <button
      className="fixed w-16 h-16 overflow-hidden border-4 border-gray-100 rounded-full shadow-lg cursor-pointer bottom-4 right-4"
      onClick={() => setIsOpen(true)}
    >
      <img src={umiLogo} alt="umi logo" className="rounded-full"/>
    </button>
  );

  return (
    <>
      {!props.hideButton && defaultButton}

      <Modal {...props} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <div className="w-[600px]">
          <UmiSwapWidget {...props} />
          <div className="grid place-items-center">
            <button className="w-8 h-8 mt-4 bg-gray-100 rounded-full" onClick={() => setIsOpen(false)}>✗</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
