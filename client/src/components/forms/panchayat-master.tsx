import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SearchableSelect from "@/components/mini-components/searchable-select";
import TextInput from "@/components/mini-components/text-input";

import type { HeadFormProps } from "@/interfaces/master-form.interface";
import type { IPanchayatValues } from "@/interfaces/panchayat.interface";
import {
  CreatePanchayatSchema,
  type PanchayatFormValues,
} from "@/schemas/panchayat.schema";
import type { ApiError } from "@/interfaces/api-error.interface";

import {
  useFetchBlocksQuery,
  useFetchDistrictsQuery,
} from "@/store/services/location.api";
import {
  useCreatePanchayatMutation,
  useUpdatePanchayatMutation,
} from "@/store/services/rural.api";

const getDefaultValues = (): PanchayatFormValues => ({
  district_id: "",
  district_code: "",
  district_name: "",
  block_id: "",
  block_code: "",
  block_name: "",
  panchayat_name: "",
});

const parsePayload = (values: PanchayatFormValues) => ({
  ...values,
  district_code: values.district_code ?? "",
  block_code: values.block_code ?? "",
  panchayat_name: values.panchayat_name?.trim() ?? "",
});

const PanchayatMasterForm = ({
  initialData,
  onSuccess,
}: HeadFormProps<IPanchayatValues>) => {
  const isEdit = !!initialData?._id;

  const form = useForm<PanchayatFormValues>({
    resolver: zodResolver(CreatePanchayatSchema),
    defaultValues: getDefaultValues(),
  });

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");

  //* Fetch lists
  const { data: districtData } = useFetchDistrictsQuery("03");

  // Dynamically fetch block list for selected district
  const { data: blockData } = useFetchBlocksQuery(
    selectedDistrictCode
      ? { state_code: "03", district_code: selectedDistrictCode }
      : { state_code: "03", district_code: "" }
  );

  const [createPanchayat] = useCreatePanchayatMutation();
  const [updatePanchayat] = useUpdatePanchayatMutation();

  //* Memoized options
  const districtOptions = useMemo(
    () =>
      districtData?.records?.map((d: any) => ({
        label: d.district_name,
        value: d._id,
        code: d.district_code,
      })) ?? [],
    [districtData]
  );

  const blockOptions = useMemo(
    () =>
      blockData?.records?.map((b: any) => ({
        label: b.block_name,
        value: b._id,
        code: b.block_code,
      })) ?? [],
    [blockData]
  );

  //* ✅ Handle submit
  const onSubmit = async (values: PanchayatFormValues) => {
    const payload = parsePayload(values);

    if (!payload.district_id || !payload.block_id || !payload.panchayat_name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        await updatePanchayat({
          panchayat_id: initialData?._id!,
          payload,
        }).unwrap();
        toast.success("Panchayat updated successfully");
      } else {
        await createPanchayat(payload).unwrap();
        toast.success("Panchayat created successfully");
      }

      onSuccess?.();
      form.reset(getDefaultValues());
      setSelectedDistrictCode("");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to save Panchayat"
      );
    }
  };

  //* 🧩 STEP 1: Hydrate district from initialData
  useEffect(() => {
    if (!initialData || !districtOptions.length) return;

    const foundDistrict = districtOptions.find(
      (d) => d.code === initialData.district_code
    );

    if (foundDistrict) {
      form.setValue("district_id", foundDistrict.value);
      form.setValue("district_code", foundDistrict.code);
      form.setValue("district_name", foundDistrict.label);
      setSelectedDistrictCode(foundDistrict.code);
    }
  }, [districtOptions, initialData]);

  //* 🧩 STEP 2: Once block list loads (based on selected district), hydrate block
  useEffect(() => {
    if (!initialData || !blockOptions.length) return;

    const foundBlock = blockOptions.find(
      (b: any) => b.code === initialData.block_code
    );

    if (foundBlock) {
      form.setValue("block_id", foundBlock.value);
      form.setValue("block_code", foundBlock.code);
      form.setValue("block_name", foundBlock.label);
    }

    // Panchayat name
    form.setValue("panchayat_name", initialData.panchayat_name || "");
  }, [blockOptions, initialData]);

  //* 🧩 Reset form in create mode
  useEffect(() => {
    if (!initialData) {
      form.reset(getDefaultValues());
      setSelectedDistrictCode("");
    }
  }, [initialData, form]);

  return (
    <div className="tab-content active w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 w-full"
        >
          <div className="flex items-start w-full gap-5">
            {/* 🏙️ District */}
            <FormField
              control={form.control}
              name="district_id"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>
                    District <span className="text-red-500">*</span>
                  </FormLabel>
                  <SearchableSelect
                    options={districtOptions}
                    value={form.watch("district_id")}
                    placeholder="Select District"
                    onSelect={(val) => {
                      if (isEdit) return;
                      const selected = districtOptions.find(
                        (d) => d.value === val
                      );
                      if (selected) {
                        form.setValue("district_id", selected.value);
                        form.setValue("district_code", selected.code || "");
                        form.setValue("district_name", selected.label);
                        form.setValue("block_id", "");
                        form.setValue("block_code", "");
                        form.setValue("block_name", "");
                        setSelectedDistrictCode(selected.code || "");
                      } else {
                        form.resetField("district_id");
                        form.resetField("district_code");
                        form.resetField("district_name");
                        setSelectedDistrictCode("");
                      }
                    }}
                    disabled={isEdit && !!initialData} // prevent district change in edit
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🧩 Block */}
            <FormField
              control={form.control}
              name="block_id"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>
                    Block <span className="text-red-500">*</span>
                  </FormLabel>
                  <SearchableSelect
                    options={blockOptions}
                    value={form.watch("block_id")}
                    placeholder={
                      selectedDistrictCode
                        ? "Select Block"
                        : "Select District first"
                    }
                    onSelect={(val) => {
                      if (isEdit) return;
                      const selected = blockOptions.find(
                        (b: any) => b.value === val
                      );
                      if (selected) {
                        form.setValue("block_id", selected.value);
                        form.setValue("block_code", selected.code || "");
                        form.setValue("block_name", selected.label);
                      } else {
                        form.resetField("block_id");
                        form.resetField("block_code");
                        form.resetField("block_name");
                      }
                    }}
                    disabled={
                      !selectedDistrictCode || (isEdit && !!initialData)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🏡 Panchayat Name */}
            <div className="w-full">
              <TextInput
                control={form.control}
                name="panchayat_name"
                label="Panchayat Name"
                placeholder="Enter Panchayat Name"
                inputClassStyling="w-full min-h-[44px]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PanchayatMasterForm;
