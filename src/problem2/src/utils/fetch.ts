import type { Price } from '../types/price';

const PRICE_URL = 'https://interview.switcheo.com/prices.json';

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchPrices(): Promise<Price[]> {
  return fetchJson<Price[]>(PRICE_URL, { cache: 'no-store' });
}
