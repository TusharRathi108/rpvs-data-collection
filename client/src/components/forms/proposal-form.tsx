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
import { useGetImplementationAgenciesDistrictWiseQuery } from "@/store/services/ia.api";
import { useGetAllDepartmentsQuery } from "@/store/services/department.api";

const EMPTY_FORM_VALUES: ProposalFormValues & { _id?: string } = {
  district_id: "",
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

const enrichLocationData = (values: ProposalFormValues, locationData: any) => {
  const {
    blocksData,
    panchayatsData,
    constituenciesData,
    localBodiesData,
    villagesData,
    wardsData,
  } = locationData;

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
    (values.location.village_id ?? []).includes(v._id?.toString())
  );
  const wards = wardsData?.records.filter((w: any) =>
    (values.location.ward_id ?? []).includes(w._id?.toString())
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

  return {
    block,
    panchayat,
    constituency,
    localBody,
    enrichedVillages,
    enrichedWards,
  };
};

const buildLocationPayload = (
  values: ProposalFormValues,
  user: any,
  enrichedData: any
) => {
  const {
    block,
    panchayat,
    constituency,
    localBody,
    enrichedVillages,
    enrichedWards,
  } = enrichedData;

  const baseLocation = {
    state_id: "68c289dfcc5da75edf90bf6e",
    state_code: user?.state_code || "",
    state_name: user?.state_name || "",
    district_id: user?.district?.district_id ?? "000000000000000000000000",
    district_code: user?.district_code || "",
    district_name: user?.district_name || "",
    constituency_id: constituency?._id || "000000000000000000000000",
    constituency_code: constituency?.constituency_code || "",
    constituency_name: constituency?.constituency_name || "",
  };

  if (values.area_type === "RU") {
    return {
      ...values.location,
      ...baseLocation,
      area_type: "RU",
      block_id: block?._id || "000000000000000000000000",
      block_code: block?.block_code || "",
      block_name: block?.block_name || "",
      panchayat_id: panchayat?._id || "000000000000000000000000",
      panchayat_code: panchayat?.panchayat_code || "",
      panchayat_name: panchayat?.panchayat_name || "",
      village_id: (values.location.village_id || []).map(String),
      villages: enrichedVillages,
      wards: [],
      local_body_id: undefined,
      local_body_code: undefined,
      local_body_name: undefined,
      local_body_type_id: undefined,
      local_body_type_code: undefined,
      local_body_type_name: undefined,
      ward_id: [],
    };
  } else {
    return {
      ...values.location,
      ...baseLocation,
      area_type: "UR",
      local_body_id: localBody?._id || "000000000000000000000000",
      local_body_code: localBody?.local_body_code || "",
      local_body_name: localBody?.local_body_name || "",
      local_body_type_id:
        localBody?.local_body_type_id || "000000000000000000000000",
      local_body_type_code: localBody?.local_body_type_code || "",
      local_body_type_name: localBody?.local_body_type_name || "",
      ward_id: (values.location.ward_id || []).map(String),
      wards: enrichedWards,
      villages: [],
      block_id: undefined,
      block_code: undefined,
      block_name: undefined,
      panchayat_id: undefined,
      panchayat_code: undefined,
      panchayat_name: undefined,
      village_id: [],
    };
  }
};

type ProposalFormProps = {
  initialData?: Partial<ProposalFormValues> | null;
  onSuccess?: () => void;
};

const ProposalForm = ({ initialData, onSuccess }: ProposalFormProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const districtCode = user?.district_code;
  const stateCode = user?.state_code;
  const selectedDistrictId = user?.district?._id;

  // console.log("INITIAL DATA: ", initialData);

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

  const hasPopulatedRef = useRef(false);
  const isPopulatingRef = useRef(false);
  const previousLocalBodyCodeRef = useRef<string>("");
  const previousPanchayatCodeRef = useRef<string>("");

  const { data: iaData, isLoading: iaLoading } =
    useGetImplementationAgenciesDistrictWiseQuery(
      selectedDistrictId ? selectedDistrictId : skipToken
    );

  const implementationAgencies = iaData?.records || [];

  const { data: deptData, isLoading: deptLoading } =
    useGetAllDepartmentsQuery();

  const departments = deptData?.records || [];

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
  const blockCode = form.watch("location.block_code");
  const panchayatCode = form.watch("location.panchayat_code");
  const localBodyTypeCode = form.watch("location.local_body_type_code");
  const localBodyCode = form.watch("location.local_body_code");
  const selectedSectorId = form.watch("sector_id");
  const selectedSubSector = form.watch("sub_sector");

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

  const { data: panchayatsData } = useFetchPanchayatsQuery(
    (blockCode || initialData?.location?.block_code) && districtCode
      ? {
          district_code: districtCode,
          block_code: blockCode || initialData?.location?.block_code || "",
        }
      : skipToken
  );

  const panchayatId = form.watch("location.panchayat_id");

  const { data: villagesData } = useFetchVillagesQuery(
    (panchayatId || initialData?.location?.panchayat_id) &&
      (blockCode || initialData?.location?.block_code) &&
      districtCode
      ? {
          district_code: districtCode,
          block_code: blockCode || initialData?.location?.block_code || "",
          panchayat_code:
            panchayatCode || initialData?.location?.panchayat_code || "",
        }
      : skipToken
  );

  const { data: localBodyTypeData } = useFetchLocalBodyTypesQuery();

  const { data: localBodiesData } = useFetchLocalBodiesQuery(
    (localBodyTypeCode || initialData?.location?.local_body_type_code) &&
      districtCode
      ? {
          district_code: districtCode,
          local_body_type_code:
            localBodyTypeCode ||
            initialData?.location?.local_body_type_code ||
            "",
        }
      : skipToken
  );

  const { data: wardsData } = useFetchLocalBodyWardsQuery(
    (localBodyTypeCode || initialData?.location?.local_body_type_code) &&
      (localBodyCode || initialData?.location?.local_body_code) &&
      districtCode
      ? {
          district_code: districtCode,
          local_body_type_code:
            localBodyTypeCode ||
            initialData?.location?.local_body_type_code ||
            "",
          local_body_code:
            localBodyCode || initialData?.location?.local_body_code || "",
        }
      : skipToken
  );

  const { data: mlasData, isLoading: mlasLoading } = useFetchMlasQuery();

  const { data: sectorsData, isLoading: sectorsLoading } =
    useGetAllSectorsQuery();

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

  const onSubmit = async (values: ProposalFormValues) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix the form errors before submitting");
        return;
      }

      if (values.recommender_type === "MLA") {
        values.recommender_designation = "MLA";
      } else if (values.recommender_type === "OTHER") {
        values.recommender_designation =
          values.recommender_designation?.trim() || "OTHER";
      }

      const locationData = {
        blocksData,
        panchayatsData,
        constituenciesData,
        localBodiesData,
        villagesData,
        wardsData,
      };

      const enrichedData = enrichLocationData(values, locationData);
      const location = buildLocationPayload(values, user, enrichedData);

      const payload = {
        ...values,
        recommender_contact: Number(values.recommender_contact),
        assigned_ia: values.assigned_ia || "",
        assigned_ia_name: values.assigned_ia_name || "",
        actionType: isEdit ? "EDITED" : "CREATED",
        sub_sector_name: values.sub_sector?.trim() || "General",
        location,
      };

      const { _id, ...payloadWithoutId } = payload as any;

      let result;
      if (isEdit) {
        const proposalId = initialData?._id || values._id;
        if (!proposalId) {
          console.error("❌ Missing proposal ID for update");
          toast.error("Proposal ID missing — cannot update");
          return;
        }

        result = await updateProposal({
          proposal_id: proposalId,
          data: payloadWithoutId,
        }).unwrap();

        toast.success("✅ Proposal updated successfully");
      } else {
        result = await createProposal(payloadWithoutId).unwrap();
        toast.success(result.message || "✅ Proposal created successfully");
      }

      form.reset();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save proposal");
    } finally {
      form.reset();
    }
  };

  useEffect(() => {
    if (!initialData || hasPopulatedRef.current) return;

    const isDataReady = {
      constituencies: (constituenciesData?.records?.length ?? 0) > 0,
      blocks: (blocksData?.records?.length ?? 0) > 0,
      mlas:
        (mlasData?.records?.length ?? 0) > 0 ||
        initialData.recommender_type !== "MLA",
      sectors: (sectorsData?.records?.length ?? 0) > 0,
      departments: (departments?.length ?? 0) > 0,
      implementationAgencies: (implementationAgencies?.length ?? 0) > 0,
      localBodyTypes:
        (localBodyTypeData?.records?.length ?? 0) > 0 ||
        initialData.area_type !== "UR",
      panchayats:
        initialData.area_type === "RU" && initialData.location?.block_code
          ? (panchayatsData?.records?.length ?? 0) > 0
          : true,
      localBodies:
        initialData.area_type === "UR" &&
        initialData.location?.local_body_type_code
          ? (localBodiesData?.records?.length ?? 0) > 0
          : true,
    };

    if (!Object.values(isDataReady).every(Boolean)) return;

    isPopulatingRef.current = true;
    const populatedData: any = { ...initialData };

    // IA match
    if (
      initialData.assigned_ia_name &&
      !initialData.assigned_ia &&
      implementationAgencies.length > 0
    ) {
      const matched = implementationAgencies.find(
        (ia) => ia.agency_name === initialData.assigned_ia_name
      );
      if (matched) {
        populatedData.assigned_ia = matched._id;
        populatedData.assigned_ia_name = matched.agency_name;
      }
    }

    // Department match
    if (
      initialData.department_name &&
      !initialData.department_id &&
      departments.length > 0
    ) {
      const matched = departments.find(
        (d) => d.department_name === initialData.department_name
      );
      if (matched) {
        populatedData.department_id = matched._id;
        populatedData.department_name = matched.department_name;
      }
    }

    // Sector match
    if (
      initialData.sector_name &&
      !initialData.sector_id &&
      sectorsData?.records?.length
    ) {
      const matched = sectorsData.records.find(
        (s: any) => s.sector_name === initialData.sector_name
      );
      if (matched) {
        populatedData.sector_id = matched._id;
        populatedData.sector_name = matched.sector_name;
      }
    }

    // MLA match
    if (
      initialData.recommender_type === "MLA" &&
      initialData.recommender_name &&
      mlasData?.records?.length
    ) {
      const matchedMla = mlasData.records.find(
        (mla: any) => mla.mla_name === initialData.recommender_name
      );
      if (matchedMla) {
        populatedData.recommender_name = matchedMla.mla_name;
      }
    }

    // Panchayat match
    if (
      initialData.area_type === "RU" &&
      initialData.location?.panchayat_code &&
      panchayatsData?.records?.length
    ) {
      const matchedPanchayat = panchayatsData.records.find(
        (p: any) => p.panchayat_code === initialData.location?.panchayat_code
      );
      if (matchedPanchayat) {
        populatedData.location = {
          ...populatedData.location,
          panchayat_id: matchedPanchayat._id,
          panchayat_code: matchedPanchayat.panchayat_code,
          panchayat_name: matchedPanchayat.panchayat_name,
        };
      }
    }

    previousPanchayatRef.current = initialData.location?.block_code ?? "";
    previousPanchayatCodeRef.current =
      initialData.location?.panchayat_code ?? "";
    previousLocalBodyRef.current =
      initialData.location?.local_body_type_code ?? "";
    previousLocalBodyCodeRef.current =
      initialData.location?.local_body_code ?? "";
    previousSectorRef.current = initialData.sector_id ?? "";

    form.reset({
      ...populatedData,
      _id: initialData._id,
      district_id:
        populatedData.district_id || user?.district?.district_id || "",
      approved_by:
        initialData.approved_by_dlc && initialData.approved_by_nm
          ? "BOTH"
          : initialData.approved_by_dlc
          ? "DLC"
          : initialData.approved_by_nm
          ? "NODAL_MINISTER"
          : undefined,
    });

    hasPopulatedRef.current = true;
    isPopulatingRef.current = false;
  }, [
    initialData,
    constituenciesData,
    blocksData,
    panchayatsData,
    localBodyTypeData,
    localBodiesData,
    mlasData,
    sectorsData,
    departments,
    implementationAgencies,
    form,
    user,
  ]);

  useEffect(() => {
    if (!initialData || !hasPopulatedRef.current) return;
    if (initialData.area_type !== "RU") return;
    if (!villagesData?.records?.length) return;

    const validVillageIds =
      initialData.location?.villages
        ?.map((v) => {
          const matched = villagesData.records.find(
            (vd: any) =>
              vd.village_code === v.village_code ||
              vd.village_name === v.village_name
          );
          return matched?._id?.toString();
        })
        .filter(Boolean) ?? [];

    if (validVillageIds.length) {
      form.setValue("location.village_id", validVillageIds, {
        shouldDirty: false,
      });
    }
  }, [initialData, villagesData, form]);

  useEffect(() => {
    if (!initialData || !hasPopulatedRef.current) return;
    if (initialData.area_type !== "UR") return;
    if (!wardsData?.records?.length) return;

    const validWardIds =
      initialData.location?.wards
        ?.map((w) => {
          const matched = wardsData.records.find(
            (wd: any) =>
              wd.ward_code === w.ward_code || wd.ward_name === w.ward_name
          );
          return matched?._id?.toString();
        })
        .filter(Boolean) ?? [];

    if (validWardIds.length) {
      form.setValue("location.ward_id", validWardIds, { shouldDirty: false });
    }
  }, [initialData, wardsData, form]);

  useEffect(() => {
    if (!initialData) {
      form.reset({
        ...EMPTY_FORM_VALUES,
        district_id: user?.district?.district_id || "",
        location: {
          ...EMPTY_FORM_VALUES.location,
          district_code: districtCode || "",
        },
      });
      hasPopulatedRef.current = false;
      isPopulatingRef.current = false;
      previousPanchayatRef.current = "";
      previousPanchayatCodeRef.current = "";
      previousLocalBodyRef.current = "";
      previousLocalBodyCodeRef.current = "";
      previousSectorRef.current = "";
    }
  }, [initialData?._id]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      form.reset({
        ...EMPTY_FORM_VALUES,
        district_id: user?.district?.district_id || "",
        location: {
          ...EMPTY_FORM_VALUES.location,
          district_code: districtCode || "",
        },
      });
      hasPopulatedRef.current = false;
      isPopulatingRef.current = false;
      onSuccess?.();
    }
  }, [isCreateSuccess, isUpdateSuccess, form, onSuccess, user, districtCode]);

  useEffect(() => {
    if (!blockCode || blockCode === previousPanchayatRef.current) return;
    if (hasPopulatedRef.current && !isPopulatingRef.current) {
      form.setValue("location.panchayat_id", "");
      form.setValue("location.panchayat_code", "");
      form.setValue("location.panchayat_name", "");
      form.setValue("location.village_id", []);
    }
    previousPanchayatRef.current = blockCode;
  }, [blockCode, form]);

  useEffect(() => {
    if (!panchayatCode || panchayatCode === previousPanchayatCodeRef.current)
      return;
    if (hasPopulatedRef.current && !isPopulatingRef.current) {
      form.setValue("location.village_id", []);
    }
    previousPanchayatCodeRef.current = panchayatCode;
  }, [panchayatCode, form]);

  useEffect(() => {
    if (
      !localBodyTypeCode ||
      localBodyTypeCode === previousLocalBodyRef.current
    )
      return;
    if (hasPopulatedRef.current && !isPopulatingRef.current) {
      form.setValue("location.local_body_code", "");
      form.setValue("location.local_body_name", "");
      form.setValue("location.local_body_id", "");
      form.setValue("location.ward_id", []);
    }
    previousLocalBodyRef.current = localBodyTypeCode;
    previousLocalBodyCodeRef.current = "";
  }, [localBodyTypeCode, form]);

  useEffect(() => {
    if (!localBodyCode || localBodyCode === previousLocalBodyCodeRef.current)
      return;
    if (hasPopulatedRef.current && !isPopulatingRef.current) {
      form.setValue("location.ward_id", []);
    }
    previousLocalBodyCodeRef.current = localBodyCode;
  }, [localBodyCode, form]);

  useEffect(() => {
    if (!selectedSectorId || selectedSectorId === previousSectorRef.current)
      return;
    if (hasPopulatedRef.current && !isPopulatingRef.current) {
      form.setValue("sub_sector", "");
      form.setValue("permissible_work", []);
    }
    previousSectorRef.current = selectedSectorId;
  }, [selectedSectorId, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submit event triggered");

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
        className="flex flex-col gap-6"
      >
        {/* Area Type Selection */}
        <div className="flex flex-col rounded-2xl gap-5">
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

          {/* Recommender Type and Details */}
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
              <FormItem>
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
              <FormItem className="flex-1">
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

        {/* Location Fields */}
        <div className="flex items-center gap-5 w-full">
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

          {areaType === "RU" && (
            <>
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
              <FormField
                control={form.control}
                name="location.panchayat_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panchayat</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        const selected = panchayatsData?.records.find(
                          (p: any) => p._id === val
                        );
                        form.setValue("location.panchayat_id", val, {
                          shouldDirty: true,
                        });
                        form.setValue(
                          "location.panchayat_code",
                          selected?.panchayat_code || "",
                          { shouldDirty: true }
                        );
                        form.setValue(
                          "location.panchayat_name",
                          selected?.panchayat_name || "",
                          { shouldDirty: true }
                        );
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Panchayat" />
                      </SelectTrigger>
                      <SelectContent>
                        {panchayatsData?.records?.length
                          ? panchayatsData.records.map((p: any) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.panchayat_name}
                              </SelectItem>
                            ))
                          : initialData?.location?.panchayat_id && (
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
                      value: v._id.toString(),
                      label: v.village_name,
                    })) || [];

                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Villages</FormLabel>
                      <MultiSelectWithBadges
                        options={options}
                        values={(field.value || []).filter(Boolean)}
                        onChange={(vals) =>
                          form.setValue(
                            "location.village_id",
                            vals.filter(Boolean),
                            { shouldDirty: true }
                          )
                        }
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
                          { shouldDirty: true }
                        );
                        form.setValue(
                          "location.local_body_name",
                          selected?.local_body_name || "",
                          { shouldDirty: true }
                        );
                        form.setValue(
                          "location.local_body_type_code",
                          selected?.local_body_type_code || "",
                          { shouldDirty: true }
                        );
                        form.setValue(
                          "location.local_body_type_name",
                          selected?.local_body_type_name || "",
                          { shouldDirty: true }
                        );
                        form.setValue(
                          "location.local_body_id",
                          selected?._id || "000000000000000000000000",
                          { shouldDirty: true }
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
                  <FormItem className="flex-1">
                    <FormLabel>Wards</FormLabel>
                    <MultiSelectWithBadges
                      options={
                        wardsData?.records?.map((w: any) => ({
                          value: w._id.toString(),
                          label: w.ward_name,
                        })) || []
                      }
                      values={(field.value || []).filter(Boolean)}
                      onChange={(vals) =>
                        form.setValue(
                          "location.ward_id",
                          vals.filter(Boolean),
                          {
                            shouldDirty: true,
                          }
                        )
                      }
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
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const selected = departments.find((d) => d._id === val);
                    form.setValue("department_id", selected?._id || "", {
                      shouldDirty: true,
                    });
                    form.setValue(
                      "department_name",
                      selected?.department_name || "",
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
                    {deptLoading ? (
                      <SelectItem value="__loading" disabled>
                        Loading departments...
                      </SelectItem>
                    ) : (
                      departments.map((d) => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.department_name}
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
            name="sector_id"
            render={({ field }) => (
              <FormItem>
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
                        <SelectItem key={s._id} value={s._id}>
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

              return (
                <FormItem>
                  <FormLabel>Sub-Sector</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      form.setValue("sub_sector", val, { shouldDirty: true });
                      form.setValue("permissible_work", []);
                    }}
                    value={field.value || ""}
                    disabled={subSectors.length === 0}
                  >
                    <SelectTrigger className="w-[150px] truncate">
                      <SelectValue
                        placeholder={
                          subSectors.length > 0
                            ? "Select Sub-Sector"
                            : "No Sub-Sectors"
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
              <FormLabel>Approved By</FormLabel>
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

        {/* Implementation Agency */}
        <FormField
          control={form.control}
          name="assigned_ia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Implementation Agency</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={(val) => {
                  const selected = implementationAgencies.find(
                    (ia) => ia._id === val
                  );
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
                  {iaLoading ? (
                    <SelectItem value="__loading" disabled>
                      Loading agencies...
                    </SelectItem>
                  ) : (
                    implementationAgencies.map((ia) => (
                      <SelectItem key={ia._id} value={ia._id}>
                        {ia.agency_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
