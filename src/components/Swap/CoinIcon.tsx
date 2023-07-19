import React from 'react';
import coinLogo from '../../assets/money.svg';

export const CoinIcon: React.FC<{ iconUrl?: string | null }> = (props) => {
  const url = props.iconUrl ?? coinLogo;

  return (
    <img src={url} alt="coin icon" className="w-8 h-8 rounded-full" />
  );
  // console.log(props.iconUrl);

  // return (
  //   <object data={props.iconUrl ?? ''} className="w-8 h-8 rounded-full">
  //     <img src={coinLogo} alt="coin logo" className="w-8 h-8 rounded-full"/>
  //   </object>
  // );

  // return (
  //   <picture>
  //     <source srcSet={props.iconUrl ?? ''} />
  //     <img src={coinLogo} alt="coin logo" className="w-8 h-8 rounded-full" />
  //   </picture>
  // );
};
