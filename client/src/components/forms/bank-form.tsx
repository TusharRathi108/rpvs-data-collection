//* package imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//* file imports
import type {
  BankHead,
  CreateBankHeadRequest,
} from "@/interfaces/bank-head.interface";
import type { ApiError } from "@/interfaces/api-error.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";

import {
  createBankMasterSchema,
  type BankMasterFormValues,
} from "@/schemas/bank.schema";

import {
  useCreateBankHeadMutation,
  useUpdateBankHeadMutation,
} from "@/store/services/bank-head.api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetIfscCodeByIdQuery } from "@/store/services/monetary.api";

//* components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import NumberInput from "@/components/mini-components/number-input";
import SelectField from "@/components/mini-components/select-field";
import TextInput from "@/components/mini-components/text-input";
import { useGetImplementationAgenciesDistrictWiseQuery } from "@/store/services/ia.api";

//? helpers
const getDefaultValues = (): BankMasterFormValues => ({
  district_id: "",
  agency_id: "",
  agency_name: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  branch_code: "",
  branch_name: "",
  branch_manager_name: "",
  rbo: "",
  contact_number: "",
  remarks: "",
});

const parsePayload = (
  values: BankMasterFormValues,
  districts: { _id: string; district_code: string; district_name: string }[]
): CreateBankHeadRequest => {
  const selectedDistrict = districts.find(
    (district) => district._id === values.district_id
  );

  return {
    ...values,
    district_id: values.district_id ?? "",
    district_code: selectedDistrict?.district_code ?? "",
    district_name: selectedDistrict?.district_name ?? "",
    rbo: values.rbo ?? "",
    branch_name: values.branch_name ?? "",
    branch_code: values.branch_code ?? "BR001",
    contact_number: values.contact_number ?? "",
    branch_manager_name: values.branch_manager_name ?? "",
  };
};

