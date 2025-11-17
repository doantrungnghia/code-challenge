# Problem 2

## Run the project

```bash
cd /Users/nghiadoan/Desktop/personal/code-challenge/src/problem2/fancy-form
npm install        # or pnpm install / yarn install
npm run dev        # launches Vite dev server (default http://localhost:5173)
```

Common scripts (see `package.json`):

- `npm run build` – production build via Vite/TypeScript
- `npm run preview` – serve the production build locally
- `npm run lint` – run the configured linters

## Why we introduced `big-decimal.ts`

The conversion form lets users enter arbitrarily large token amounts (e.g. `11232222222222.00001`).  
Relying on JavaScript’s native `number` caused two issues:

1. **Precision loss** – 64‑bit floats cannot represent very large integers and long fractional
   parts exactly, so typing additional digits would stop updating the paired field.
2. **Conversion rounding** – dividing prices that differ greatly in scale produced inconsistent
   rounding when using plain floats, which made the displayed “From/To” values drift.

`src/utils/big-decimal.ts` adds a tiny arbitrary-precision toolkit that:

- Parses user input into a `{ value: bigint, scale: number }` structure.
- Performs conversion/division using `BigInt` so we never lose precision.
- Formats the result back to a human-friendly string with proper grouping.

This module ensures the conversion form stays responsive and accurate for both very large
amounts and high-precision tokens, while keeping the implementation framework-agnostic.

