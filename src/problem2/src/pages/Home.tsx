import { ArrowRightLeft, ShieldCheck } from 'lucide-react';

import ConversionForm from '../components/ConversionForm';

const quickSignals = [
  {
    label: 'Markets tracked',
    value: '120+ venues'
  },
  {
    label: 'Refresh cadence',
    value: '60s live feed'
  }
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-52px)] bg-linear-to-b from-background via-background/95 to-background text-foreground transition-colors">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-highlight bg-highlight-soft px-4 py-1 text-xs uppercase tracking-[0.4em] text-highlight">
            <span>Swap desk</span>
            <ArrowRightLeft className="h-3 w-3 text-highlight" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Trade digital assets with live conversion intelligence
            </h1>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
              Monitor price action across markets, simulate outcomes and execute spot conversions in seconds.
              No distractions—just a clean, data-driven desk tailored for teams in motion.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <p>Backed by on-chain and institutional liquidity venues</p>
            <span className="h-4 w-px bg-border" />
            <p>Live cross coverage refreshed every minute</p>
          </div>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5 ">
            <div className="rounded-3xl border border-border bg-background/80 p-6 text-left text-sm text-muted-foreground backdrop-blur-xl">
              <div className="mb-4 inline-flex items-center gap-2 text-highlight">
                <ShieldCheck className="h-4 w-4 text-highlight" />
                <span className="text-xs uppercase tracking-[0.4em]">Desk brief</span>
              </div>
              <p>
                Pick two assets, preview the live cross rate, and execute in the same panel.
                We surface a trusted venue mix so you can focus on price—not plumbing.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.4em] text-highlight">Quick signals</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickSignals.map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-border bg-card/80 p-4 text-center">
                    <p className="text-2xl font-semibold text-highlight">{signal.value}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{signal.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ConversionForm />
          </div>
        </div>
      </div>
    </div>
  );
}


