import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { WalletKitProvider } from '@mysten/wallet-kit';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletKitProvider>
      <App />
    </WalletKitProvider>
  </React.StrictMode>,
);
