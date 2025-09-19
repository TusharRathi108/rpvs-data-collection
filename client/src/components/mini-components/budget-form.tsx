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
      sanction_reference_number: "",
      sanctioned_budget: "",
      sanctioned_budget_date: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id || "",
        district_code: initialData.district_code || "",
        district_name: initialData.district_name || "",
        allocated_budget: initialData.allocated_budget?.toString() || "",
        sanction_reference_number:
          initialData.sanction_reference_number?.toString() || "",
        sanctioned_budget: initialData.sanctioned_budget?.toString() || "",
        sanctioned_budget_date:
          initialData.sanctioned_budget_date?.toString() || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: BudgetHeadFormValues) => {
    const payload = {
      ...values,
      allocated_budget: parseInt(values.allocated_budget, 10),
      sanctioned_budget: parseInt(values.sanctioned_budget, 10),
      sanction_reference_number: values.sanction_reference_number,
      sanctioned_budget_date: values.sanctioned_budget_date,
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
        sanction_reference_number: "",
        sanctioned_budget_date: "",
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
          className="flex flex-col items-center space-y-6 w-full"
        >
          <div className="flex items-center w-full gap-5">
            <FormField
              control={form.control}
              name="district_id"
              render={() => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select
                    disabled={!!initialData}
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

            <FormField
              control={form.control}
              name="sanction_reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sanction Reference Number (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter released budget"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sanctioned_budget_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sanction Budget Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      placeholder="Select sanction budget date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

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
