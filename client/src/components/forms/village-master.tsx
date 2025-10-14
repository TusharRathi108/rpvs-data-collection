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
import type { IVillageValues } from "@/interfaces/village.interface";
import {
  CreateVillageSchema,
  type VillageFormValues,
} from "@/schemas/village.schema";
import type { ApiError } from "@/interfaces/api-error.interface";

import {
  useFetchBlocksQuery,
  useFetchDistrictsQuery,
  useFetchPanchayatsQuery,
} from "@/store/services/location.api";
import {
  useCreateVillageMutation,
  useUpdateVillageMutation,
} from "@/store/services/rural.api";

const getDefaultValues = (): VillageFormValues => ({
  district_id: "",
  district_code: "",
  district_name: "",
  block_id: "",
  block_code: "",
  block_name: "",
  panchayat_id: "",
  panchayat_code: "",
  panchayat_name: "",
  village_name: "",
  hadbast_number: "",
});

const parsePayload = (values: VillageFormValues) => ({
  ...values,
  district_code: values.district_code ?? "",
  block_code: values.block_code ?? "",
  panchayat_code: values.panchayat_code ?? "",
  village_name: values.village_name?.trim() ?? "",
  hadbast_number: values.hadbast_number?.trim() ?? "",
});

const VillageMasterForm = ({
  initialData,
  onSuccess,
}: HeadFormProps<IVillageValues>) => {
  const isEdit = !!initialData?._id;

  const form = useForm<VillageFormValues>({
    resolver: zodResolver(CreateVillageSchema),
    defaultValues: getDefaultValues(),
  });

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [selectedBlockCode, setSelectedBlockCode] = useState<string>("");

  //* Fetch lists
  const { data: districtData } = useFetchDistrictsQuery("03");

  const { data: blockData } = useFetchBlocksQuery(
    selectedDistrictCode
      ? { state_code: "03", district_code: selectedDistrictCode }
      : { state_code: "03", district_code: "" }
  );

  const { data: panchayatData } = useFetchPanchayatsQuery(
    selectedBlockCode
      ? {
          district_code: selectedDistrictCode,
          block_code: selectedBlockCode,
        }
      : { district_code: "", block_code: "" }
  );

  const [createVillage] = useCreateVillageMutation();
  const [updateVillage] = useUpdateVillageMutation();

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

  const panchayatOptions = useMemo(
    () =>
      panchayatData?.records?.map((p: any) => ({
        label: p.panchayat_name,
        value: p._id,
        code: p.panchayat_code,
      })) ?? [],
    [panchayatData]
  );

  //* Submit handler
  const onSubmit = async (values: VillageFormValues) => {
    const payload = parsePayload(values);

    if (
      !payload.district_id ||
      !payload.block_id ||
      !payload.panchayat_id ||
      !payload.village_name
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        await updateVillage({
          village_id: initialData?._id!,
          payload,
        }).unwrap();
        toast.success("Village updated successfully");
      } else {
        await createVillage(payload).unwrap();
        toast.success("Village created successfully");
      }

      onSuccess?.();
      form.reset(getDefaultValues());
      setSelectedDistrictCode("");
      setSelectedBlockCode("");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to save Village"
      );
    }
  };

  //* 🧩 Hydrate District
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

  //* 🧩 Hydrate Block
  useEffect(() => {
    if (!initialData || !blockOptions.length) return;

    const foundBlock = blockOptions.find(
      (b: any) => b.code === initialData.block_code
    );
    if (foundBlock) {
      form.setValue("block_id", foundBlock.value);
      form.setValue("block_code", foundBlock.code);
      form.setValue("block_name", foundBlock.label);
      setSelectedBlockCode(foundBlock.code);
    }
  }, [blockOptions, initialData]);

  //* 🧩 Hydrate Panchayat
  useEffect(() => {
    if (!initialData || !panchayatOptions.length) return;

    const foundPanchayat = panchayatOptions.find(
      (p: any) => p.code === initialData.panchayat_code
    );
    if (foundPanchayat) {
      form.setValue("panchayat_id", foundPanchayat.value);
      form.setValue("panchayat_code", foundPanchayat.code);
      form.setValue("panchayat_name", foundPanchayat.label);
    }

    form.setValue("village_name", initialData.village_name || "");
    form.setValue("hadbast_number", initialData.hadbast_number || "");
  }, [panchayatOptions, initialData]);

  //* Reset form when creating new
  useEffect(() => {
    if (!initialData) {
      form.reset(getDefaultValues());
      setSelectedDistrictCode("");
      setSelectedBlockCode("");
    }
  }, [initialData, form]);

  return (
    <div className="tab-content active w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 w-full"
        >
          <div className="flex items-start w-full gap-5 flex-wrap">
            {/* 🏙️ District */}
            <FormField
              control={form.control}
              name="district_id"
              render={() => (
                <FormItem className="w-full md:w-1/3">
                  <FormLabel>
                    District <span className="text-red-500">*</span>
                  </FormLabel>
                  <SearchableSelect
                    options={districtOptions}
                    value={form.watch("district_id")}
                    placeholder="Select District"
                    onSelect={(val) => {
                      if (isEdit) return; // disable change while editing
                      const selected = districtOptions.find(
                        (d) => d.value === val
                      );
                      if (selected) {
                        form.setValue("district_id", selected.value);
                        form.setValue("district_code", selected.code || "");
                        form.setValue("district_name", selected.label);
                        form.resetField("block_id");
                        form.resetField("panchayat_id");
                        setSelectedDistrictCode(selected.code || "");
                        setSelectedBlockCode("");
                      }
                    }}
                    disabled={isEdit} // ✅ disabled in edit mode
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
                <FormItem className="w-full md:w-1/3">
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
                      if (isEdit) return; // disable change while editing
                      const selected = blockOptions.find(
                        (b: any) => b.value === val
                      );
                      if (selected) {
                        form.setValue("block_id", selected.value);
                        form.setValue("block_code", selected.code || "");
                        form.setValue("block_name", selected.label);
                        form.resetField("panchayat_id");
                        setSelectedBlockCode(selected.code || "");
                      }
                    }}
                    disabled={!selectedDistrictCode || isEdit} // ✅ disabled in edit mode
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🏡 Panchayat */}
            <FormField
              control={form.control}
              name="panchayat_id"
              render={() => (
                <FormItem className="w-full md:w-1/3">
                  <FormLabel>
                    Panchayat <span className="text-red-500">*</span>
                  </FormLabel>
                  <SearchableSelect
                    options={panchayatOptions}
                    value={form.watch("panchayat_id")}
                    placeholder={
                      selectedBlockCode
                        ? "Select Panchayat"
                        : "Select Block first"
                    }
                    onSelect={(val) => {
                      if (isEdit) return; // disable change while editing
                      const selected = panchayatOptions.find(
                        (p: any) => p.value === val
                      );
                      if (selected) {
                        form.setValue("panchayat_id", selected.value);
                        form.setValue("panchayat_code", selected.code || "");
                        form.setValue("panchayat_name", selected.label);
                      }
                    }}
                    disabled={!selectedBlockCode || isEdit} // ✅ disabled in edit mode
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🏘️ Village Name */}
            <div className="w-full md:w-1/2">
              <TextInput
                control={form.control}
                name="village_name"
                label="Village Name"
                placeholder="Enter Village Name"
                inputClassStyling="w-full min-h-[44px]"
              />
            </div>

            {/* 🔢 Hadbast Number */}
            <div className="w-full md:w-1/2">
              <TextInput
                control={form.control}
                name="hadbast_number"
                label="Hadbast Number"
                placeholder="Enter Hadbast Number"
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

export default VillageMasterForm;
