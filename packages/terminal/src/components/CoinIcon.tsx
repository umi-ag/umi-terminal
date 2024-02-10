import coinLogo from '@/assets/money.svg';
import React from 'react';

export const CoinIcon: React.FC<{ iconUrl?: string | null }> = (props) => {
  const url = props.iconUrl ?? coinLogo;

  return <img src={url} alt="coin icon" className="w-8 h-8 rounded-full" />;
};
