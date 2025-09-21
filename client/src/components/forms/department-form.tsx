//* package imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//* file imports
import type { ApiError } from "@/interfaces/api-error.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";
import type {
  Department,
  CreateDepartmentRequest,
} from "@/interfaces/department.interface";

import {
  createDepartmentSchema,
  type DepartmentFormValues,
} from "@/schemas/department.schema";

import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/store/services/department.api";

//* components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/mini-components/text-input";

//? helpers
const getDefaultValues = (): DepartmentFormValues => ({
  department_name: "",
  contact_person: "",
  contact_number: "",
  contact_email: "",
});

const parsePayload = (
  values: DepartmentFormValues
): CreateDepartmentRequest => {
  return {
    ...values,
    department_name: values.department_name ?? "",
    contact_person: values.contact_person ?? "",
    contact_number: values.contact_number ?? "",
    contact_email: values.contact_email ?? "",
  };
};

const DepartmentMasterForm = ({
  initialData,
  onSuccess,
}: HeadFormProps<Department>) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: getDefaultValues(),
  });

  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  //? handler
  const onSubmit = async (values: DepartmentFormValues) => {
    const payload = parsePayload(values);

    try {
      if (initialData?._id) {
        await updateDepartment({
          department_id: initialData._id,
          payload,
        }).unwrap();
        toast.success("Department updated successfully");
      } else {
        await createDepartment(payload).unwrap();
        toast.success("Department created successfully");
      }

      onSuccess?.();
      form.reset(getDefaultValues());
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to submit department"
      );
    } finally {
      form.reset(getDefaultValues());
    }
  };

  //* hydrate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        department_name: initialData.department_name ?? "",
        contact_person: initialData.contact_person ?? "",
        contact_number: initialData.contact_number ?? "",
        contact_email: initialData.contact_email ?? "",
      });
    } else {
      form.reset(getDefaultValues());
    }
  }, [initialData, form]);

  return (
    <div className="tab-content active">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Validation errors:", errors)
          )}
          className="flex flex-col items-center space-y-6 w-full"
        >
          <div className="flex items-center w-full gap-5">
            <TextInput
              control={form.control}
              name="department_name"
              label="Department Name"
              placeholder="Enter department name"
            />

            <TextInput
              control={form.control}
              name="contact_person"
              label="Contact Person"
              placeholder="Enter contact person"
            />

            <TextInput
              control={form.control}
              name="contact_number"
              label="Contact Number"
              placeholder="Enter contact number"
              inputMode="numeric"
            />

            <TextInput
              control={form.control}
              name="contact_email"
              label="Contact Email"
              placeholder="Enter contact email"
              type="email"
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

export default DepartmentMasterForm;
