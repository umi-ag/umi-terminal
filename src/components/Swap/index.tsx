import React, { useState } from 'react';
import { NumericFormat} from 'react-number-format';
import umiLogo from '../../assets/umi.jpeg';

export const Swap: React.FC<{ wallet?: any }> = (props) => {
  const [val, setVal] = useState(0);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className='flex justify-between items-center gap-4'><img src={umiLogo} alt="umi logo" className='w-8 h-8 rounded-full' /> Umi.ag</div>
        <div>(Sui) (Up) (0.5%)</div>
      </div>

      <div className="flex justify-between items-center">
        <div>coin</div>
        <NumericFormat value={val} onValueChange={val => setVal(val.floatValue ?? 0)} />
      </div>

      <div className="grid place-items-center">
        ↑↓
      </div>

      <div className="flex justify-between items-center">
        <div>coin</div>
        <NumericFormat value={123} />
      </div>

      <p className='text-3xl text-red-700'>swap</p>
    </>
  );
};
