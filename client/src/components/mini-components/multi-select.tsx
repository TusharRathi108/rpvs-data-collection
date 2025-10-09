import * as React from "react";
import { CheckCircle, Circle } from "lucide-react";
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
  popOverContentClass?: string;
}

export function MultiSelectWithBadges({
  options,
  values,
  onChange,
  placeholder = "Select...",
  badgeColor = "bg-blue-500",
  badgeClassName,
  disabled = false,
  popOverContentClass,
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

      <PopoverContent
        className={cn(
          `w-[250px] bg-white focus-visible:outline-none p-2 ${popOverContentClass}`
        )}
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList className=" focus-visible:outline-none">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt, index) => {
                const isSelected = values.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => toggleValue(opt.value)}
                    className="flex items-center gap-2"
                  >
                    {/* Number before item */}
                    <span className="w-6 text-gray-500">{index + 1}.</span>

                    {/* Label */}
                    <span className="flex-1 text-wrap">{opt.label}</span>

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
    </Popover>
  );
}
