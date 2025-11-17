# Problem 3

## How to Run

1. `cd /Users/nghiadoan/Desktop/personal/code-challenge/src/problem3`
2. `npm install`
3. `npm run dev` and open the shown localhost URL.

## What Was Updated

### Fix code issues

- Added `useWalletBalances`/`usePrices` mocks plus a minimal `WalletRow`.

```
Before: WalletPage expected real hooks/components.
After:  Local mocks and `WalletRow` render a testable table.
```

- Replaced the stray `lhsPriority` reference with `balancePriority`.

```
Before: if (lhsPriority > -99) ...
After:  if (balancePriority > -99) ...
```

- Fixed WalletPage TS errors (BoxProps alias, sort return).

```
Before: interface Props extends BoxProps {} // empty interface & sort callback missing tie return
After:  type Props = HTMLAttributes<HTMLDivElement>; sort callback now returns -1/1/0 (previously missing the tie `return 0`)
```

### Refactor

- Hoisted `getPriority` outside `WalletPage` so rerenders don't recreate the helper.

```
Before: const getPriority = () => { ... } inside component body
After:  getPriority defined once above component
```
- Stabilized `WalletRow` keys by switching from array index to a currency/blockchain pair so React keeps each row’s identity even when the array is resorted:

```
Before: <WalletRow key={index} ... />
After:  <WalletRow key={`${balance.blockchain}-${balance.currency}`} ... />
```

- Inlined amount formatting inside the render map instead of allocating `formattedBalances`, which removes an extra array allocation/pass while keeping the logic in one place:

```
Before: const formattedBalances = sortedBalances.map(balance => ({ ...balance, formatted: balance.amount.toFixed() }))
After:  const formattedAmount = balance.amount.toFixed()
```

- Noted potential rerender costs: computing `rows` directly inside the component means any future state change will rebuild every row, so if perf becomes a concern we should memoize the map or memo `WalletRow`.

Before:

```
const rows = sortedBalances.map(/* ... */);
return <div>{rows}</div>; // recomputed on each render
```

After (recommended if state causes extra renders):

```
const rows = useMemo(() => sortedBalances.map(/* ... */), [sortedBalances, prices]);
return <div>{rows}</div>;
```

- Simplified the priority sort by precomputing `priority` once and subtracting scores in the comparator, avoiding repeated `getPriority` calls and reducing branching:

```
Before: balances.filter(...).sort((lhs, rhs) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) return -1;
  if (rightPriority > leftPriority) return 1;
  return 0;
});

After: balances
  .map(balance => ({ ...balance, priority: getPriority(balance.blockchain) }))
  .filter(({ priority, amount }) => priority > -99 && amount > 0)
  .sort((lhs, rhs) => rhs.priority - lhs.priority);
```

