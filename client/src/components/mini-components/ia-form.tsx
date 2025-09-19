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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { HeadFormProps } from "@/interfaces/master-form.interface";
import {
  createIAMasterSchema,
  type IAMasterFormValues,
} from "@/schemas/ia.schema";

// Dummy IA type
export type ImplementationAgency = {
  _id?: string;
  financial_year: string;
  district_id: string;
  district_name?: string;
  block_id: string;
  block_name?: string;
  agency_name: string;
};

const ImplementationAgencyForm = ({
  districts,
  isLoading,
  initialData,
  onSuccess,
}: HeadFormProps<ImplementationAgency>) => {
  const form = useForm<IAMasterFormValues>({
    resolver: zodResolver(createIAMasterSchema),
    defaultValues: {
      financial_year: "",
      district_id: "",
      block_id: "",
      agency_name: "",
    },
  });

  const onSubmit = async (values: IAMasterFormValues) => {
    try {
      if (initialData?._id) {
        console.log("Update IA:", initialData._id, values);
        toast.success("Implementation Agency updated successfully");
      } else {
        console.log("Create IA:", values);
        toast.success("Implementation Agency created successfully");
      }
      onSuccess?.();
      form.reset();
    } catch {
      toast.error("Failed to submit Implementation Agency");
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        financial_year: initialData.financial_year ?? "",
        district_id: initialData.district_id ?? "",
        block_id: initialData.block_id ?? "",
        agency_name: initialData.agency_name ?? "",
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
          <div className="flex felx-1 w-full items-center gap-5">
            <FormField
              control={form.control}
              name="financial_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="2024-2025" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District Select */}
            <FormField
              control={form.control}
              name="district_id"
              render={() => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select
                    disabled={!!initialData}
                    onValueChange={(value) =>
                      form.setValue("district_id", value)
                    }
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
                      {districts.map((d) => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.district_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Block Select – dummy until API is added */}
            <FormField
              control={form.control}
              name="block_id"
              render={() => (
                <FormItem>
                  <FormLabel>Block</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue("block_id", value)}
                    value={form.watch("block_id")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Block" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="block1">Block 1</SelectItem>
                      <SelectItem value="block2">Block 2</SelectItem>
                      <SelectItem value="block3">Block 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agency_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter agency name"
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

export default ImplementationAgencyForm;
