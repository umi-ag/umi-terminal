import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import './App.scss';
import { UmiTerminal, UmiTerminalModal } from './components/Terminal';

function App() {
  const { currentAccount, currentWallet } = useWalletKit();
  const provider = new SuiClient({
    url: getFullnodeUrl('mainnet'),
  });

  return (
    <div className="bg-black">
      <div className="p-8 w-100vw h-100vh">
        <div className="mx-auto my-0 max-w-[500px]">
          <UmiTerminal
            accountAddress={currentAccount?.address}
            wallet={currentWallet}
            provider={provider}
          />
        </div>
      </div>

      <UmiTerminalModal isOpen={false} />

      <div className="grid place-items-center">
        <ConnectButton />
      </div>
    </div>
  );
}

export default App;
