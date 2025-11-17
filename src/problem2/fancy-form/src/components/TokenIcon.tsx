const modules = import.meta.glob('../assets/tokens/*.svg', { as: 'url', eager: true }) as Record<string, string>;

const ICON_URL_BY_SYMBOL: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([p, url]) => [p.split('/').pop()!.replace('.svg', '').toUpperCase(), url])
);

function getTokenIconUrl(symbol: string): string {
  return ICON_URL_BY_SYMBOL[(symbol || '').toUpperCase()] || '';
}

export default function TokenIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const src = getTokenIconUrl(symbol);
  if (!src) return null;

  return <img src={src} alt={symbol} width={size} height={size} />;
}


