import React from 'react';
import { NumericFormat} from 'react-number-format';

export const Swap: React.FC<{ wallet: any }> = (props) => {
  return (
    <>
      <NumericFormat value={123} />
      <p className='text-3xl text-red-700'>aaa</p>
    </>
  );
};
