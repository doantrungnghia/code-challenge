import { z } from 'zod';
import { parseDecimal } from '../utils/big-decimal';

const positiveAmountSchema = z.string().min(1, { message: 'Amount is required' }).refine((val) => {
  const decimal = parseDecimal(val);
  if (!decimal) return false;
  return decimal.value > 0n;
}, { message: 'Enter a positive amount' });

export const conversionFormSchema = z.object({
  fromAmount: positiveAmountSchema,
  toAmount: z.string(),
  fromSymbol: z.string().min(1, { message: 'Select a token' }),
  toSymbol: z.string().min(1, { message: 'Select a token' })
}).refine((val) => val.fromSymbol !== val.toSymbol, {
  message: 'Choose a different token',
  path: ['toSymbol']
});

export type ConversionFormValues = z.infer<typeof conversionFormSchema>;


