//* package imports
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

//* file imports
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//? interfaces
interface SelectOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  classStyleFieldControl?: string;
  onSelect?: (option: SelectOption) => void;
  fallbackLabel?: string;
}

const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled = false,
  isLoading = false,
  placeholder = "Select an option",
  classStyleFieldControl = "",
  onSelect,
  fallbackLabel,
}: SelectFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const selectedOption = options.find((o) => o.value === field.value);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select
        disabled={disabled || isLoading}
        onValueChange={(value) => {
          field.onChange(value);
          const selected = options.find((o) => o.value === value);
          if (selected && onSelect) onSelect(selected);
        }}
        value={field.value}
      >
        <FormControl>
          <SelectTrigger className={cn(classStyleFieldControl)}>
            <SelectValue
              placeholder={
                isLoading
                  ? "Loading..."
                  : selectedOption?.label || fallbackLabel || placeholder
              }
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white">
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default SelectField;
