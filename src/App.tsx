import './App.scss';
import { UmiSwapWidget } from './components/Swap';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { JsonRpcProvider, mainnetConnection } from '@mysten/sui.js';

function App() {
  const { currentAccount, currentWallet } = useWalletKit();
  const provider = new JsonRpcProvider(mainnetConnection);

  return (
    <>
      <div className="p-16 grid place-items-center w-100vw h-100vh">
        <UmiSwapWidget
          accountAddress={currentAccount?.address}
          wallet={currentWallet}
          provider={provider}
        />
      </div>

      <div className="grid place-items-center">
        <ConnectButton />
      </div>
    </>
  );
}

export default App;
