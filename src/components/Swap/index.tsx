import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import umiLogo from '../../assets/umi.jpeg';
import refreshIcon from '../../assets/refresh.svg';
import './style.scss';
import type { JsonRpcProvider } from '@mysten/sui.js';
import { useBalance } from '../../hooks/balance';
import type { Chain } from '../../type';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useCoinList } from '../../hooks/coinList';

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

  const [val, setVal] = useState(0);

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
            balances.data && <button className="px-2 py-1 text-sm text-gray-100 bg-blue-400 rounded-md">Max: 123</button>
          }
        </div>
        <div className="flex items-center justify-between mb-2">
          <select className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]">
            {coinList.data?.map((coin) => (
              <option key={coin.id} value={coin.symbol}>{coin.symbol}</option>
            ))}
          </select>
          <NumericFormat
            value={val}
            onValueChange={val => setVal(val.floatValue ?? 0)}
            customInput={InputBase}
          />
        </div>
        <p className="text-left text-gray-500">Sui</p>
      </div>

      <div className="flex items-center justify-center p-2">
        <button className="w-10 h-10 border-gray-400 rounded-full grid place-items-center border-[1px] hover:bg-slate-100">↑↓</button>
      </div>

      <div className="px-4 py-2 mb-4 bg-white border-slate-200 border-[1px] rounded-xl">
        <p className="mb-2 text-left text-gray-500">To</p>
        <div className="flex items-center justify-between mb-2">
          <select className="text-2xl bg-transparent outline-none cursor-pointer min-w-[4em]">
            {coinList.data?.map((coin) => (
              <option key={coin.id} value={coin.symbol}>{coin.symbol}</option>
            ))}
          </select>
          <NumericFormat
            customInput={InputBase}
            value={123}
            disabled
          />
        </div>
        <p className="text-left text-gray-500">USD Coin</p>
      </div>

      <button className="w-full p-4 text-2xl rounded-full bg-emerald-300 hover:bg-emerald-400">Swap</button>
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
