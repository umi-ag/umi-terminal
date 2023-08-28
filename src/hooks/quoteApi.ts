import type { Chain } from '@/type';
import { useDebounce } from '@react-hook/debounce';
import type { QuoteQuery } from '@umi-ag/sui-sdk';
import { fetchQuoteFromUmi } from '@umi-ag/sui-sdk';
import Decimal from 'decimal.js';
import useSWR from 'swr';
import { match } from 'ts-pattern';

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
  const r = match(chain)
    .with('sui', () => useSuiQuoteApi(quoteQuery))
    .otherwise(() => {
      throw new Error(`Unsupported chain: ${chain}`);
    });

  return {
    ...r,
    quote: r.data ?? null,
  };
};
