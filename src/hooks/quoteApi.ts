import type { Chain } from '../type';
import type { QuoteQuery } from '@umi-ag/sui-sdk';
import { fetchQuoteFromUmi } from '@umi-ag/sui-sdk';
import { useDebounce } from '@react-hook/debounce';
import Decimal from 'decimal.js';
import useSWR from 'swr';

export const useQuoteQuery = (init: QuoteQuery) => {
  const [quoteQuery, setQuoteQuery] = useDebounce(init, 1000);

  return {
    quoteQuery,
    setQuoteQuery,
  };
};

export const useSuiQuoteApi = (quoteQuery: QuoteQuery) => {
  const query = useSWR(
    ['sui', 'quoteApi', quoteQuery],
    async () => {
      const [quote] = await fetchQuoteFromUmi(quoteQuery);
      return quote;
    },
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateIfStale: new Decimal(quoteQuery.sourceAmount).gt(0),
    }
  );

  return query;
};

export const useQuoteApi = ({
  chain = 'sui',
  quoteQuery,
}: {
  chain: Chain;
  quoteQuery: QuoteQuery;
}) => {
  if (chain === 'sui') {
    return useSuiQuoteApi(quoteQuery);
  }

  throw new Error(`Unsupported chain: ${chain}`);
};
