//* package imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import { skipToken } from "@reduxjs/toolkit/query/react";

//* file imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextInput from "@/components/mini-components/text-input";

import type { ApiError } from "@/interfaces/api-error.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";
import type {
  ImplementationAgency,
  CreateImplementationAgencyRequest,
} from "@/interfaces/ia.interface";

import {
  createIAMasterSchema,
  type IAMasterFormValues,
} from "@/schemas/ia.schema";

import {
  useCreateImplementationAgencyMutation,
  useUpdateImplementationAgencyMutation,
} from "@/store/services/ia.api";
// import { useFetchBlocksQuery } from "@/store/services/location.api";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

//* helpers
const getDefaultValues = (): IAMasterFormValues => ({
  district_id: "",
  // block_id: "",
  agency_name: "",
});

const parsePayload = (
  values: IAMasterFormValues,
  districts: any[]
  // blocks: any[]
): CreateImplementationAgencyRequest => {
  const district = districts.find((d) => d._id === values.district_id);
  // const block = blocks.find((b: any) => b._id === values.block_id);

  return {
    district_id: values.district_id ?? "",
    // block_id: values.block_id ?? "",
    district_code: district?.district_code ?? "",
    district_name: district?.district_name ?? "",
    // block_code: block?.block_code ?? "",
    // block_name: block?.block_name ?? "",
    agency_name: values.agency_name ?? "",
  };
};

const ImplementationAgencyForm = ({
  initialData,
  onSuccess,
  districts,
  isLoading,
}: HeadFormProps<ImplementationAgency>) => {
  // const { user } = useCurrentUser();

  const form = useForm<IAMasterFormValues>({
    resolver: zodResolver(createIAMasterSchema),
    defaultValues: getDefaultValues(),
  });

  const [createIA] = useCreateImplementationAgencyMutation();
  const [updateIA] = useUpdateImplementationAgencyMutation();

  // const selectedDistrict = form.watch("district_id");

  // const stateCode = user?.state_code;
  // const districtCode =
  //   districts.find((d) => d._id === selectedDistrict)?.district_code ?? "";

  // const { data: blocksData, isLoading: blocksLoading } = useFetchBlocksQuery(
  //   stateCode && districtCode
  //     ? { state_code: stateCode, district_code: districtCode }
  //     : skipToken
  // );

  //? handler
  const onSubmit = async (values: IAMasterFormValues) => {
    // const payload = parsePayload(values, districts, blocksData?.records || []);
    const payload = parsePayload(values, districts);

    try {
      if (initialData?._id) {
        await updateIA({
          agency_id: initialData._id,
          payload,
        }).unwrap();
        toast.success("Implementation Agency updated successfully");
      } else {
        await createIA(payload).unwrap();
        toast.success("Implementation Agency created successfully");
      }

      onSuccess?.();
      form.reset(getDefaultValues());
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to submit Implementation Agency"
      );
    }
  };

  //* hydrate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id ?? "",
        // block_id: initialData.block_id ?? "",
        agency_name: initialData.agency_name ?? "",
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
          className="flex flex-col space-y-6 w-full"
        >
          <div className="flex items-center w-full gap-5">
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
                      form.setValue("district_id", value, {
                        shouldValidate: true,
                      })
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

            {/* Block Select */}
            {/* <FormField
              control={form.control}
              name="block_id"
              render={() => (
                <FormItem>
                  <FormLabel>Block</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("block_id", value, { shouldValidate: true })
                    }
                    value={form.watch("block_id")}
                    disabled={!selectedDistrict || blocksLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Block" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {blocksData?.records?.map((b: any) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.block_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Agency Name */}
            <TextInput
              control={form.control}
              name="agency_name"
              label="Agency Name"
              placeholder="Enter agency name"
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
