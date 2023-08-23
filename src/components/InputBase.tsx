import React from 'react';

export const InputBase: React.FC = (props) => {
  return (
    <input type="text" inputMode="numeric" className="text-3xl font-semibold text-right bg-transparent outline-none w-[70%]" {...props} />
  );
};
