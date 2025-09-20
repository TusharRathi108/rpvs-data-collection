//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

//* ui components
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
import { MultiSelectWithBadges } from "../mini-components/multi-select";

//* schemas & types
import {
  ProposalFormSchema,
  type ProposalFormValues,
} from "@/schemas/proposal.schema";
import { ProposalRecommenderType } from "@/interfaces/enums.interface";
import type { RootState } from "@/store/store";

//* api services
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
  useGetAllSectorsQuery,
  useGetSubSectorWorksQuery,
} from "@/store/services/sector.api";
import {
  useCreateProposalMutation,
  useUpdateProposalMutation,
} from "@/store/services/proposal.api";

// ---------- constants ----------
const EMPTY_FORM_VALUES: ProposalFormValues & { _id?: string } = {
  district_id: "",
  sector_id: "",
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
  reference_number: "",
  manual_reference_number: "",
  permissible_work: [],
  approved_by_dlc: false,
  approved_by_nm: false,
  assigned_ia: "",
  assigned_ia_name: "",
  location: {
    area_type: "RU",
    district_code: "",
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

// ---------- component ----------
type ProposalFormProps = {
  initialData?: Partial<ProposalFormValues> | null;
  onSuccess?: () => void;
};

const ProposalForm = ({ initialData, onSuccess }: ProposalFormProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const districtCode = user?.district_code;
  const stateCode = user?.state_code;

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
  const departments = [...defaultIAs];

  const [
    createProposal,
    { isLoading: isCreating, isSuccess: isCreateSuccess },
  ] = useCreateProposalMutation();
  const [
    updateProposal,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateProposalMutation();

  const isEdit = !!initialData?._id;

  const previousPanchayatRef = useRef<string | undefined>(undefined);
  const previousLocalBodyRef = useRef<string | undefined>(undefined);
  const previousSectorRef = useRef<string | undefined>(undefined);

  // ---------- form setup ----------
  const form = useForm<ProposalFormValues & { _id?: string }>({
    resolver: zodResolver(ProposalFormSchema),
    mode: "onChange",
    defaultValues: {
      ...EMPTY_FORM_VALUES,
      district_id: user?.district?.district_id || "",
      location: {
        ...EMPTY_FORM_VALUES.location,
        district_code: districtCode || "",
      },
    },
  });

  const areaType = form.watch("area_type");
  const recommenderType = form.watch("recommender_type");

  // ---------- queries ----------
  const { data: blocksData } = useFetchBlocksQuery(
    stateCode && districtCode
      ? { state_code: stateCode, district_code: districtCode }
      : skipToken
  );
  const { data: constituenciesData } = useFetchConstituenciesQuery(
    stateCode && districtCode
      ? { state_code: stateCode, district_code: districtCode }
      : skipToken
  );

  const blockCode = form.watch("location.block_code");
  const { data: panchayatsData } = useFetchPanchayatsQuery(
    blockCode && districtCode
      ? { district_code: districtCode, block_code: blockCode }
      : skipToken
  );

  const panchayatCode = form.watch("location.panchayat_code");
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
  const localBodyTypeCode = form.watch("location.local_body_type_code");

  const { data: localBodiesData } = useFetchLocalBodiesQuery(
    localBodyTypeCode && districtCode
      ? { district_code: districtCode, local_body_type_code: localBodyTypeCode }
      : skipToken
  );

  const localBodyCode = form.watch("location.local_body_code");
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
  const { data: sectorsData, isLoading: sectorsLoading } =
    useGetAllSectorsQuery();

  const selectedSectorId = form.watch("sector_id");
  const selectedSubSector = form.watch("sub_sector");

  const { data: sectorDetails } = useGetSubSectorWorksQuery(
    selectedSectorId
      ? { sector: selectedSectorId, subSector: selectedSubSector || undefined }
      : skipToken
  );

  const permissibleWorksOptions =
    sectorDetails?.records?.[0]?.works?.map((w: string) => ({
      value: w,
      label: w,
    })) || [];

  // ---------- effects ----------
  // preload form for edit
  useEffect(() => {
    if (!initialData || isCreateSuccess) return;

    let approvedByValue: "DLC" | "NODAL_MINISTER" | "BOTH" | undefined;
    if (initialData.approved_by_dlc && initialData.approved_by_nm)
      approvedByValue = "BOTH";
    else if (initialData.approved_by_dlc) approvedByValue = "DLC";
    else if (initialData.approved_by_nm) approvedByValue = "NODAL_MINISTER";

    form.reset({
      ...initialData,
      _id: initialData._id,
      district_id: initialData.district_id || user?.district?.district_id || "",
      approved_by: approvedByValue,
      location: {
        ...initialData.location,
        panchayat_id: initialData.location?.panchayat_id?.toString() || "",
        panchayat_code: initialData.location?.panchayat_code?.toString() || "",
        panchayat_name: initialData.location?.panchayat_name || "",
        village_id:
          initialData.location?.villages?.map((v: any) => v.village_code) || [],
        villages: initialData.location?.villages || [],
      },
      permissible_work: initialData.permissible_work || [],
    });

    previousPanchayatRef.current = initialData.location?.panchayat_code;
    previousLocalBodyRef.current = initialData.location?.local_body_code;
    previousSectorRef.current = initialData.sector_id;
  }, [initialData, isCreateSuccess, form, user, districtCode]);

  // reset after success
  useEffect(() => {
    if (isCreateSuccess) {
      form.reset(EMPTY_FORM_VALUES);
      onSuccess?.();
    }
    if (isUpdateSuccess && initialData) {
      form.reset(initialData as any);
      onSuccess?.();
    }
  }, [isCreateSuccess, isUpdateSuccess, form, onSuccess, initialData]);

  const onSubmit = async (values: ProposalFormValues) => {
    console.log("✅ onSubmit function called with values:", values);
    console.log("Form state:", { isEdit, initialDataId: initialData?._id });

    try {
      // Validate form
      const isValid = await form.trigger();
      if (!isValid) {
        console.error("Form validation failed", form.formState.errors);
        toast.error("Please fix the form errors before submitting");
        return;
      }

      if (values.recommender_type === "MLA") {
        values.recommender_designation = "MLA";
      } else if (values.recommender_type === "OTHER") {
        values.recommender_designation =
          values.recommender_designation?.trim() || "OTHER";
      }

      const block = blocksData?.records.find(
        (b: any) => b.block_code === values.location.block_code
      );
      const panchayat = panchayatsData?.records.find(
        (p: any) => p.panchayat_code === values.location.panchayat_code
      );
      const constituency = constituenciesData?.records.find(
        (c: any) => c.constituency_code === values.location.constituency_code
      );
      const localBody = localBodiesData?.records.find(
        (lb: any) => lb.local_body_code === values.location.local_body_code
      );
      const villages = villagesData?.records.filter((v: any) =>
        (values.location.village_id ?? []).includes(v.village_code)
      );
      const wards = wardsData?.records.filter((w: any) =>
        (values.location.ward_id ?? []).includes(w.ward_code)
      );

      const enrichedVillages =
        villages?.map((v: any) => ({
          panchayat_code: v.panchayat_code,
          village_code: v.village_code,
          village_name: v.village_name,
          panchayat_name: v.panchayat_name,
        })) || [];

      const enrichedWards =
        wards?.map((w: any) => ({
          ward_code: w.ward_code,
          ward_number: w.ward_number,
          ward_name: w.ward_name,
          local_body_type_code: w.local_body_type_code,
          local_body_type_name: w.local_body_type_name,
        })) || [];

      const payload = {
        ...values,
        recommender_contact: Number(values.recommender_contact),
        assigned_ia: values.assigned_ia || "",
        assigned_ia_name: values.assigned_ia_name || "",
        actionType: isEdit ? "EDITED" : "CREATED",
        sub_sector_name: values.sub_sector?.trim() || "General",
        location:
          values.area_type === "RU"
            ? {
                ...values.location,
                area_type: "RU",
                state_id: "68c289dfcc5da75edf90bf6e",
                state_code: user?.state_code || "",
                state_name: user?.state_name || "",
                district_id:
                  user?.district?.district_id ?? "000000000000000000000000",
                district_code: user?.district_code || "",
                district_name: user?.district_name || "",

                constituency_id:
                  constituency?._id || "000000000000000000000000",
                constituency_code: constituency?.constituency_code || "",
                constituency_name: constituency?.constituency_name || "",

                block_id: block?._id || "000000000000000000000000",
                block_code: block?.block_code || "",
                block_name: block?.block_name || "",
                panchayat_id: panchayat?._id || "000000000000000000000000",
                panchayat_code: panchayat?.panchayat_code || "",
                panchayat_name: panchayat?.panchayat_name || "",
                village_id: villages?.map((v: any) => v._id) ?? [],
                villages: enrichedVillages,
                wards: [],
                // forbid urban
                local_body_id: undefined,
                local_body_code: undefined,
                local_body_name: undefined,
                local_body_type_id: undefined,
                local_body_type_code: undefined,
                local_body_type_name: undefined,
                ward_id: [],
              }
            : {
                ...values.location,

                area_type: "UR",
                state_id: "68c289dfcc5da75edf90bf6e",
                state_code: user?.state_code || "",
                state_name: user?.state_name || "",
                district_id:
                  user?.district?.district_id ?? "000000000000000000000000",
                district_code: user?.district_code || "",
                district_name: user?.district_name || "",

                // ✅ constituency full info
                constituency_id:
                  constituency?._id || "000000000000000000000000",
                constituency_code: constituency?.constituency_code || "",
                constituency_name: constituency?.constituency_name || "",

                // ✅ local body + type full info
                local_body_id: localBody?._id || "000000000000000000000000",
                local_body_code: localBody?.local_body_code || "",
                local_body_name: localBody?.local_body_name || "",
                local_body_type_id:
                  localBody?.local_body_type_id || "000000000000000000000000",
                local_body_type_code: localBody?.local_body_type_code || "",
                local_body_type_name: localBody?.local_body_type_name || "",

                ward_id: wards?.map((w: any) => w._id) ?? [],
                wards: enrichedWards,
                villages: [],

                // forbid rural
                block_id: undefined,
                block_code: undefined,
                block_name: undefined,
                panchayat_id: undefined,
                panchayat_code: undefined,
                panchayat_name: undefined,
                village_id: [],
              },
      };

      // Remove the _id from payload before sending
      const { _id, ...payloadWithoutId } = payload as any;

      console.log("Submitting payload:", payloadWithoutId);

      let result;
      if (isEdit) {
        const proposalId = initialData?._id || values._id;

        if (!proposalId) {
          console.error("❌ Missing proposal ID for update");
          toast.error("Proposal ID missing — cannot update");
          return;
        }

        console.log("Updating proposal with ID:", proposalId);

        result = await updateProposal({
          proposal_id: proposalId,
          data: payloadWithoutId,
        }).unwrap();

        console.log("Update successful:", result);
        toast.success("✅ Proposal updated successfully");
      } else {
        console.log("Creating new proposal");

        result = await createProposal(payloadWithoutId).unwrap();

        console.log("Create successful:", result);
        toast.success(result.message || "✅ Proposal created successfully");
      }

      form.reset();
      onSuccess?.();
    } catch (err: any) {
      console.error("❌ Failed to create/update proposal:", err);
      toast.error(err?.data?.message || "Failed to save proposal");
    } finally {
      form.reset();
    }
  };

  useEffect(() => {
    if (isCreateSuccess) {
      // clear the form after a successful create
      form.reset({
        district_id: "",
        sector_id: "",
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
        reference_number: "",
        manual_reference_number: "",
        permissible_work: [],
        approved_by_dlc: false,
        approved_by_nm: false,
        assigned_ia: "",
        assigned_ia_name: "",
        location: {
          area_type: "RU",
          district_code: "",
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
      });
    }

    if (isUpdateSuccess) {
      // optional: either clear or just keep values
      // form.reset(); // if you want to clear also on update
    }
  }, [isCreateSuccess, isUpdateSuccess, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submit event triggered");
          console.log("Form validation errors:", form.formState.errors);
          console.log("Form values:", form.getValues());

          // Check validation manually
          form.trigger().then((isValid) => {
            console.log("Form is valid:", isValid);
            if (!isValid) {
              console.error("Validation failed:", form.formState.errors);
              toast.error("Please fix form errors before submitting");
            } else {
              // If valid, call handleSubmit
              form.handleSubmit(onSubmit, (errors) => {
                console.error("Form submission errors:", errors);
              })(e);
            }
          });
        }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col rounded-2xl  gap-5">
          <FormField
            control={form.control}
            name="area_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Type</FormLabel>
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

          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="recommender_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommended By</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) =>
                        form.setValue(
                          "recommender_type",
                          val as ProposalRecommenderType,
                          {
                            shouldDirty: true,
                          }
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

            {recommenderType === "MLA" && (
              <FormField
                control={form.control}
                name="recommender_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MLA</FormLabel>
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
            )}

            {recommenderType === "OTHER" && (
              <>
                <FormField
                  control={form.control}
                  name="recommender_designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Recommender</FormLabel>
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
                      <FormLabel>Recommender Name</FormLabel>
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

        {/* <FormField
            control={form.control}
            name="approved_by"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Approved By</FormLabel>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={(val) => {
                    const typedVal = val as "DLC" | "NODAL_MINISTER" | "BOTH";
                    form.setValue("approved_by", typedVal, {
                      shouldDirty: true,
                    });

                    if (typedVal === "DLC") {
                      form.setValue("approved_by_dlc", true, {
                        shouldDirty: true,
                      });
                      form.setValue("approved_by_nm", false, {
                        shouldDirty: true,
                      });
                    } else if (typedVal === "NODAL_MINISTER") {
                      form.setValue("approved_by_dlc", false, {
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

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="NODAL_MINISTER"
                      id="approved_nodal"
                    />
                    <FormLabel htmlFor="approved_nodal">
                      Nodal Minister
                    </FormLabel>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BOTH" id="approved_both" />
                    <FormLabel htmlFor="approved_both">Both</FormLabel>
                  </div>
                </RadioGroup>
              </FormItem>
            )}
          /> */}

        {/* {recommenderType === "OTHER" && (
          <FormField
            control={form.control}
            name="recommender_designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Recommender</FormLabel>
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
        )} */}

        <div className="flex items-center gap-5 w-full">
          {/* <FormField
              control={form.control}
              name="reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number (Auto-generated)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled placeholder="Auto-generated" />
                  </FormControl>
                </FormItem>
              )}
            /> */}

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
                <FormLabel>Recommender Contact</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) {
                        field.onChange(val ? Number(val) : undefined);
                      }
                    }}
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
              <FormItem className="flex-1">
                <FormLabel>Recommender Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposal_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter proposal name" />
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
                <FormLabel>Proposal Amount (₹)</FormLabel>
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
                    value={field.value?.toString() || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-5 w-full">
          <div>
            <FormField
              control={form.control}
              name="location.constituency_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constituency</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      form.setValue("location.constituency_code", val, {
                        shouldDirty: true,
                      })
                    }
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
            />
          </div>
          <div className="flex gap-5">
            {areaType === "RU" && (
              <FormField
                control={form.control}
                name="location.block_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        form.setValue("location.block_code", val, {
                          shouldDirty: true,
                        })
                      }
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Block" />
                      </SelectTrigger>
                      <SelectContent>
                        {blocksData?.records?.map((b: any) => (
                          <SelectItem key={b.block_code} value={b.block_code}>
                            {b.block_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {areaType === "RU" && (
              <>
                <FormField
                  control={form.control}
                  name="location.panchayat_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panchayat</FormLabel>
                      <Select
                        onValueChange={(val) =>
                          form.setValue("location.panchayat_id", val, {
                            shouldDirty: true,
                          })
                        }
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Panchayat" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* ✅ use API if loaded */}
                          {panchayatsData?.records?.length
                            ? panchayatsData.records.map((p: any) => (
                                <SelectItem key={p._id} value={p._id}>
                                  {p.panchayat_name}
                                </SelectItem>
                              ))
                            : /* ✅ fallback to initialData */
                              initialData?.location?.panchayat_id && (
                                <SelectItem
                                  key={initialData.location.panchayat_id}
                                  value={initialData.location.panchayat_id}
                                >
                                  {initialData.location.panchayat_name ||
                                    "Unknown Panchayat"}
                                </SelectItem>
                              )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.village_id"
                  render={({ field }) => {
                    const options =
                      villagesData?.records?.map((v: any) => ({
                        value: v.village_code,
                        label: v.village_name,
                      })) ||
                      initialData?.location?.villages?.map((v: any) => ({
                        value: v.village_code,
                        label: v.village_name,
                      })) ||
                      [];

                    return (
                      <FormItem>
                        <FormLabel>Villages</FormLabel>
                        <MultiSelectWithBadges
                          options={options}
                          values={field.value || []}
                          onChange={(vals) =>
                            form.setValue("location.village_id", vals, {
                              shouldDirty: true,
                            })
                          }
                          placeholder="Select Villages"
                          badgeColor="bg-blue-500"
                        />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}

            {areaType === "UR" && (
              <>
                <FormField
                  control={form.control}
                  name="location.local_body_type_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Body Type</FormLabel>
                      <Select
                        onValueChange={(val) =>
                          form.setValue("location.local_body_type_code", val, {
                            shouldDirty: true,
                          })
                        }
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Local Body Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {localBodyTypeData?.records?.map((lb: any) => (
                            <SelectItem
                              key={lb.local_body_type_code}
                              value={lb.local_body_type_code}
                            >
                              {lb.local_body_type_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.local_body_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Body</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          const selected = localBodiesData?.records.find(
                            (lb: any) => lb.local_body_code === val
                          );
                          form.setValue(
                            "location.local_body_code",
                            selected?.local_body_code || "",
                            {
                              shouldDirty: true,
                            }
                          );
                          form.setValue(
                            "location.local_body_name",
                            selected?.local_body_name || "",
                            {
                              shouldDirty: true,
                            }
                          );
                          form.setValue(
                            "location.local_body_type_code",
                            selected?.local_body_type_code || "",
                            {
                              shouldDirty: true,
                            }
                          );
                          form.setValue(
                            "location.local_body_type_name",
                            selected?.local_body_type_name || "",
                            {
                              shouldDirty: true,
                            }
                          );

                          // ✅ add this line
                          form.setValue(
                            "location.local_body_id",
                            selected?._id || "000000000000000000000000",
                            {
                              shouldDirty: true,
                            }
                          );
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Local Body" />
                        </SelectTrigger>
                        <SelectContent>
                          {localBodiesData?.records?.map((lb: any) => (
                            <SelectItem
                              key={lb.local_body_code}
                              value={lb.local_body_code}
                            >
                              {lb.local_body_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.ward_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wards</FormLabel>
                      <MultiSelectWithBadges
                        options={
                          wardsData?.records?.map((w: any) => ({
                            value: w.ward_code,
                            label: w.ward_name,
                          })) || []
                        }
                        values={field.value || []}
                        onChange={(vals) =>
                          form.setValue("location.ward_id", vals, {
                            shouldDirty: true,
                          })
                        }
                        placeholder="Select Wards"
                        badgeColor="bg-purple-500"
                        badgeClassName="w-[70px]"
                      />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 w-full">
          <FormField
            control={form.control}
            name="assigned_ia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const selected = departments.find((d) => d._id === val);

                    form.setValue(
                      "assigned_ia",
                      selected?._id || "000000000000000000000000",
                      {
                        shouldDirty: true,
                      }
                    );
                    form.setValue(
                      "assigned_ia_name",
                      selected?.agency_name || "",
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.agency_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector_id"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Sector</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const selected = sectorsData?.records?.find(
                      (s: any) => s._id === val
                    );
                    form.setValue("sector_id", selected?._id || "", {
                      shouldDirty: true,
                    });
                    form.setValue("sector_name", selected?.sector_name || "", {
                      shouldDirty: true,
                    });
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-[200px] truncate">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorsLoading ? (
                      <SelectItem value="__loading" disabled>
                        Loading sectors...
                      </SelectItem>
                    ) : (
                      sectorsData?.records?.map((s: any) => (
                        <SelectItem key={s._id} value={s._id} className="">
                          {s.sector_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sub_sector"
            render={({ field }) => {
              const rawSubSectors =
                sectorDetails?.records?.[0]?.sub_sectors ?? [];
              const subSectors = Array.isArray(rawSubSectors)
                ? rawSubSectors
                : rawSubSectors
                ? [rawSubSectors]
                : [];

              const hasSubSectors = subSectors.length > 0;

              return (
                <FormItem className="">
                  <FormLabel>Sub-Sector</FormLabel>
                  <Select
                    onValueChange={(val) =>
                      form.setValue("sub_sector", val, { shouldDirty: true })
                    }
                    value={field.value || ""}
                    disabled={!hasSubSectors}
                  >
                    <SelectTrigger className="w-[150px] truncate">
                      <SelectValue
                        placeholder={
                          hasSubSectors ? "Select Sub-Sector" : "No Sub-Sectors"
                        }
                      />
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
              );
            }}
          />

          <FormField
            control={form.control}
            name="permissible_work"
            render={({ field }) => {
              const rawSubSectors =
                sectorDetails?.records?.[0]?.sub_sectors ?? [];
              const subSectors = Array.isArray(rawSubSectors)
                ? rawSubSectors
                : rawSubSectors
                ? [rawSubSectors]
                : [];

              const hasSubSectors = subSectors.length > 0;

              const isSectorSelected = !!selectedSectorId;
              const isSubSectorSelected = !!selectedSubSector;

              const disableWorks =
                !isSectorSelected || (hasSubSectors && !isSubSectorSelected);

              return (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>Permissible Works</FormLabel>
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
                    badgeClassName="w-[70px]"
                    disabled={disableWorks}
                  />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="approved_by"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Approved By</FormLabel>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={(val) => {
                  const typedVal = val as "DLC" | "NODAL_MINISTER" | "BOTH";
                  form.setValue("approved_by", typedVal, {
                    shouldDirty: true,
                  });

                  if (typedVal === "DLC") {
                    form.setValue("approved_by_dlc", true, {
                      shouldDirty: true,
                    });
                    form.setValue("approved_by_nm", false, {
                      shouldDirty: true,
                    });
                  } else if (typedVal === "NODAL_MINISTER") {
                    form.setValue("approved_by_dlc", false, {
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

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NODAL_MINISTER" id="approved_nodal" />
                  <FormLabel htmlFor="approved_nodal">Nodal Minister</FormLabel>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BOTH" id="approved_both" />
                  <FormLabel htmlFor="approved_both">Both</FormLabel>
                </div>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigned_ia"
          render={({ field }) => (
            <FormItem className="flex w-full">
              <FormLabel>Implementation Agency</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={(val) => {
                  const selected = defaultIAs.find((ia) => ia._id === val);

                  form.setValue("assigned_ia", selected?._id || "", {
                    shouldDirty: true,
                  });
                  form.setValue(
                    "assigned_ia_name",
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
