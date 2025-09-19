//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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

import type { ApiError } from "@/interfaces/api-error.interface";
import type {
  BankHead,
  CreateBankHeadRequest,
} from "@/interfaces/bank-head.interface";
import type { HeadFormProps } from "@/interfaces/master-form.interface";

import {
  createBankMasterSchema,
  type BankMasterFormValues,
} from "@/schemas/bank.schema";

import {
  useCreateBankHeadMutation,
  useUpdateBankHeadMutation,
} from "@/store/services/bank-head.api";

import type { RootState } from "@/store/store";

const BankMasterForm = ({
  districts,
  isLoading,
  initialData,
  onSuccess,
}: HeadFormProps<BankHead>) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const role_name = user?.role_name || "";

  const [createBankHead] = useCreateBankHeadMutation();
  const [updateBankHead] = useUpdateBankHeadMutation();

  const defaultIAs = [
    {
      _id: "68d0c5a1f6c9f0c9a3c4b111",
      agency_name: "PWD - Public Works Department",
    },
    {
      _id: "68d0c5a1f6c9f0c9a3c4b112",
      agency_name: "Rural Development Department",
    },
    { _id: "68d0c5a1f6c9f0c9a3c4b113", agency_name: "Municipal Corporation" },
  ];

  const form = useForm<BankMasterFormValues>({
    resolver: zodResolver(createBankMasterSchema(role_name)),
    defaultValues: {
      district_id: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      branch_name: "",
      agency_code: "",
      agency_name: "",
    },
  });

  const onSubmit = async (values: BankMasterFormValues) => {
    const selectedDistrict = districts.find(
      (d) => d._id === values.district_id
    );

    const payload: CreateBankHeadRequest = {
      ...values,
      district_id: values.district_id ?? "",
      district_code: selectedDistrict?.district_code ?? "",
      district_name: selectedDistrict?.district_name ?? "",
      branch_code: "BR001",
    };

    try {
      if (initialData?._id) {
        await updateBankHead({
          bank_head_id: initialData._id,
          payload,
        }).unwrap();
        toast.success("Bank Head updated successfully");

        onSuccess?.();
        form.reset({
          district_id: "",
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          branch_name: "",
          agency_code: "",
          agency_name: "",
        });
      } else {
        await createBankHead(payload).unwrap();
        toast.success("Bank Head created successfully");

        onSuccess?.();
        form.reset({
          district_id: "",
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          branch_name: "",
          agency_code: "",
          agency_name: "",
        });
      }

      onSuccess?.();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError?.data?.error?.message) {
        toast.error(apiError.data.error.message);
      } else if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else {
        toast.error("Failed to submit bank head");
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        district_id: initialData.district_id ?? "",
        bank_name: initialData.bank_name ?? "",
        account_number: initialData.account_number ?? "",
        ifsc_code: initialData.ifsc_code ?? "",
        branch_name: initialData.branch_name ?? "",
        agency_code: initialData.agency_code ?? "",
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
          <div className="flex flex-1 items-center w-full gap-5 ">
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
              name="ifsc_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("ifsc_code", value);
                    }}
                    value={form.watch("ifsc_code")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select IFSC Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="SBIN0001234">
                        SBIN0001234 - State Bank of India
                      </SelectItem>
                      <SelectItem value="HDFC0005678">
                        HDFC0005678 - HDFC Bank
                      </SelectItem>
                      <SelectItem value="ICIC0004321">
                        ICIC0004321 - ICICI Bank
                      </SelectItem>
                      <SelectItem value="PNB0008765">
                        PNB0008765 - Punjab National Bank
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter branch name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter account number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter bank name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {role_name === "District" && (
            <FormField
              control={form.control}
              name="agency_code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Implementation Agency</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => {
                      const selected = defaultIAs.find((ia) => ia._id === val);

                      form.setValue("agency_code", selected?._id || "", {
                        shouldDirty: true,
                      });
                      form.setValue(
                        "agency_name",
                        selected?.agency_name || "",
                        {
                          shouldDirty: true,
                        }
                      );
                    }}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Select Agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultIAs.map((ia) => (
                        <SelectItem key={ia._id} value={ia._id}>
                          {ia.agency_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
