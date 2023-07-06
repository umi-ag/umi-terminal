import './App.scss';
import { UmiSwapWidget } from './components/Swap';

function App() {
  return (
    <>
      <div className="p-16 grid place-items-center w-100vw h-100vh">
        <UmiSwapWidget wallet={null}></UmiSwapWidget>
      </div>
    </>
  );
}

export default App;