const BankMasterForm = ({
  districts,
  isLoading,
  initialData,
  onSuccess,
}: HeadFormProps<BankHead>) => {
  const { user, role_name } = useCurrentUser();
  const userDistrictId = user?.district?._id;

  // console.log("DISTRICT INFO: ", userDistrictId);

  const form = useForm<BankMasterFormValues>({
    resolver: zodResolver(createBankMasterSchema(role_name)),
    defaultValues: {
      ...getDefaultValues(),
      district_id: initialData?.district_id || userDistrictId || "",
    },
  });

  const selectedDistrictId =
    form.watch("district_id") || initialData?.district_id || userDistrictId;

  const { data: iaData, isLoading: iaLoading } =
    useGetImplementationAgenciesDistrictWiseQuery(
      selectedDistrictId ? selectedDistrictId : skipToken
    );

  const { data: ifscData } = useGetIfscCodeByIdQuery(
    selectedDistrictId ? selectedDistrictId : skipToken
  );

  // console.log("IFSC CODE: ", ifscData);
  // console.log("INITIAL DATA: ", initialData);

  const [createBankHead] = useCreateBankHeadMutation();
  const [updateBankHead] = useUpdateBankHeadMutation();

  //? handler
  const onSubmit = async (values: BankMasterFormValues) => {
    const payload = parsePayload(values, districts);

    // console.log("PAYLOAD: ", payload);
    // console.log("INITIAL ID: ", initialData);
    // return;

    try {
      if (initialData?._id) {
        await updateBankHead({
          bank_head_id: initialData._id,
          payload,
        }).unwrap();
        toast.success("Bank Head updated successfully");
      } else {
        await createBankHead(payload).unwrap();
        toast.success("Bank Head created successfully");
      }

      onSuccess?.();
      form.reset(getDefaultValues());
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.error?.message ||
          apiError?.data?.message ||
          "Failed to submit bank head"
      );
    } finally {
      form.reset(getDefaultValues());
    }
  };

  //* hydrate form when editing
  useEffect(() => {
    if (initialData?.ifsc_code && ifscData?.records) {
      const match = ifscData.records.find(
        (r) => r.ifsc_code === initialData.ifsc_code
      );
      if (match) {
        form.setValue("ifsc_code", match.ifsc_code, { shouldValidate: true });
      }
    }
  }, [ifscData?.records, initialData?.ifsc_code, form]);

  useEffect(() => {
    if (iaData?.records?.length) {
      if (initialData?.agency_id) {
        const match = iaData.records.find(
          (ia) => ia._id === initialData.agency_id
        );
        if (match) {
          form.setValue("agency_id", match._id);
          form.setValue("agency_name", match.agency_name);
        }
      } else if (initialData?.agency_name) {
        const match = iaData.records.find(
          (ia) => ia.agency_name === initialData.agency_name
        );
        if (match) {
          form.setValue("agency_id", match._id);
          form.setValue("agency_name", match.agency_name);
        }
      }
    }
  }, [iaData?.records, initialData, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id ?? userDistrictId ?? "",
        agency_id: initialData.agency_id ?? "",
        agency_name: initialData.agency_name ?? "",
        bank_name: initialData.bank_name ?? "",
        account_number: initialData.account_number ?? "",
        ifsc_code: initialData.ifsc_code ?? "",
        branch_code: initialData.branch_code ?? "",
        branch_name: initialData.branch_name ?? "",
        branch_manager_name: initialData.branch_manager_name ?? "",
        rbo: initialData.rbo ?? "",
        contact_number: initialData.contact_number
          ? initialData.contact_number.toString().padStart(10, "0")
          : "",
        remarks: initialData.remarks ?? "",
      });
    } else if (userDistrictId) {
      form.reset({
        ...getDefaultValues(),
        district_id: userDistrictId ?? "",
      });
    }
  }, [initialData, userDistrictId, form]);

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
            {/* District */}
            <SelectField
              control={form.control}
              name="district_id"
              label="District"
              options={districts.map((district) => ({
                value: district._id,
                label: district.district_name,
                ...district,
              }))}
              disabled={!!initialData || !!userDistrictId}
              isLoading={isLoading}
              placeholder="Select District"
              fallbackLabel={
                initialData?.district_name || user?.district?.district_name
              }
              onSelect={(selected) => {
                form.setValue("district_id", selected._id, {
                  shouldValidate: true,
                });
              }}
            />

            {/* IFSC Code */}
            <SelectField
              control={form.control}
              name="ifsc_code"
              label="IFSC Code"
              options={
                ifscData
                  ? ifscData.records.map((item) => ({
                      value: item.ifsc_code,
                      label: `${item.ifsc_code} - ${item.branch_name}`,
                      ...item,
                    }))
                  : []
              }
              placeholder="Select IFSC Code"
              onSelect={(selected) => {
                const record = ifscData?.records.find(
                  (r) => r.ifsc_code === selected.value
                );

                if (record) {
                  form.setValue("ifsc_code", record.ifsc_code, {
                    shouldDirty: true,
                  });
                  form.setValue("branch_code", record.branch_code ?? "", {
                    shouldDirty: true,
                  });
                  form.setValue("branch_name", record.branch_name ?? "", {
                    shouldDirty: true,
                  });
                  form.setValue(
                    "bank_name",
                    record.bank_name ?? "State Bank of India",
                    {
                      shouldDirty: true,
                    }
                  );
                  form.setValue(
                    "branch_manager_name",
                    record.branch_manager_name ?? "",
                    { shouldDirty: true }
                  );
                  form.setValue(
                    "contact_number",
                    record.contact_number.toString() ?? "",
                    {
                      shouldDirty: true,
                    }
                  );
                  form.setValue("rbo", record.rbo ?? "", {
                    shouldDirty: true,
                  });
                  form.setValue("remarks", record.remarks ?? "", {
                    shouldDirty: true,
                  });
                }
              }}
            />

            {/* Branch Name */}
            <TextInput
              control={form.control}
              name="branch_name"
              label="Branch Name"
              disabled={true}
              placeholder="Enter branch name"
            />

            {/* Account Number */}
            <NumberInput
              control={form.control}
              name="account_number"
              label="Account Number"
            />

            {/* Bank Name */}
            <TextInput
              control={form.control}
              name="bank_name"
              label="Bank Name"
              disabled={true}
              placeholder="Enter bank name"
            />
          </div>

          {/* Implementation Agency (for District role only) */}
          {role_name === "District" && (
            <SelectField
              control={form.control}
              name="agency_id"
              label="Implementation Agency"
              options={
                iaData?.records?.map((ia) => ({
                  value: ia._id,
                  label: ia.agency_name,
                  ...ia,
                })) || []
              }
              isLoading={iaLoading}
              placeholder="Select Agency"
              classStyleFieldControl="w-2/6"
              fallbackLabel={initialData?.agency_name}
              onSelect={(selected) => {
                form.setValue("agency_id", selected._id);
                form.setValue("agency_name", selected.agency_name);
              }}
            />
          )}

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

export default BankMasterForm;
