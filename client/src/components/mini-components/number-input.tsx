//* file imports
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const NumberInput = ({ control, name, label }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="text"
            inputMode="numeric"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default NumberInput;
