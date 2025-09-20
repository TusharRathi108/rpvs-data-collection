//* package imports
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

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
  onSelect?: (option: SelectOption) => void;
}

const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled = false,
  isLoading = false,
  placeholder = "Select an option",
  onSelect,
}: SelectFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select
        disabled={disabled}
        onValueChange={(value) => {
          field.onChange(value);
          const selected = options.find((o) => o.value === value);
          if (selected && onSelect) onSelect(selected);
        }}
        value={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default SelectField;
