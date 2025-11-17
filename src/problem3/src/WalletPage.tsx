import { useMemo, type HTMLAttributes } from 'react';
import { useWalletBalances, usePrices } from './mocks/wallet';
import { WalletRow } from './WalletRow';

interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}
type BoxProps = HTMLAttributes<HTMLDivElement>;
type Props = BoxProps;

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => ({
        ...balance,
        priority: getPriority(balance.blockchain),
      }))
      .filter(({ priority, amount }) => priority > -99 && amount > 0)
      .sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      const formattedAmount = balance.amount.toFixed();
      return (
        <WalletRow
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

export default WalletPage