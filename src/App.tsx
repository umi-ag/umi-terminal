import './App.scss';
import { Swap } from './components/Swap';

function App() {
  return (
    <>
      <div className="p-16 grid place-items-center w-100vw h-100vh">
        <Swap wallet={null}></Swap>
      </div>
    </>
  );
}

export default App;
