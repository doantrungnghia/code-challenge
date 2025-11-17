import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from './ui/command';
import { ChevronDown } from 'lucide-react';
import TokenIcon from './TokenIcon';

export default function CurrencySelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const filtered = useMemo(() => options.filter(option => option.toLowerCase().includes(searchString.toLowerCase())), [searchString, options]);

  function handleSelect(sym: string) {
    onChange(sym);
    setOpen(false);
    setSearchString('');
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="default"
        >
          <div className="flex items-center gap-2">
            {value && <TokenIcon symbol={value} />}
            <span>{value || 'Select'}</span>
          </div>
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Command>
          <CommandInput value={searchString} onValueChange={setSearchString} placeholder="Search..." />
          <CommandList className='py-2 max-h-[150px] md:max-h-[200px]'>
            <CommandEmpty>No results.</CommandEmpty>
            {filtered.map(sym => (
              <CommandItem
                key={sym}
                onSelect={() => handleSelect(sym)}
              >
                <TokenIcon symbol={sym} />
                <span>{sym}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


