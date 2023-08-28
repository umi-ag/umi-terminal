import { create } from 'zustand';
import type { CoinProfile, CoinBalance, Chain } from '../type';
import { initialCoinSelection } from '../hooks/coinList';

export type CoinStoreState = {
  sourceCoin: CoinProfile | null;
  targetCoin: CoinProfile | null;
  sourceVolume: number;
};

export type CoinStoreAction = {
  initCoins: (chain: Chain) => void;
  setSourceCoin: (coinList: CoinProfile[], coinType: string) => void;
  setTargetCoin: (coinList: CoinProfile[], coinType: string) => void;
  setSourceVolume: (volume: number) => void;
  switchCoin: () => void;
  maxSourceVolume: (balances: CoinBalance[]) => void;
  sourceCoinBalance: (balances: CoinBalance[]) => number | undefined;
};

export type CoinStore = CoinStoreState & CoinStoreAction;

export const useCoinStore = create<CoinStore>((set, get) => {
  const initCoins = (chain: Chain) => {
    const initialCoin = initialCoinSelection[chain];
    set({
      sourceCoin: initialCoin.source,
      targetCoin: initialCoin.target,
    });
  };

  const setSourceCoin = (coinList: CoinProfile[], coinType: string) => {
    const coin = coinList.find(coin => coin.coinType === coinType);
    if (!coin) return;
    set({
      sourceCoin: coin,
    });
  };

  const setTargetCoin = (coinList: CoinProfile[], coinType: string) => {
    const coin = coinList.find(coin => coin.coinType === coinType);
    if (!coin) return;
    set({
      targetCoin: coin,
    });
  };

  const switchCoin = () => {
    const { sourceCoin, targetCoin } = get();
    set({
      sourceCoin: targetCoin,
      targetCoin: sourceCoin,
    });
  };

  const setSourceVolume = (volume: number) => {
    set({
      sourceVolume: volume,
    });
  };

  const maxSourceVolume = (balances: CoinBalance[]) => {
    const sourceCoin = get().sourceCoin;
    if (!sourceCoin) return;

    const sourceVolume = balances.find(balance => balance.coinType === sourceCoin.coinType)
      ?.totalBalance
      .div(10 ** sourceCoin.decimals)
      .toNumber();

    if (!sourceVolume) return;
    setSourceVolume(sourceVolume);
  };

  const sourceCoinBalance = (balances: CoinBalance[]) => {
    const sourceCoin = get().sourceCoin;
    if (!sourceCoin) return 0;

    const balance = balances.find(balance => balance.coinType === sourceCoin.coinType)
      ?.totalBalance;

    if (!balance) return 0;
    return balance
      .div(10 ** sourceCoin.decimals)
      .toNumber();
  };

  return {
    sourceCoin: null,
    targetCoin: null,
    sourceVolume: 0,
    initCoins,
    setSourceCoin,
    setTargetCoin,
    setSourceVolume,
    switchCoin,
    maxSourceVolume,
    sourceCoinBalance,
  };
});
