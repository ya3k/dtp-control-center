'use client'
import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Destination } from '@/types/destination';

interface DestinationSearchProps {
  destinations: Destination[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DestinationSearch = ({ 
  destinations = [], 
  value, 
  onChange, 
  disabled = false 
}: DestinationSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

  // Update filtered destinations when the query or destinations change
  useEffect(() => {
    if (!Array.isArray(destinations)) {
      console.error("Destinations is not an array:", destinations);
      setFilteredDestinations([]);
      return;
    }

    if (query.trim() === '') {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter(destination => 
        destination && destination.name && destination.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [query, destinations]);

  // Get the display name of the selected destination
  const selectedDestination = Array.isArray(destinations) 
    ? destinations.find(destination => destination && destination.id === value)
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between input-transition bg-background",
            disabled && "opacity-70 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedDestination ? selectedDestination.name : "Chọn điểm đến..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[200px]" align="start">
        <Command className="rounded-lg border shadow-md animate-scale-in">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Tìm kiếm điểm đến..." 
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              Không tìm thấy điểm đến.
            </CommandEmpty>
            <CommandGroup>
              {filteredDestinations.map((destination) => (
                <CommandItem
                  key={destination.id}
                  value={destination.name}
                  onSelect={() => {
                    onChange(destination.id);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === destination.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{destination.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DestinationSearch; 