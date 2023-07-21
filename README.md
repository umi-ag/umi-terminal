# @umi-ag/swap-widget

## Overview

@umi-ag/swap-widget is a powerful library designed for React projects. It
encapsulates components for a Swap interface, hooks for interacting with quote
API and sui-coin-list API. This library simplifies the process of introducing
cryptocurrency swapping functionalities into your React applications, enabling a
quick and easy trading experience for your users. The primary aim is to
facilitate a seamless integration of Umi Aggregator's functionality into users'
websites. A live demonstration of the Swap widget can be viewed at
[https://swap-widget.umi.ag](https://swap-widget.umi.ag).

## Features

1. Swap Interface: Provides a ready-made Swap component, allowing you to
   introduce cryptocurrency swapping capabilities in your React applications
   instantly.
2. Quote API Hooks: Contains hooks that allow your application to interact with
   the quote API, facilitating the discovery of efficient trading routes, akin
   to what's offered by 1inch.
3. Sui-coin-list API Hooks: Includes hooks to interact with the sui-coin-list
   API, simplifying the process of fetching coin data from Sui.

## Installation

To install the @umi-ag/swap-widget library, run the following command in your
project's root directory:

```bash
npm install @umi-ag/swap-widget
```

Or with yarn/pnpm:

```bash
yarn add @umi-ag/swap-widget
pnpm add @umi-ag/swap-widget
```

## Usage

### Swap Interface

```tsx
import { UmiSwapWidget } from "./components/Swap";
import { JsonRpcProvider, mainnetConnection } from "@mysten/sui.js";

function App() {
  const { currentAccount, currentWallet } = useWalletKit();
  const provider = new JsonRpcProvider(mainnetConnection);

  /**
   * You need to pass these props to the UmiSwapWidget component:
   * 1. accountAddress: string
   * 2. wallet: Wallet
   *    (which must have a method called "signAndExecuteTransactionBlock(")
   * 3. provider: JsonRpcProvider
   */

  return (
    <>
      <UmiSwapWidget
        accountAddress={currentAccount?.address}
        wallet={currentWallet}
        provider={provider}
      />
    </>
  );
}

export default App;
```

### Hooks

Or you can use the hooks directly:

```tsx
import { useCoinListAPI, useQuoteAPI } from "@umi-ag/swap-widget";
```

To incorporate the @umi-ag/swap-widget in your project, follow these simple
steps:

1. Import the library into your React project.

```javascript
import {
  SwapComponent,
  useQuoteAPI,
  useSuiCoinListAPI,
} from "@umi-ag/swap-widget";
```

2. Use the SwapComponent to provide swapping functionality in your application.

```javascript
<SwapComponent />;
```

3. Leverage the `useQuoteAPI()` and `useSuiCoinListAPI()` hooks to interact with
   the respective APIs.

```javascript
const { data: quoteData, error: quoteError } = useQuoteAPI();
const { data: coinListData, error: coinListError } = useSuiCoinListAPI();
```

These hooks will handle fetching data from the quote and sui-coin-list APIs,
respectively, and will return the data and any error that occurs during the
fetch.

Please refer to our comprehensive documentation for a more in-depth guide on how
to use the @umi-ag/swap-widget library.

## Live Demo

For a practical understanding of how @umi-ag/swap-widget can enhance your
project, please visit our live demo at
[https://swap-widget.umi.ag](https://swap-widget.umi.ag).

## Contributing

We warmly welcome contributions to the @umi-ag/swap-widget! Please ensure that
your code adheres to our style guidelines, and all tests pass before submitting
a Pull Request. Thank you for your contribution to @umi-ag/swap-widget!
