/* eslint-disable max-len */
import refreshIcon from '@/assets/refresh.svg';
import umiLogo from '@/assets/umi.jpeg';
import { CoinIcon } from '@/components/CoinIcon';
import { InputBase } from '@/components/InputBase';
import { useSwapContext } from '@/store';
import type { Chain, UmiTerminalProps } from '@/type';
import { routeDigest } from '@/utils';
import { buildTransactionBlockForUmiAgSwap } from '@umi-ag/sui-sdk';
import debounce from 'just-debounce';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { SwitchButton } from '../SwitchButton';
import './style.scss';

const Header: React.FC<UmiTerminalProps> = (props) => {
  const { setChain, reloadBalances, reloadQuote } = useSwapContext(props);

  const refresh = debounce(
    () => Promise.allSettled([reloadBalances(), reloadQuote()]),
    1000
  );

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center justify-between gap-4">
        <img src={umiLogo} alt="umi logo" className="w-8 h-8 rounded-full" />{' '}
        Umi.ag
      </div>
      <div className="flex justify-between gap-4">
        <select
          className="h-8 px-2 rounded-full outline-none cursor-pointer border-[1px] bg-slate-50"
          onChange={(e) => setChain(e.currentTarget.value as Chain)}
          defaultValue="Network"
        >
          <option value="sui">Sui</option>
          <option value="aptos" disabled>
            Aptos
          </option>
        </select>
        <button
          className="w-8 h-8 rounded-full outline-none grid place-items-center border-[1px] bg-slate-50"
          onClick={refresh}
        >
          <img src={refreshIcon} alt="🔃" className="w-6 h-6" />
        </button>
        <button className="h-8 px-2 rounded-full outline-none border-[1px] bg-slate-50">
          0.5%
        </button>
      </div>
    </div>
  );
};

const SourceInput: React.FC<UmiTerminalProps> = (props) => {
  const {
    sourceCoin,
    sourceVolume,
    setSourceCoin,
    setSourceVolume,
    maxSourceVolume,
    sourceCoinBalance,
    coinList,
  } = useSwapContext(props);

  return (
    <div className="px-4 py-2 bg-slate-100 border-slate-200 border-[1px] rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-left text-gray-500">From</span>
        {sourceCoinBalance() && (
          <button
            className="px-2 py-1 text-sm text-gray-100 bg-blue-400 rounded-md"
            onClick={maxSourceVolume}
          >
            Max: {sourceCoinBalance()}
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 mr-2">
          <CoinIcon iconUrl={sourceCoin?.iconUrl} />
        </div>

        <select
          className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]"
          value={sourceCoin?.coinType}
          onChange={(e) => setSourceCoin(e.currentTarget.value)}
        >
          {coinList.map((coin) => (
            <option key={coin.id} value={coin.coinType}>
              {coin.symbol}
            </option>
          ))}
        </select>
        <NumericFormat
          value={sourceVolume}
          onValueChange={(val) => setSourceVolume(val.floatValue ?? 0)}
          customInput={InputBase}
        />
      </div>
      <p className="text-left text-gray-500">{sourceCoin?.name}</p>
    </div>
  );
};

const TargetInput: React.FC<UmiTerminalProps> = (props) => {
  const { targetCoin, targetVolume, setTargetCoin, coinList } =
    useSwapContext(props);

  return (
    <div className="px-4 py-2 mb-4 bg-white border-slate-200 border-[1px] rounded-xl">
      <p className="mb-2 text-left text-gray-500">To</p>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 mr-2">
          <CoinIcon iconUrl={targetCoin?.iconUrl} />
        </div>

        <select
          className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]"
          value={targetCoin?.coinType}
          onChange={(e) => setTargetCoin(e.currentTarget.value)}
        >
          {coinList.map((coin) => (
            <option key={coin.id} value={coin.coinType}>
              {coin.symbol}
            </option>
          ))}
        </select>
        <NumericFormat customInput={InputBase} value={targetVolume} disabled />
      </div>
      <p className="text-left text-gray-500">{targetCoin?.name}</p>
    </div>
  );
};

const RouteDigest: React.FC<UmiTerminalProps> = (props) => {
  const { quote } = useSwapContext(props);

  return <p className="h-4 px-2 mb-4 text-gray-500">{routeDigest(quote)}</p>;
};

const SwapButton: React.FC<UmiTerminalProps> = (props) => {
  const { quote, reloadBalances } = useSwapContext(props);

  // TODO: Add support for Aptos
  const swap = async () => {
    if (!props.wallet) return;
    if (!props.provider) return;
    if (!props.accountAddress) return;
    if (!quote) return;

    const txb = await buildTransactionBlockForUmiAgSwap({
      provider: props.provider,
      accountAddress: props.accountAddress,
      quote: quote,
      slippageTolerance: 1,
      partnerPolicyObjectId: props.partnerPolicyObjectId,
    });
    const { digest } = await props.wallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
    });
    console.log(digest);

    await reloadBalances();
  };

  return (
    <button
      className="w-full p-4 text-2xl rounded-full bg-emerald-300 hover:bg-emerald-400"
      onClick={swap}
    >
      Swap
    </button>
  );
};

const UmiTerminalBase: React.FC<UmiTerminalProps> = (props) => {
  const { switchCoin } = useSwapContext(props);

  return (
    <div className="w-full p-4 text-black bg-white swap-form rounded-2xl">
      <Header {...props} />
      <SourceInput {...props} />
      <SwitchButton onClick={switchCoin} />
      <TargetInput {...props} />
      <RouteDigest {...props} />
      <SwapButton {...props} />
    </div>
  );
};

export const UmiTerminal: React.FC<UmiTerminalProps> = (props) => {
  return <UmiTerminalBase {...props} />;
};
