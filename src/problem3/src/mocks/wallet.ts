const mockBalances = [
  { currency: 'OSMO', amount: 125.2345, blockchain: 'Osmosis' },
  { currency: 'ETH', amount: 2.43, blockchain: 'Ethereum' },
  { currency: 'ARB', amount: 532.01, blockchain: 'Arbitrum' },
  { currency: 'ZIL', amount: 15, blockchain: 'Zilliqa' },
  { currency: 'NEO', amount: 13.9, blockchain: 'Neo' },
];

const mockPrices: Record<string, number> = {
  OSMO: 0.9,
  ETH: 3400,
  ARB: 1.1,
  ZIL: 0.02,
  NEO: 15.2,
};

export const useWalletBalances = () => mockBalances;
export const usePrices = (): Record<string, number> => mockPrices;
