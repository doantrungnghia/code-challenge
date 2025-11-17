export type BigDecimal = {
  value: bigint;
  scale: number;
};

const DECIMAL_PATTERN = /^(?:\d+|\d*\.\d+)$/;

const pow10Cache = new Map<number, bigint>([
  [0, 1n],
  [1, 10n]
]);

function pow10(exponent: number): bigint {
  if (pow10Cache.has(exponent)) {
    return pow10Cache.get(exponent)!;
  }

  const result = 10n ** BigInt(exponent);
  pow10Cache.set(exponent, result);
  return result;
}

function divideAndRound(numerator: bigint, denominator: bigint): bigint {
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;

  if (remainder === 0n) return quotient;

  const shouldRoundUp = remainder * 2n >= denominator;
  return shouldRoundUp ? quotient + 1n : quotient;
}

export function parseDecimal(input: string): BigDecimal | null {
  const normalized = input.replace(/,/g, '').trim();
  if (!normalized) return null;

  const candidate = normalized.startsWith('.') ? `0${normalized}` : normalized;
  if (!DECIMAL_PATTERN.test(candidate)) return null;

  const [intPart, fracPart = ''] = candidate.split('.');
  const digits = `${intPart}${fracPart}`.replace(/^0+(?=\d)/, '') || '0';

  return {
    value: BigInt(digits),
    scale: fracPart.length
  };
}

function numberToPlainString(num: number): string {
  if (!Number.isFinite(num)) return '0';
  const asString = num.toString();
  if (!/[eE]/.test(asString)) {
    return asString;
  }

  return num.toLocaleString('en', {
    useGrouping: false,
    maximumSignificantDigits: 21
  });
}

export function numberToBigDecimal(num: number): BigDecimal {
  return parseDecimal(numberToPlainString(num)) ?? { value: 0n, scale: 0 };
}

export function convertAmountDecimal(
  amount: BigDecimal,
  priceFrom: BigDecimal,
  priceTo: BigDecimal,
  precision = 18
): BigDecimal | null {
  if (priceTo.value === 0n) return null;

  const numerator = amount.value * priceFrom.value * pow10(priceTo.scale + precision);
  const denominator = priceTo.value * pow10(amount.scale + priceFrom.scale);
  const value = divideAndRound(numerator, denominator);

  return { value, scale: precision };
}

export function divideDecimals(
  dividend: BigDecimal,
  divisor: BigDecimal,
  precision = 12
): BigDecimal | null {
  if (divisor.value === 0n) return null;

  const numerator = dividend.value * pow10(divisor.scale + precision);
  const denominator = divisor.value * pow10(dividend.scale);
  const value = divideAndRound(numerator, denominator);

  return { value, scale: precision };
}

function formatIntegerWithGrouping(integer: string): string {
  const trimmed = integer.replace(/^0+(?=\d)/, '') || '0';
  return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatBigDecimal(decimal: BigDecimal, fractionDigits = 8): string {
  const { value, scale } = decimal;
  let scaledValue = value;

  if (scale > fractionDigits) {
    const divisor = pow10(scale - fractionDigits);
    scaledValue = divideAndRound(value, divisor);
  } else if (scale < fractionDigits) {
    const multiplier = pow10(fractionDigits - scale);
    scaledValue = value * multiplier;
  }

  const isNegative = scaledValue < 0n;
  let digits = (isNegative ? -scaledValue : scaledValue).toString();

  if (fractionDigits > 0) {
    digits = digits.padStart(fractionDigits + 1, '0');
    const intPortion = digits.slice(0, -fractionDigits) || '0';
    const fracPortion = digits.slice(-fractionDigits).replace(/0+$/, '');
    const groupedInt = formatIntegerWithGrouping(intPortion);

    return (isNegative ? '-' : '') + (fracPortion ? `${groupedInt}.${fracPortion}` : groupedInt);
  }

  return (isNegative ? '-' : '') + formatIntegerWithGrouping(digits);
}

