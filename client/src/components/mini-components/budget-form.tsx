//* package imports
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//* file imports
import {
  BudgetHeadSchema,
  type BudgetHeadFormValues,
} from "@/schemas/budget-head.schema";
import {
  Form,
  FormControl,
  FormField,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/interfaces/api-error.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";
import {
  useCreateBudgetHeadMutation,
  useUpdateBudgetHeadMutation,
} from "@/store/services/budget-head.api";
import type { BudgetHead } from "@/interfaces/budget-head.interface";

const BudgetHeadForm = ({
  districts,
  isLoading,
  initialData,
  onSuccess,
}: HeadFormProps<BudgetHead>) => {
  const [createBudgetHead] = useCreateBudgetHeadMutation();
  const [updateBudgetHead] = useUpdateBudgetHeadMutation();

  const form = useForm<BudgetHeadFormValues>({
    resolver: zodResolver(BudgetHeadSchema),
    defaultValues: {
      district_id: "",
      district_code: "",
      district_name: "",
      allocated_budget: "",
      sanctioned_budget: "",
      released_budget: "",
    },
  });

  // 🔹 Reset form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id || "",
        district_code: initialData.district_code || "",
        district_name: initialData.district_name || "",
        allocated_budget: initialData.allocated_budget?.toString() || "",
        sanctioned_budget: initialData.sanctioned_budget?.toString() || "",
        released_budget: initialData.released_budget?.toString() || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: BudgetHeadFormValues) => {
    const payload = {
      ...values,
      allocated_budget: parseInt(values.allocated_budget, 10),
      sanctioned_budget: parseInt(values.sanctioned_budget, 10),
      released_budget: parseInt(values.released_budget, 10),
    };

    try {
      if (initialData?._id) {
        await updateBudgetHead({
          budget_head_id: initialData._id,
          ...payload,
        }).unwrap();
        toast.success("Budget Head updated successfully");
      } else {
        await createBudgetHead(payload).unwrap();
        toast.success("Budget Head created successfully");
      }

      onSuccess?.();
      form.reset({
        district_id: "",
        district_code: "",
        district_name: "",
        allocated_budget: "",
        sanctioned_budget: "",
        released_budget: "",
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError?.data?.error?.message) {
        toast.error(apiError.data.error.message);
      } else if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else {
        toast.error("Failed to submit budget head");
      }
    }
  };

  return (
    <div className="tab-content active">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          {/* District Dropdown */}
          <FormField
            control={form.control}
            name="district_id"
            render={() => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select
                  disabled={!!initialData} // disable when editing
                  onValueChange={(value) => {
                    const selected = districts.find(
                      (district) => district._id === value
                    );
                    if (selected) {
                      form.setValue("district_id", selected._id);
                      form.setValue("district_code", selected.district_code);
                      form.setValue("district_name", selected.district_name);
                    }
                  }}
                  value={form.watch("district_id")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading..." : "Select District"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {districts.map((district) => (
                      <SelectItem key={district._id} value={district._id}>
                        {district.district_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Allocated Budget */}
          <FormField
            control={form.control}
            name="allocated_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allocated Budget (₹)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter allocated budget"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sanctioned Budget */}
          <FormField
            control={form.control}
            name="sanctioned_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sanctioned Budget (₹)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter sanctioned budget"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Released Budget */}
          <FormField
            control={form.control}
            name="released_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Released Budget (₹)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter released budget"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BudgetHeadForm;
