import type { Chain } from '@/type';
import { create } from 'zustand';

export type ConfigStoreState = {
  chain: Chain;
  slippageTolerance: number;
};

export type ConfigStoreAction = {
  setChain: (chain: Chain) => void;
  setSlippageTolerance: (slippageTolerance: number) => void;
};

export type ConfigStore = ConfigStoreState & ConfigStoreAction;

export const useConfigStore = create<ConfigStore>((set) => {
  const setChain = (chain: Chain) => {
    set({
      chain,
    });
  };

  const setSlippageTolerance = (slippageTolerance: number) => {
    set({
      slippageTolerance,
    });
  };

  return {
    chain: 'sui',
    slippageTolerance: 0.005,
    setChain,
    setSlippageTolerance,
  };
});
