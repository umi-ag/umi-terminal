import React from 'react';

export type SwitchButtonProps = {
  onClick: () => void;
};

export const SwitchButton: React.FC<SwitchButtonProps> = (props) => {
  return <div className="flex items-center justify-center p-2">
    <button
      className="w-10 h-10 border-gray-400 rounded-full grid place-items-center border-[1px] hover:bg-slate-100"
      onClick={props.onClick}
    >↑↓</button>
  </div>;
};
