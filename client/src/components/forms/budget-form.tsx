//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

//* file imports
import type { ApiError } from "@/interfaces/api-error.interface";
import type { BudgetHead } from "@/interfaces/budget-head.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";
import {
  budgetHeadSchema,
  type budgetHeadFormSchema,
} from "@/schemas/budget-head.schema";

//* components
import DateInput from "@/components/mini-components/date-input";
import NumberInput from "@/components/mini-components/number-input";
import SelectField from "@/components/mini-components/select-field";
import TextInput from "@/components/mini-components/text-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

//* api-calls
import {
  useCreateBudgetHeadMutation,
  useUpdateBudgetHeadMutation,
} from "@/store/services/budget-head.api";

//? helpers
const getDefaultValues = (): budgetHeadFormSchema => ({
  district_id: "",
  district_code: "",
  district_name: "",
  allocated_budget: "",
  sanction_reference_number: "",
  sanctioned_budget: "",
  sanctioned_budget_date: "",
});

const parsePayload = (values: budgetHeadFormSchema) => ({
  ...values,
  allocated_budget: parseInt(values.allocated_budget, 10),
  sanctioned_budget: parseInt(values.sanctioned_budget, 10),
});

const BudgetHeadForm = ({
  districts,
  isLoading,
  initialData,
  onSuccess,
}: HeadFormProps<BudgetHead>) => {
  const [createBudgetHead] = useCreateBudgetHeadMutation();
  const [updateBudgetHead] = useUpdateBudgetHeadMutation();

  const form = useForm<budgetHeadFormSchema>({
    resolver: zodResolver(budgetHeadSchema),
    defaultValues: getDefaultValues(),
  });

  //? handler-function
  const onSubmit = async (values: budgetHeadFormSchema) => {
    const payload = parsePayload(values);

    // console.log("BUDGET HEAD ID: ", initialData?._id);
    // return;

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
      form.reset(getDefaultValues());
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to submit budget head"
      );
    }
  };

  //* use-effects
  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id || "",
        district_code: initialData.district_code || "",
        district_name: initialData.district_name || "",
        allocated_budget: initialData.allocated_budget?.toString() || "",
        sanction_reference_number: initialData.sanction_number || "",
        sanctioned_budget: initialData.sanctioned_budget?.toString() || "",
        sanctioned_budget_date: initialData.sanctioned_budget_date
          ? new Date(initialData.sanctioned_budget_date)
              .toISOString()
              .split("T")[0]
          : "",
      });
    } else {
      form.reset(getDefaultValues());
    }
  }, [initialData, form]);

  return (
    <div className="tab-content active">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 w-full"
        >
          <div className="flex items-center w-full gap-5">
            <SelectField
              control={form.control}
              name="district_id"
              label="District"
              options={districts.map((d) => ({
                value: d._id,
                label: d.district_name,
                ...d,
              }))}
              disabled={!!initialData}
              isLoading={isLoading}
              placeholder="Select District"
              onSelect={(selected) => {
                form.setValue("district_id", selected._id);
                form.setValue("district_code", selected.district_code);
                form.setValue("district_name", selected.district_name);
              }}
            />

            <NumberInput
              control={form.control}
              name="allocated_budget"
              label="Allocated Budget (₹)"
            />

            <TextInput
              control={form.control}
              name="sanction_reference_number"
              label="Sanction Reference Number"
              placeholder="Enter reference number"
            />

            <DateInput
              control={form.control}
              name="sanctioned_budget_date"
              label="Sanction Budget Date"
            />

            <NumberInput
              control={form.control}
              name="sanctioned_budget"
              label="Sanctioned Budget (₹)"
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
