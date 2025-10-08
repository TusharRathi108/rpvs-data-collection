//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

//* ui components
// import SelectField from "@/components/mini-components/select-field";
import TextInput from "@/components/mini-components/text-input";
import NumberInput from "@/components/mini-components/number-input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectWithBadges } from "@/components/mini-components/multi-select";
import { SingleSelectWithNumbering } from "@/components/mini-components/single-select";

//* schemas & types
import { ProposalRecommenderType } from "@/interfaces/enums.interface";
import {
  ProposalFormSchema,
  type ProposalFormValues,
} from "@/schemas/proposal.schema";

//* api services
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetAllDepartmentsQuery } from "@/store/services/department.api";
import { useGetImplementationAgenciesDistrictWiseQuery } from "@/store/services/ia.api";
import {
  useFetchBlocksQuery,
  useFetchConstituenciesQuery,
  useFetchLocalBodiesQuery,
  useFetchLocalBodyTypesQuery,
  useFetchLocalBodyWardsQuery,
  useFetchPanchayatsQuery,
  useFetchVillagesQuery,
} from "@/store/services/location.api";
import { useFetchMlasQuery } from "@/store/services/mla.api";
import {
  useCreateProposalMutation,
  useUpdateProposalMutation,
} from "@/store/services/proposal.api";
import {
  useGetAllSectorsQuery,
  useGetSubSectorWorksQuery,
} from "@/store/services/sector.api";
import { useEffect } from "react";
import { useGetIfscCodeByIdQuery } from "@/store/services/monetary.api";

const EMPTY_FORM_VALUES: ProposalFormValues & { _id?: string } = {
  sector_id: "",
  department_id: "",
  department_name: "",
  sector_name: "",
  sub_sector: "",

  recommender_name: "",
  recommender_contact: 0,
  recommender_email: "",
  recommender_type: "MLA",
  recommender_designation: "",

  area_type: "RU",
  old_work: false,
  proposal_name: "",

  proposal_amount: 0,
  sanctioned_funds: 0,
  transferred_funds: 0,

  ifsc_code: "",
  branch_code: "",
  branch_name: "",
  bank_name: "",
  bank_account_number: "",

  reference_number: "",
  manual_reference_number: "",

  permissible_work: [],

  approved_by_dlc: false,
  approved_by_nm: false,

  assigned_ia: "",
  assigned_ia_name: "",

  location: {
    state_id: "",
    state_code: "",
    state_name: "",
    area_type: "RU",
    district_id: "",
    district_code: "",
    district_name: "",
    block_code: "",
    constituency_code: "",
    panchayat_code: "",
    village_id: [],
    local_body_type_code: "",
    local_body_code: "",
    ward_id: [],
    villages: [],
    wards: [],
  },
};

type ProposalFormProps = {
  initialData?: Partial<ProposalFormValues> | null;
  onSuccess?: () => void;
};

