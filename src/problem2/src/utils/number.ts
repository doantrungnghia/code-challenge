export function formatAmount(value: number, fractionDigits = 8): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: fractionDigits });
}

export function formatRate(value: number, fractionDigits = 10): string {
  return value.toLocaleString(undefined, {
    useGrouping: false,
    maximumFractionDigits: fractionDigits
  });
}

