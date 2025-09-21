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
interface TextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const TextInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  disabled = false,
  type = "text",
  inputMode,
}: TextInputProps<T>) => {
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
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={field.value ? String(field.value) : ""}
          maxLength={name === "contact_number" ? 10 : undefined}
          inputMode={inputMode}
          onChange={(e) => {
            let value = e.target.value;

            if (name === "contact_number") {
              value = value.replace(/\D/g, "");
              if (value.length > 10) value = value.slice(0, 10);
            }

            field.onChange(value);
          }}
        />
      </FormControl>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default TextInput;
