import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectWithBadgesProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  badgeColor?: string;
  badgeClassName?: string;
  disabled?: boolean;
}

export function MultiSelectWithBadges({
  options,
  values,
  onChange,
  placeholder = "Select...",
  badgeColor = "bg-blue-500",
  badgeClassName,
  disabled = false,
}: MultiSelectWithBadgesProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    if (disabled) return;
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          role="combobox"
          className="flex flex-wrap justify-start gap-1 min-h-[40px] h-auto py-1 bg-white"
        >
          {values.length > 0 ? (
            values.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <Badge
                  key={val}
                  className={cn(
                    `${badgeColor} ${badgeClassName} text-white cursor-default max-w-[300px] truncate`
                  )}
                >
                  <span className="truncate">{opt?.label || val}</span>
                </Badge>
              );
            })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] bg-white focus-visible:outline-none p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList className="focus-visible:outline-none">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => toggleValue(opt.value)}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      values.includes(opt.value) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
