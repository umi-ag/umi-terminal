import { create } from 'zustand';
import type { UmiTerminalProps } from '../type';

export const a = 1;

type State = UmiTerminalProps;

export const useUserContext = create<State>()((set) => {
  const setProps = (props: Partial<State>) => {
    set(props);
  };

  const setWallet = (wallet: State['wallet']) => {
    set({
      wallet,
    });
  };

  const setProvider = (provider: State['provider']) => {
    set({
      provider,
    });
  };

  const setAccountAddress = (accountAddress: State['accountAddress']) => {
    set({
      accountAddress,
    });
  };

  const setPartnerPolicyObjectId = (partnerPolicyObjectId: State['partnerPolicyObjectId']) => {
    set({
      partnerPolicyObjectId,
    });
  };

  return {
    setProps,
    setWallet,
    setProvider,
    setAccountAddress,
    setPartnerPolicyObjectId,
  };
});
