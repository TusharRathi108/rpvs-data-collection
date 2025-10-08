import * as React from "react";
import { CheckCircle, Circle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface SingleSelectWithNumberingProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SingleSelectWithNumbering({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: SingleSelectWithNumberingProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          role="combobox"
          className="flex justify-between w-full min-h-[40px] h-auto py-1 bg-white"
        >
          <span className="truncate">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[450px] bg-white focus-visible:outline-none p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList className="focus-visible:outline-none">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt, index) => {
                const isSelected = opt.value === value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onChange(opt.value === value ? null : opt.value);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    {/* Number before item */}
                    <span className="w-6 text-gray-500">{index + 1}.</span>

                    {/* Label */}
                    <span className="flex-1 truncate">{opt.label}</span>

                    {/* Icon for selection */}
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
