import { UmiTerminal } from '@umi-ag/terminal';
import '@umi-ag/terminal/style.css';

export default function SwapPage(): JSX.Element {
  return (
    <div className="p-8">
      Lets Swap! yah2 chart
      <div className="w-[600px]">
        <UmiTerminal />
      </div>
    </div>
  );
}
