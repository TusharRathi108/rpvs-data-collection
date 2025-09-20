//* package imports
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

//* file imports
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//? interfaces
interface DateInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
}

const DateInput = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: DateInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...field}
          type="date"
          disabled={disabled}
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </FormControl>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default DateInput;
