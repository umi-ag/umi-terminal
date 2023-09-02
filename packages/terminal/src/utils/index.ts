import type { Step, TradingRoute, WeightedHop } from '@umi-ag/sui-sdk';

export const routeDigest = (quote: TradingRoute | null) => {
  if (!quote) return 'No route found';

  // Extract venue names from a given step.
  const extractVenuesFromSteps = (step: Step) => step.venues.flatMap(v => v.venue.name);

  // Extract venue names from a given path.
  const extractVenuesFromPath = ({ path }: WeightedHop) => path
    .steps.flatMap(extractVenuesFromSteps);

  // Retrieve all venue names from the quote's paths and de-duplicate them.
  const venues: string[] = [...new Set(quote.paths.flatMap(extractVenuesFromPath))];

  // Format the venue names and count for the output string.
  const venuesCount: number = venues.length;
  const venueNames: string = venues.join(', ');

  return `Swap via ${venuesCount} venue${venuesCount > 1 ? 's' : ''}: ${venueNames}`;
};
