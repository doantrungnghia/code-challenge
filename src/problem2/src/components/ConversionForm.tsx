import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import CurrencySelect from './CurrencySelect';
import { Skeleton } from './ui/skeleton';
import { fetchPrices } from '../utils/fetch';
import { conversionFormSchema, type ConversionFormValues } from '../types/conversion';
import {
  convertAmountDecimal,
  divideDecimals,
  formatBigDecimal,
  numberToBigDecimal,
  parseDecimal,
  type BigDecimal
} from '../utils/big-decimal';

type PricesMap = Map<string, number>;

export default function ConversionForm() {
  const { data: priceMap, error, isLoading } = useQuery({
    queryKey: ['prices'],
    queryFn: async (): Promise<PricesMap> => {
      const payload = await fetchPrices();
      return new Map(payload.map((row) => [row.currency.toUpperCase(), row.price]));
    },
    staleTime: 60000
  });

  const prices = priceMap ?? null;

  const symbols = useMemo(() => (prices ? Array.from(prices.keys()).sort() : []), [prices]);

  const form = useForm<ConversionFormValues>({
    resolver: zodResolver(conversionFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fromAmount: '',
      toAmount: '',
      fromSymbol: '',
      toSymbol: ''
    }
  });

  const from = useWatch({ control: form.control, name: 'fromSymbol' });
  const to = useWatch({ control: form.control, name: 'toSymbol' });
  const toSymbolError = form.formState.errors.toSymbol?.message;

  const priceDecimals = useMemo(() => {
    if (!prices) return null;

    const map = new Map<string, BigDecimal>();
    prices.forEach((price, symbol) => {
      map.set(symbol, numberToBigDecimal(price));
    });

    return map;
  }, [prices]);

  const rateText = useMemo(() => {
    if (!from || !to || from === to || !priceDecimals) return null;
    const priceFrom = priceDecimals.get(from);
    const priceTo = priceDecimals.get(to);
    if (!priceFrom || !priceTo) return null;

    const rateDecimal = divideDecimals(priceFrom, priceTo, 12);
    if (!rateDecimal) return null;
    return formatBigDecimal(rateDecimal, 10);
  }, [from, to, priceDecimals]);

  useEffect(() => {
    if (!symbols.length) return;

    const existingFrom = form.getValues('fromSymbol');
    const existingTo = form.getValues('toSymbol');
    const first = existingFrom || symbols[0];
    const second = existingTo || (symbols.find((symbol) => symbol !== first) ?? symbols[0]);

    if (!existingFrom && first) {
      form.setValue('fromSymbol', first);
    }

    if (!existingTo && second) {
      form.setValue('toSymbol', second);
    }
  }, [symbols, form]);

  const updateAmounts = useCallback((value: string, source: 'from' | 'to', onChange: (val: string) => void) => {
    onChange(value);

    const targetField = source === 'from' ? 'toAmount' : 'fromAmount';
    const options =
      source === 'from'
        ? { shouldDirty: false, shouldTouch: false }
        : { shouldValidate: true, shouldTouch: true };

    const opponentSymbol = source === 'from' ? to : from;
    const sourceSymbol = source === 'from' ? from : to;

    if (!priceDecimals || !opponentSymbol || !sourceSymbol) {
      form.setValue(targetField, '', options);
      return;
    }

    const amountDecimal = parseDecimal(value);
    if (!amountDecimal) {
      form.setValue(targetField, '', options);
      return;
    }

    const priceSource = priceDecimals.get(sourceSymbol);
    const priceOpponent = priceDecimals.get(opponentSymbol);
    if (!priceSource || !priceOpponent) {
      form.setValue(targetField, '', options);
      return;
    }

    const conversion = convertAmountDecimal(
      amountDecimal,
      priceSource,
      priceOpponent,
      18
    );

    if (!conversion) {
      form.setValue(targetField, '', options);
      return;
    }

    form.setValue(targetField, formatBigDecimal(conversion, 8), options);
  }, [form, from, to, priceDecimals]);

  return (
    <div className="rounded-3xl border border-border bg-card/90 p-6 text-foreground shadow-2xl backdrop-blur-xl">
      <div className="mb-6 space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-highlight">Convert</p>
        <h2 className="text-2xl font-semibold">Instant conversion</h2>
        <p className="text-sm text-muted-foreground">
          Enter the amount to convert and pick the assets you want to exchange.
          We&apos;ll take care of the rest with real-time pricing.
        </p>
      </div>

      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(() => undefined)}>
          <div className="flex md:flex-row flex-col-reverse md:items-start items-end gap-3 rounded-2xl border border-border bg-card/80 p-4">
            <div className="flex flex-1 flex-col gap-2">
              <FormField
                control={form.control}
                name="fromAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">From</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0.00"
                        className="border-none bg-transparent px-0 text-3xl font-semibold text-foreground focus-visible:ring-0"
                        value={field.value}
                        onChange={(event) => updateAmounts(event.target.value, 'from', field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fromSymbol"
              render={({ field }) => (
                <FormItem className="min-w-[140px]">
                  <FormControl>
                    <CurrencySelect value={field.value} onChange={field.onChange} options={symbols} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex md:flex-row flex-col-reverse md:items-start items-end gap-3 rounded-2xl border border-border bg-card/80 p-4">
            <div className="flex flex-1 flex-col gap-2">
              <FormField
                control={form.control}
                name="toAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">To</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0.00"
                        className="border-none bg-transparent px-0 text-3xl font-semibold text-foreground focus-visible:ring-0"
                        value={field.value}
                        onChange={(event) => updateAmounts(event.target.value, 'to', field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="toSymbol"
              render={({ field }) => (
                <FormItem className="min-w-[140px]">
                  <FormControl>
                    <CurrencySelect value={field.value} onChange={field.onChange} options={symbols} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-card/80 p-4 text-center text-sm text-muted-foreground">
            {isLoading && <Skeleton className="mx-auto h-5 w-1/2 bg-muted" />}

            {!isLoading && rateText && from && to && (
              <p className="text-foreground">
                {`1 ${from} ≈ ${rateText} ${to}`}
              </p>
            )}

            {!!error && (
              <p className="text-destructive">
                Cannot fetch prices
              </p>
            )}
            {!!toSymbolError && (
              <p className="text-destructive">
                {toSymbolError}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}


