//* package imports
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectWithBadges } from "../mini-components/multi-select";

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
    state_id: "",
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

  // console.log("USER: ", user);
  // console.log(initialData);

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
          district_id: selectedDistrictId || null,
          block_id: normalizeObjectId(values.location.block_id),
          panchayat_id: normalizeObjectId(values.location.panchayat_id),
          local_body_id: normalizeObjectId(values.location.local_body_id),
        },
      };

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

        <FormField
          control={form.control}
          name="proposal_name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Proposal Name</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter proposal name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      onValueChange={(val) => {
                        // set block
                        form.setValue("location.block_code", val, {
                          shouldDirty: true,
                        });

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
                      }}
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

                        // reset villages
                        form.setValue("location.village_id", [], {
                          shouldDirty: true,
                        });
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Panchayat" />
                      </SelectTrigger>
                      <SelectContent>
                        {panchayatsData?.records?.map((p: any) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.panchayat_name}
                          </SelectItem>
                        ))}
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
                      onValueChange={(val) => {
                        form.setValue("location.local_body_type_code", val, {
                          shouldDirty: true,
                        });

                        // reset dependent
                        form.setValue("location.local_body_code", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.local_body_name", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.local_body_id", "", {
                          shouldDirty: true,
                        });
                        form.setValue("location.ward_id", [], {
                          shouldDirty: true,
                        });
                      }}
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
                        if (selected) {
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
                            "location.local_body_id",
                            selected._id.toString(),
                            { shouldDirty: true }
                          );
                        }
                        // reset wards
                        form.setValue("location.ward_id", [], {
                          shouldDirty: true,
                        });
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Local Body" />
                      </SelectTrigger>
                      <SelectContent>
                        {localBodiesData?.records?.map((lb: any) => (
                          <SelectItem key={lb._id} value={lb.local_body_code}>
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

                    // reset sub-sector & works
                    form.setValue("sub_sector", "", { shouldDirty: true });
                    form.setValue("permissible_work", [], {
                      shouldDirty: true,
                    });
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorsData?.records?.map((s: any) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.sector_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
