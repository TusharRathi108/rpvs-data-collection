import * as React from "react";
import { CheckCircle, Circle, ChevronDown } from "lucide-react";
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

type Option = {
  label: string;
  value: string;
};

interface SearchableSelectProps {
  options: Option[];
  value?: string | null;
  onSelect?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onSelect,
  placeholder = "Select...",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    if (disabled) return;
    onSelect?.(val === value ? null : val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={`flex justify-between w-full min-h-[40px] h-auto py-1 bg-white ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="truncate text-left flex-1">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          className="w-[450px] bg-white focus-visible:outline-none p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onValueChange={setSearch}
              className="focus-visible:ring-0"
            />
            <CommandList className="focus-visible:outline-none">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value;
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => handleSelect(opt.value)}
                      className="flex items-center gap-2 py-2"
                    >
                      {/* Number before option */}
                      <span className="w-6 text-gray-500">{index + 1}.</span>

                      {/* Label */}
                      <span className="flex-1 truncate">{opt.label}</span>

                      {/* Selection icon */}
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
      )}
    </Popover>
  );
}
