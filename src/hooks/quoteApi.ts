import { useQuery } from '@tanstack/react-query';
import type { Chain } from '../type';
import type { QuoteQuery } from '@umi-ag/sui-sdk';
import { fetchQuoteFromUmi } from '@umi-ag/sui-sdk';
import { useDebounce } from '@react-hook/debounce';
import Decimal from 'decimal.js';

export const useQuoteQuery = (init: QuoteQuery) => {
  const [quoteQuery, setQuoteQuery] = useDebounce(init, 1000);

  return {
    quoteQuery,
    setQuoteQuery,
  };
};

export const useSuiQuoteApi = (quoteQuery: QuoteQuery) => {
  const query = useQuery({
    queryKey: ['sui', 'quoteApi', quoteQuery],
    queryFn: async () => {
      const [quote] = await fetchQuoteFromUmi(quoteQuery);
      return quote;
    },
    enabled: new Decimal(quoteQuery.sourceAmount).gt(0),
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

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
