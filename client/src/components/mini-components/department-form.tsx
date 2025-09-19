//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";

//* file imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { HeadFormProps } from "@/interfaces/master-form.interface";
import {
  createDepartmentSchema,
  type DepartmentFormValues,
} from "@/schemas/department.schema";

// --- Department types ---
export type Department = {
  _id?: string;
  department_name: string;
  contact_person: string;
  contact_number: string;
  contact_email: string;
};

// // --- form values ---
// export type DepartmentFormValues = {
//   department_name: string;
//   contact_person: string;
//   contact_number: string;
//   contact_email: string;
// };

const DepartmentMasterForm = ({
  initialData,
  onSuccess,
}: HeadFormProps<Department>) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      department_name: "",
      contact_person: "",
      contact_number: "",
      contact_email: "",
    },
  });
  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      if (initialData?._id) {
        // update dummy
        console.log("Update Department:", initialData._id, values);
        toast.success("Department updated successfully");
      } else {
        // create dummy
        console.log("Create Department:", values);
        toast.success("Department created successfully");
      }

      onSuccess?.();
      form.reset();
    } catch {
      toast.error("Failed to submit department");
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        department_name: initialData.department_name ?? "",
        contact_person: initialData.contact_person ?? "",
        contact_number: initialData.contact_number ?? "",
        contact_email: initialData.contact_email ?? "",
      });
    }
  }, [initialData, form]);

  return (
    <div className="tab-content">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            form.handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col space-y-6 w-full"
        >
          <div className="flex flex-1 w-full items-center gap-5">
            <FormField
              control={form.control}
              name="department_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter department name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter contact person"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter contact number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter contact email"
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

export default DepartmentMasterForm;