const ProposalForm = ({ initialData, onSuccess }: ProposalFormProps) => {
  const { user } = useCurrentUser();
  const isEdit = !!initialData?._id;
  const stateCode = user?.state_code;
  const districtCode = user?.district_code;
  const selectedDistrictId = user?.district?._id;

  // console.log("INITIAL DATA: ", initialData);

  const [createProposal, { isLoading: isCreating }] =
    useCreateProposalMutation();

  const [updateProposal, { isLoading: isUpdating }] =
    useUpdateProposalMutation();

  const {
    data: iaData,
    isLoading: iaLoading,
    refetch: refetchIAs,
  } = useGetImplementationAgenciesDistrictWiseQuery(
    selectedDistrictId ?? skipToken
  );

  // console.log(iaData);

  const implementationAgencies = iaData?.records || [];

  const { data: deptData, isLoading: deptLoading } =
    useGetAllDepartmentsQuery();

  const departments = deptData?.records || [];

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(ProposalFormSchema),
    defaultValues: {
      ...EMPTY_FORM_VALUES,
      ...initialData,
      approved_by:
        initialData?.approved_by_dlc && initialData?.approved_by_nm
          ? "BOTH"
          : initialData?.approved_by_dlc
          ? "DLC"
          : initialData?.approved_by_nm
          ? "NODAL_MINISTER"
          : undefined,
      bank_account_number: initialData?.bank_account_number
        ? String(initialData.bank_account_number)
        : "",
      location: {
        ...EMPTY_FORM_VALUES.location,
        ...initialData?.location,
        district_code: districtCode ? String(districtCode) : "",
        district_name: user?.district_name || "",
      },
    },
  });

  const recommenderType = form.watch("recommender_type");
  const areaType = form.watch("area_type");
  const blockCode = form.watch("location.block_code");
  const panchayatCode = form.watch("location.panchayat_code");
  const localBodyTypeCode = form.watch("location.local_body_type_code");
  const localBodyCode = form.watch("location.local_body_code");
  const selectedSectorId = form.watch("sector_id");
  const selectedSubSector = form.watch("sub_sector");

  const { data: constituenciesData } = useFetchConstituenciesQuery(
    stateCode && districtCode
      ? { state_code: stateCode, district_code: districtCode }
      : skipToken
  );

  const { data: blocksData } = useFetchBlocksQuery(
    stateCode && districtCode
      ? { state_code: stateCode, district_code: districtCode }
      : skipToken
  );

  const { data: panchayatsData } = useFetchPanchayatsQuery(
    blockCode && districtCode
      ? { district_code: districtCode, block_code: blockCode }
      : skipToken
  );

  const { data: villagesData } = useFetchVillagesQuery(
    panchayatCode && blockCode && districtCode
      ? {
          district_code: districtCode,
          block_code: blockCode,
          panchayat_code: panchayatCode,
        }
      : skipToken
  );

  const { data: localBodyTypeData } = useFetchLocalBodyTypesQuery();

  const { data: localBodiesData } = useFetchLocalBodiesQuery(
    localBodyTypeCode && districtCode
      ? { district_code: districtCode, local_body_type_code: localBodyTypeCode }
      : skipToken
  );

  const { data: wardsData } = useFetchLocalBodyWardsQuery(
    localBodyTypeCode && localBodyCode && districtCode
      ? {
          district_code: districtCode,
          local_body_type_code: localBodyTypeCode,
          local_body_code: localBodyCode,
        }
      : skipToken
  );

  const { data: mlasData, isLoading: mlasLoading } = useFetchMlasQuery();

  const { data: sectorsData } = useGetAllSectorsQuery();

  const { data: sectorDetails } = useGetSubSectorWorksQuery(
    selectedSectorId
      ? { sector: selectedSectorId, subSector: selectedSubSector || undefined }
      : skipToken
  );

  const { data: ifscData } = useGetIfscCodeByIdQuery(
    selectedDistrictId ? selectedDistrictId : skipToken
  );

  const rawSubSectors = sectorDetails?.records?.[0]?.sub_sectors;

  const subSectors = Array.isArray(rawSubSectors)
    ? rawSubSectors
    : rawSubSectors
    ? [rawSubSectors]
    : [];

  const rawWorks = sectorDetails?.records?.[0]?.works;

  const permissibleWorksOptions = Array.isArray(rawWorks)
    ? rawWorks.map((w: string) => ({ value: w, label: w }))
    : rawWorks
    ? [{ value: rawWorks, label: rawWorks }]
    : [];

  const onSubmit = async (values: ProposalFormValues) => {
    try {
      // console.log(values);
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix the form errors before submitting");
        return;
      }

      const normalizeObjectId = (val: any) => (val && val !== "" ? val : null);

      const payload = {
        ...values,
        recommender_contact: Number(values.recommender_contact),
        actionType: isEdit ? "EDITED" : "CREATED",
        assigned_ia: normalizeObjectId(values.assigned_ia),
        location: {
          ...values.location,
          state_id: "68c289dfcc5da75edf90bf6e",
          state_code: stateCode,
          state_name: "Punjab",
          district_id: selectedDistrictId || "",
          district_code: districtCode || "",
          district_name: user?.district_name || "",
          constituency_id: values.location.constituency_id,
          ...(values.area_type === "RU"
            ? {
                // keep rural fields
                block_id: values.location.block_id,
                block_code: values.location.block_code,
                block_name: values.location.block_name,
                panchayat_id: values.location.panchayat_id,
                panchayat_code: values.location.panchayat_code,
                panchayat_name: values.location.panchayat_name,
                village_id: values.location.village_id ?? [],
                villages: values.location.villages ?? [],

                // reset urban fields
                local_body_id: "",
                local_body_code: "",
                local_body_name: "",
                local_body_type_code: "",
                local_body_type_name: "",
                ward_id: [],
                wards: [],
              }
            : {
                // keep urban fields
                local_body_type_id: values.location.local_body_type_id,
                local_body_id: values.location.local_body_id,
                local_body_code: values.location.local_body_code,
                local_body_name: values.location.local_body_name,
                local_body_type_code: values.location.local_body_type_code,
                local_body_type_name: values.location.local_body_type_name,
                ward_id: values.location.ward_id ?? [],
                wards: values.location.wards ?? [],

                // reset rural fields
                block_id: "",
                block_code: "",
                block_name: "",
                panchayat_id: "",
                panchayat_code: "",
                panchayat_name: "",
                village_id: [],
                villages: [],
              }),
        },
      };

      // console.log("PAYLOAD ENTRY: ", payload);
      // return;

      const { _id, ...payloadWithoutId } = payload;

      if (isEdit) {
        const proposalId = initialData?._id || values._id;
        await updateProposal({
          proposal_id: proposalId || "",
          data: payloadWithoutId,
        }).unwrap();
        toast.success("✅ Proposal updated successfully");
      } else {
        await createProposal(payloadWithoutId).unwrap();
        toast.success("✅ Proposal created successfully");
      }

      form.reset();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save proposal");
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
    if (selectedDistrictId) {
      refetchIAs();
    }
  }, [selectedDistrictId, refetchIAs]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // console.log("Form submit event triggered");
          form.trigger().then((isValid) => {
            // console.log("Form is valid:", isValid);
            if (!isValid) {
              // console.error("Validation failed:", form.formState.errors);
              toast.error("Please fix form errors before submitting");
            } else {
              form.handleSubmit(onSubmit, (errors) => {
                console.error("Form submission errors:", errors);
              })(e);
            }
          });
        }}
        className="relative flex flex-col gap-6"
      >
        <span className="absolute -top-18 left-[240px] text-red-500 text-2xl">
          ( * fields are mandatory! )
        </span>

        {/* Area Type Selection */}
        <div className="flex flex-col rounded-2xl gap-5">
          <FormField
            control={form.control}
            name="area_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Area Type<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(val) =>
                      form.setValue("area_type", val as "RU" | "UR", {
                        shouldDirty: true,
                      })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="RU" id="rural" />
                      <FormLabel htmlFor="rural">Rural</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="UR" id="urban" />
                      <FormLabel htmlFor="urban">Urban</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Recommender Type and Details */}
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="recommender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Recommended By <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) =>
                        form.setValue(
                          "recommender_type",
                          val as ProposalRecommenderType,
                          { shouldDirty: true }
                        )
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MLA" id="mla" />
                        <FormLabel htmlFor="mla">MLA</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTHER" id="other" />
                        <FormLabel htmlFor="other">Other</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {recommenderType === "MLA" && (
              <FormField
                control={form.control}
                name="recommender_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      MLA<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) =>
                        form.setValue("recommender_name", val, {
                          shouldDirty: true,
                        })
                      }
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select MLA" />
                      </SelectTrigger>
                      <SelectContent>
                        {mlasLoading ? (
                          <SelectItem value="__loading" disabled>
                            Loading MLAs...
                          </SelectItem>
                        ) : (
                          mlasData?.records?.map((mla: any) => (
                            <SelectItem key={mla._id} value={mla.mla_name}>
                              {mla.mla_name} — {mla.constituency_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )} */}

            {recommenderType === "MLA" && (
              <FormField
                control={form.control}
                name="recommender_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      MLA <span className="text-red-500">*</span>
                    </FormLabel>

                    <SingleSelectWithNumbering
                      options={
                        mlasData?.records?.map((mla: any) => ({
                          label: `${mla.mla_name} — ${mla.constituency_name}`,
                          value: mla.mla_name,
                        })) || []
                      }
                      value={field.value || null}
                      onChange={(val) => {
                        const selectedMla = mlasData?.records?.find(
                          (mla: any) => mla.mla_name === val
                        );

                        // ✅ update MLA name
                        form.setValue("recommender_name", val || "", {
                          shouldDirty: true,
                        });

                        if (selectedMla) {
                          // ✅ find constituency info based on code
                          const matchedConstituency =
                            constituenciesData?.records?.find(
                              (c: any) =>
                                c.constituency_code ===
                                selectedMla.constituency_code
                            );

                          if (matchedConstituency) {
                            form.setValue(
                              "location.constituency_id",
                              matchedConstituency._id || "",
                              { shouldDirty: true }
                            );
                            form.setValue(
                              "location.constituency_code",
                              matchedConstituency.constituency_code || "",
                              { shouldDirty: true }
                            );
                            form.setValue(
                              "location.constituency_name",
                              matchedConstituency.constituency_name || "",
                              { shouldDirty: true }
                            );
                          }
                        }
                      }}
                      placeholder={
                        mlasLoading ? "Loading MLAs..." : "Select MLA"
                      }
                      disabled={mlasLoading}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {recommenderType === "OTHER" && (
              <>
                <FormField
                  control={form.control}
                  name="recommender_designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Other Recommender{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter type (e.g. NGO, Citizen)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recommender_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Recommender Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter recommender name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Basic Details */}
        <div className="flex items-center gap-5 w-full">
          <FormField
            control={form.control}
            name="manual_reference_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter ref no." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommender_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) {
                        field.onChange(val ? Number(val) : undefined);
                      }
                    }}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommender_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommender Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposal_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Proposed Amount (₹) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val ? Number(val) : 0);
                    }}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sanctioned_funds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approved Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val ? Number(val) : 0);
                    }}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="bank_account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter bank account number"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val ? Number(val) : 0);
                    }}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        {/* Bank Details */}
        <div className="flex items-center gap-5 w-full">
          {/* IFSC Code */}
          <FormField
            control={form.control}
            name="ifsc_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  IFSC Code <span className="text-red-500">*</span>
                </FormLabel>

                <SingleSelectWithNumbering
                  options={
                    ifscData
                      ? ifscData.records.map((item: any) => ({
                          value: item.ifsc_code,
                          label: `${item.ifsc_code} — ${item.branch_name}`,
                          ...item,
                        }))
                      : []
                  }
                  value={field.value || null}
                  onChange={(val) => {
                    const record = ifscData?.records.find(
                      (r: any) => r.ifsc_code === val
                    );

                    if (record) {
                      // ✅ Primary field
                      form.setValue("ifsc_code", record.ifsc_code, {
                        shouldDirty: true,
                      });

                      // ✅ Related fields
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

                      // Optional fields (uncomment if needed)
                      // form.setValue("branch_manager_name", record.branch_manager_name ?? "", { shouldDirty: true });
                      // form.setValue("contact_number", record.contact_number?.toString() ?? "", { shouldDirty: true });
                      // form.setValue("rbo", record.rbo ?? "", { shouldDirty: true });
                      // form.setValue("remarks", record.remarks ?? "", { shouldDirty: true });
                    }
                  }}
                  placeholder={
                    ifscData ? "Select IFSC Code" : "Loading IFSC Codes..."
                  }
                  disabled={!ifscData}
                />

                <FormMessage />
              </FormItem>
            )}
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
            name="bank_account_number"
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

          <FormField
            control={form.control}
            name="transferred_funds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transferred Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val ? Number(val) : 0);
                    }}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="proposal_name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                Proposal Name<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter proposal name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Fields */}
        <div className="flex items-center gap-5 w-full">
          {/* <FormField
            control={form.control}
            name="location.constituency_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Constituenc<span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  // Constituency
                  onValueChange={(val) => {
                    const selected = constituenciesData?.records.find(
                      (c: any) => c.constituency_code === val
                    );
                    form.setValue(
                      "location.constituency_id",
                      selected?._id || ""
                    );
                    form.setValue(
                      "location.constituency_code",
                      selected?.constituency_code || ""
                    );
                    form.setValue(
                      "location.constituency_name",
                      selected?.constituency_name || ""
                    );
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {constituenciesData?.records?.map((c: any) => (
                      <SelectItem
                        key={c.constituency_code}
                        value={c.constituency_code}
                      >
                        {c.constituency_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="location.constituency_code"
            render={() => (
              <FormItem>
                <FormLabel>
                  Constituency<span className="text-red-500">*</span>
                </FormLabel>
                <SingleSelectWithNumbering
                  options={
                    constituenciesData?.records?.map((c: any) => ({
                      label: c.constituency_name,
                      value: c.constituency_code,
                    })) || []
                  }
                  value={form.watch("location.constituency_code") || null}
                  onChange={(val) => {
                    const selected = constituenciesData?.records.find(
                      (c: any) => c.constituency_code === val
                    );
                    if (selected) {
                      form.setValue(
                        "location.constituency_id",
                        selected._id || "",
                        { shouldDirty: true }
                      );
                      form.setValue(
                        "location.constituency_code",
                        selected.constituency_code || "",
                        { shouldDirty: true }
                      );
                      form.setValue(
                        "location.constituency_name",
                        selected.constituency_name || "",
                        { shouldDirty: true }
                      );
                    }
                  }}
                  placeholder="Select Constituency"
                  disabled={recommenderType === "MLA"}
                />
              </FormItem>
            )}
          />

          {areaType === "RU" && (
            <>
              {/* 🌾 BLOCK */}
              <FormField
                control={form.control}
                name="location.block_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Block<span className="text-red-500">*</span>
                    </FormLabel>

                    <SingleSelectWithNumbering
                      options={
                        blocksData?.records?.map((b: any) => ({
                          label: b.block_name,
                          value: b._id,
                        })) || []
                      }
                      value={field.value || null}
                      onChange={(val) => {
                        const selected = blocksData?.records.find(
                          (b: any) => b._id === val
                        );

                        if (selected) {
                          form.setValue("location.block_id", selected._id, {
                            shouldDirty: true,
                          });
                          form.setValue(
                            "location.block_code",
                            selected.block_code || "",
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.block_name",
                            selected.block_name || "",
                            { shouldDirty: true }
                          );
                        }

                        // reset dependent fields
                        form.setValue("location.panchayat_id", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.panchayat_code", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.panchayat_name", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.village_id", [], {
                          shouldDirty: true,
                        });

                        field.onChange(selected?._id || ""); // keep RHF in sync
                      }}
                      placeholder={
                        blocksData ? "Select Block" : "Loading Blocks..."
                      }
                      disabled={!blocksData}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🏡 PANCHAYAT */}
              <FormField
                control={form.control}
                name="location.panchayat_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Panchayat<span className="text-red-500">*</span>
                    </FormLabel>

                    <SingleSelectWithNumbering
                      options={
                        panchayatsData?.records?.map((p: any) => ({
                          label: p.panchayat_name,
                          value: p._id,
                        })) || []
                      }
                      value={field.value || null}
                      onChange={(val) => {
                        const selected = panchayatsData?.records.find(
                          (p: any) => p._id === val
                        );

                        if (selected) {
                          form.setValue("location.panchayat_id", selected._id, {
                            shouldDirty: true,
                          });
                          form.setValue(
                            "location.panchayat_code",
                            selected.panchayat_code || "",
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.panchayat_name",
                            selected.panchayat_name || "",
                            { shouldDirty: true }
                          );
                        }

                        // reset villages
                        form.setValue("location.village_id", [], {
                          shouldDirty: true,
                        });
                      }}
                      placeholder={
                        panchayatsData
                          ? "Select Panchayat"
                          : "Loading Panchayats..."
                      }
                      disabled={!panchayatsData}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🏡 VILLAGES */}
              <FormField
                control={form.control}
                name="location.village_id"
                render={({ field }) => {
                  const options =
                    villagesData?.records?.map((v: any) => ({
                      value: v._id.toString(),
                      label: v.village_name,
                    })) || [];

                  return (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Villages<span className="text-red-500">*</span>
                      </FormLabel>
                      <MultiSelectWithBadges
                        options={options}
                        values={(field.value || []).filter(Boolean)}
                        onChange={(vals) => {
                          form.setValue(
                            "location.village_id",
                            vals.filter(Boolean),
                            { shouldDirty: true }
                          );

                          const selectedVillages =
                            villagesData?.records
                              ?.filter((v: any) =>
                                vals.includes(v._id.toString())
                              )
                              .map((v: any) => ({
                                _id: v._id.toString(),
                                village_code: v.village_code,
                                village_name: v.village_name,
                                panchayat_code: v.panchayat_code,
                                panchayat_name: v.panchayat_name,
                              })) || [];

                          form.setValue("location.villages", selectedVillages, {
                            shouldDirty: true,
                          });
                        }}
                        placeholder="Select Villages"
                        badgeColor="bg-blue-500"
                        badgeClassName="w-[150px] truncate"
                      />
                    </FormItem>
                  );
                }}
              />
            </>
          )}

          {areaType === "UR" && (
            <>
              {/* 🏙️ LOCAL BODY TYPE */}
              <FormField
                control={form.control}
                name="location.local_body_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Local Body Type <span className="text-red-500">*</span>
                    </FormLabel>

                    <SingleSelectWithNumbering
                      options={
                        localBodyTypeData?.records?.map((lb: any) => ({
                          label: lb.local_body_type_name,
                          value: lb._id.toString(),
                        })) || []
                      }
                      value={field.value || null}
                      onChange={(val) => {
                        const selected = localBodyTypeData?.records.find(
                          (lb: any) => lb._id.toString() === val
                        );

                        if (selected) {
                          form.setValue(
                            "location.local_body_type_id",
                            selected._id.toString(),
                            {
                              shouldDirty: true,
                            }
                          );
                          form.setValue(
                            "location.local_body_type_code",
                            selected.local_body_type_code,
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.local_body_type_name",
                            selected.local_body_type_name,
                            { shouldDirty: true }
                          );
                        }

                        // reset dependents
                        form.setValue("location.local_body_id", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.local_body_code", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.local_body_name", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.ward_id", [], {
                          shouldDirty: true,
                        });

                        field.onChange(val);
                      }}
                      placeholder={
                        localBodyTypeData
                          ? "Select Local Body Type"
                          : "Loading Types..."
                      }
                      disabled={!localBodyTypeData}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🏢 LOCAL BODY */}
              <FormField
                control={form.control}
                name="location.local_body_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Local Body<span className="text-red-500">*</span>
                    </FormLabel>

                    <SingleSelectWithNumbering
                      options={
                        localBodiesData?.records?.map((lb: any) => ({
                          label: lb.local_body_name,
                          value: lb._id.toString(),
                        })) || []
                      }
                      value={field.value || null}
                      onChange={(val) => {
                        const selected = localBodiesData?.records.find(
                          (lb: any) => lb._id.toString() === val
                        );

                        if (selected) {
                          form.setValue(
                            "location.local_body_id",
                            selected._id.toString(),
                            {
                              shouldDirty: true,
                            }
                          );
                          form.setValue(
                            "location.local_body_code",
                            selected.local_body_code,
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.local_body_name",
                            selected.local_body_name,
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.local_body_type_code",
                            selected.local_body_type_code,
                            { shouldDirty: true }
                          );
                          form.setValue(
                            "location.local_body_type_name",
                            selected.local_body_type_name,
                            { shouldDirty: true }
                          );
                        }

                        // reset dependent wards
                        form.setValue("location.ward_id", [], {
                          shouldDirty: true,
                        });

                        field.onChange(val); // keep RHF synced
                      }}
                      placeholder={
                        localBodiesData
                          ? "Select Local Body"
                          : "Loading Local Bodies..."
                      }
                      disabled={!localBodiesData}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🏢 WARDS */}
              <FormField
                control={form.control}
                name="location.ward_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Wards<span className="text-red-500">*</span>
                    </FormLabel>
                    <MultiSelectWithBadges
                      options={
                        wardsData?.records?.map((w: any) => ({
                          value: w._id.toString(),
                          label: w.ward_name,
                        })) || []
                      }
                      values={(field.value || []).filter(Boolean)}
                      onChange={(vals) => {
                        form.setValue(
                          "location.ward_id",
                          vals.filter(Boolean),
                          { shouldDirty: true }
                        );
                        // console.log("Selected ward IDs:", vals);
                        // console.log("All wards from API:", wardsData?.records);
                        const selectedWards = wardsData?.records
                          ?.filter((w: any) => vals.includes(w._id.toString()))
                          .map((w: any) => {
                            // console.log("Ward object before mapping:", w);
                            return {
                              ward_code: w.ward_code ?? "",
                              ward_number: w.ward_number ?? "",
                              ward_name: w.ward_name ?? "",
                              local_body_type_code:
                                w.local_body_type_code ?? "",
                              local_body_type_name:
                                w.local_body_type_name ?? "",
                            };
                          });

                        form.setValue("location.wards", selectedWards, {
                          shouldDirty: true,
                        });
                      }}
                      placeholder="Select Wards"
                      badgeClassName="w-[150px] truncate"
                      badgeColor="bg-purple-500"
                    />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Sector and Work Details */}
        <div className="flex items-center gap-5 w-full">
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department <span className="text-red-500">*</span>
                </FormLabel>

                <SingleSelectWithNumbering
                  options={
                    departments?.map((d: any) => ({
                      label: d.department_name,
                      value: d._id,
                    })) || []
                  }
                  value={field.value || null}
                  onChange={(val) => {
                    const selected = departments.find(
                      (d: any) => d._id === val
                    );

                    form.setValue("department_id", selected?._id || "", {
                      shouldDirty: true,
                    });
                    form.setValue(
                      "department_name",
                      selected?.department_name || "",
                      { shouldDirty: true }
                    );
                  }}
                  placeholder={
                    deptLoading ? "Loading Departments..." : "Select Department"
                  }
                  disabled={deptLoading}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sector <span className="text-red-500">*</span>
                </FormLabel>

                <SingleSelectWithNumbering
                  options={
                    sectorsData?.records?.map((s: any) => ({
                      label: s.sector_name,
                      value: s._id,
                    })) || []
                  }
                  value={field.value || null}
                  onChange={(val) => {
                    const selected = sectorsData?.records?.find(
                      (s: any) => s._id === val
                    );

                    // ✅ Update sector fields
                    form.setValue("sector_id", selected?._id || "", {
                      shouldDirty: true,
                    });
                    form.setValue("sector_name", selected?.sector_name || "", {
                      shouldDirty: true,
                    });

                    // 🔄 Reset dependent sub-sector & works
                    form.setValue("sub_sector", "", { shouldDirty: true });
                    form.setValue("permissible_work", [], {
                      shouldDirty: true,
                    });

                    field.onChange(selected?._id || ""); // keep RHF synced
                  }}
                  placeholder={
                    sectorsData ? "Select Sector" : "Loading Sectors..."
                  }
                  disabled={!sectorsData}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sub_sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-Sector</FormLabel>
                <Select
                  onValueChange={(val) => {
                    form.setValue("sub_sector", val, { shouldDirty: true });

                    // reset works when sub_sector changes
                    form.setValue("permissible_work", [], {
                      shouldDirty: true,
                    });
                  }}
                  value={field.value || ""}
                  disabled={subSectors.length === 0} // ✅ safer
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub-Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {subSectors.map((ss: string) => (
                      <SelectItem key={ss} value={ss}>
                        {ss}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissible_work"
            render={({ field }) => {
              const hasSubSectors = subSectors.length > 0;
              const isSectorSelected = !!selectedSectorId;
              const isSubSectorSelected = !!selectedSubSector;
              const disableWorks =
                !isSectorSelected || (hasSubSectors && !isSubSectorSelected);

              return (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>
                    Permissible Works <span className="text-red-500">*</span>
                  </FormLabel>
                  <MultiSelectWithBadges
                    options={permissibleWorksOptions}
                    values={field.value || []}
                    onChange={(vals) =>
                      form.setValue("permissible_work", vals, {
                        shouldDirty: true,
                      })
                    }
                    placeholder="Select Works"
                    badgeColor="bg-green-500"
                    badgeClassName="w-[150px] truncate"
                    disabled={disableWorks}
                  />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Approval Section */}
        <FormField
          control={form.control}
          name="approved_by"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Approved By<span className="text-red-500">*</span>
              </FormLabel>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={(val) => {
                  const typedVal = val as "DLC" | "NODAL_MINISTER" | "BOTH";
                  form.setValue("approved_by", typedVal, { shouldDirty: true });

                  if (typedVal === "DLC") {
                    form.setValue("approved_by_dlc", true, {
                      shouldDirty: true,
                    });
                    form.setValue("approved_by_nm", false, {
                      shouldDirty: true,
                    });
                  } else if (typedVal === "NODAL_MINISTER") {
                    form.setValue("approved_by_dlc", true, {
                      shouldDirty: true,
                    });
                    form.setValue("approved_by_nm", true, {
                      shouldDirty: true,
                    });
                  } else if (typedVal === "BOTH") {
                    form.setValue("approved_by_dlc", true, {
                      shouldDirty: true,
                    });
                    form.setValue("approved_by_nm", true, {
                      shouldDirty: true,
                    });
                  }
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DLC" id="approved_dlc" />
                  <FormLabel htmlFor="approved_dlc">DLC</FormLabel>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NODAL_MINISTER" id="approved_nodal" />
                  <FormLabel htmlFor="approved_nodal">Nodal Minister</FormLabel>
                </div> */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BOTH" id="approved_both" />
                  <FormLabel htmlFor="approved_both">
                    Both (DLC & Nodal Minister)
                  </FormLabel>
                </div>
              </RadioGroup>
            </FormItem>
          )}
        />

        {/* Implementation Agency */}
        <FormField
          control={form.control}
          name="assigned_ia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Implementation Agency <span className="text-red-500">*</span>
              </FormLabel>

              <SingleSelectWithNumbering
                options={implementationAgencies.map((ia) => ({
                  label: ia.agency_name,
                  value: ia._id,
                }))}
                value={field.value || null}
                onChange={(val) => {
                  const selected = implementationAgencies.find(
                    (ia) => ia._id === val
                  );
                  form.setValue("assigned_ia", selected?._id || "", {
                    shouldDirty: true,
                  });
                  form.setValue(
                    "assigned_ia_name",
                    selected?.agency_name || "",
                    { shouldDirty: true }
                  );
                }}
                placeholder={
                  iaLoading
                    ? "Loading agencies..."
                    : "Select Implementation Agency"
                }
                disabled={iaLoading}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isCreating || isUpdating || form.formState.isSubmitting}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {isCreating || isUpdating || form.formState.isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Proposal"
            : "Create Proposal"}
        </Button>
      </form>
    </Form>
  );
};

export default ProposalForm;
