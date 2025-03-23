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

interface CategorySearchProps {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CategorySearch = ({ categories = [], value, onChange, disabled = false }: CategorySearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<{ id: string; name: string }[]>([]);

  // Update filtered categories when the query or categories change
  useEffect(() => {
    if (!Array.isArray(categories)) {
      console.error("Categories is not an array:", categories);
      setFilteredCategories([]);
      return;
    }

    if (query.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category && category.name && category.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [query, categories]);

  // Get the display name of the selected category
  const selectedCategory = Array.isArray(categories) 
    ? categories.find(category => category && category.id === value)
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
            {selectedCategory ? selectedCategory.name : "Select a category"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[200px]" align="start">
        <Command className="rounded-lg border shadow-md animate-scale-in">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search categories..." 
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              No categories found.
            </CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySearch;