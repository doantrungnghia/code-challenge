import { type ReactNode, useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <header className="py-2 shadow-sm dark:border-b dark:border-gray-800">
        <div className="container mx-auto flex justify-end">
          <Button
            variant="ghost"
            aria-label="Toggle theme"
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </header>
      {children}
    </>
  );
}

