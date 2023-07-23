import './App.scss';
import { UmiSwapWidget } from './components/Swap';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { JsonRpcProvider, mainnetConnection } from '@mysten/sui.js';
import { Modal } from './components/ModalBase';

function App() {
  const { currentAccount, currentWallet } = useWalletKit();
  const provider = new JsonRpcProvider(mainnetConnection);

  return (
    <>
      {/* <div className="p-16 w-100vw h-100vh">
        <div className="mx-auto my-0 w-[600px]">
          <UmiSwapWidget
            accountAddress={currentAccount?.address}
            wallet={currentWallet}
            provider={provider}
          />
        </div>
      </div> */}

      <Modal>
        <div className="w-[600px]">
          <UmiSwapWidget
            accountAddress={currentAccount?.address}
            wallet={currentWallet}
            provider={provider}
          />
        </div>
      </Modal>

      <div className="grid place-items-center">
        <ConnectButton />
      </div>
    </>
  );
}

export default App;
