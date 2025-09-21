//* package imports
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

//* hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEditableRow } from "@/hooks/useEditableRow";

//* api services
import { useLogoutMutation } from "@/store/services/auth.api";
import { useGetAllBankHeadsQuery } from "@/store/services/bank-head.api";
import { useGetAllBudgetHeadsQuery } from "@/store/services/budget-head.api";
import { useGetAllDepartmentsQuery } from "@/store/services/department.api";
import { useGetAllImplementationAgenciesQuery } from "@/store/services/ia.api";
import { useGetAllProposalsQuery } from "@/store/services/proposal.api";
import { useFetchDistrictsQuery } from "@/store/services/location.api";

//* store/slices
import { clearUser } from "@/store/slices/auth-slice";

//* ui components
import CardWrapper from "@/components/card-wrapper";
import { DataTable } from "@/components/data-table/data-table";
import BankMasterForm from "@/components/forms/bank-form";
import BudgetHeadForm from "@/components/forms/budget-form";
import DepartmentMasterForm from "@/components/forms/department-form";
import ImplementationAgencyForm from "@/components/forms/ia-form";
import ProposalForm from "@/components/forms/proposal-form";
import PageLoader from "@/components/mini-components/page-loader";

//* data table columns & types
import {
  bankHeadColumns,
  budgetHeadColumns,
  getDepartmentColumns,
  getImplementationAgencyColumns,
  getProposalColumns,
  type BankDetails,
  type BudgetHead,
  type Department,
  type ImplementationAgency,
  type ProposalMaster,
} from "@/components/data-table/columns";

const getTabOptions = (roleName?: string) => {
  if (roleName === "District") {
    return {
      "proposal-master": {
        label: "PROPOSAL MASTER",
        form: ProposalForm,
        searchKey: "proposal_name",
      },
      "bank-master": {
        label: "BANK MASTER",
        form: BankMasterForm,
        searchKey: "bank_name",
      },
    } as const;
  }

  if (roleName === "Planning") {
    return {
      "budget-master": {
        label: "BUDGET MASTER",
        form: BudgetHeadForm,
        searchKey: "district_name",
      },
      "bank-master": {
        label: "BANK MASTER",
        form: BankMasterForm,
        searchKey: "bank_name",
      },
      "department-master": {
        label: "DEPARTMENT MASTER",
        form: DepartmentMasterForm,
        searchKey: "department_name",
      },
      "ia-master": {
        label: "IMPLEMENTATION AGENCY MASTER",
        form: ImplementationAgencyForm,
        searchKey: "agency_name",
      },
    } as const;
  }

  return {
    "budget-master": {
      label: "BUDGET MASTER",
      form: BudgetHeadForm,
      searchKey: "district_name",
    },
    "bank-master": {
      label: "BANK MASTER",
      form: BankMasterForm,
      searchKey: "bank_name",
    },
  } as const;
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { data: districtsData, isLoading: districtsLoading } =
    useFetchDistrictsQuery(user?.state_code ?? "", { skip: !user?.state_code });

  const TAB_OPTIONS = useMemo(() => getTabOptions(user?.role_name), [user]);

  const [bankTableData, setBankTableData] = useState<BankDetails[]>([]);
  const [budgetTableData, setBudgetTableData] = useState<BudgetHead[]>([]);
  const [iaTableData, setIATableData] = useState<ImplementationAgency[]>([]);
  const [proposalTableData, setProposalTableData] = useState<ProposalMaster[]>(
    []
  );
  const [departmentTableData, setDepartmentTableData] = useState<Department[]>(
    []
  );

  const {
    editingRow: editingBudget,
    handleToggleEdit: handleBudgetEdit,
    cancelEdit: cancelBudgetEdit,
  } = useEditableRow<BudgetHead>();

  const {
    editingRow: editingBank,
    handleToggleEdit: handleBankEdit,
    cancelEdit: cancelBankEdit,
  } = useEditableRow<BankDetails>();

  const {
    editingRow: editingDepartment,
    handleToggleEdit: handleDepartmentEdit,
    cancelEdit: cancelDepartmentEdit,
  } = useEditableRow<Department>();

  const {
    editingRow: editingIA,
    handleToggleEdit: handleIAEdit,
    cancelEdit: cancelIAEdit,
  } = useEditableRow<ImplementationAgency>();

  const [activeTab, setActiveTab] = useState<keyof typeof TAB_OPTIONS>(
    Object.keys(TAB_OPTIONS)[0] as keyof typeof TAB_OPTIONS
  );

  const [selectedProposal, setSelectedProposal] =
    useState<ProposalMaster | null>(null);
  const handleEditProposal = (row: ProposalMaster) => setSelectedProposal(row);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const {
    data: budgetHeadsData,
    isLoading: budgetHeadsLoading,
    error: budgetHeadsError,
  } = useGetAllBudgetHeadsQuery();

  const {
    data: bankHeadsData,
    isLoading: bankHeadsLoading,
    error: bankHeadsError,
  } = useGetAllBankHeadsQuery(
    user?.role_name === "District"
      ? { agency_details: true }
      : { agency_details: false }
  );

  const {
    data: proposalsData,
    isLoading: proposalsLoading,
    error: proposalsError,
  } = useGetAllProposalsQuery();

  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useGetAllDepartmentsQuery();

  const {
    data: iaData,
    isLoading: iaLoading,
    error: iaError,
  } = useGetAllImplementationAgenciesQuery();

  const districts = districtsData?.records || [];

  const processedBudgetHeads: BudgetHead[] = useMemo(
    () =>
      (budgetHeadsData?.records || []).map((h) => ({
        ...h,
        sanction_number: h.sanction_number ?? "N/A",
        allocated_budget_date:
          h.allocated_budget_date ?? new Date().toISOString(),
        sanctioned_budget_date:
          h.sanctioned_budget_date ?? new Date().toISOString(),
        release_budget_date: h.release_budget_date ?? new Date().toISOString(),
      })),
    [budgetHeadsData]
  );

  const processedBankHeads: BankDetails[] = useMemo(
    () => bankHeadsData?.records || [],
    [bankHeadsData]
  );

  const processedProposals: ProposalMaster[] = useMemo(
    () =>
      (proposalsData?.records || []).map((p: any) => ({
        ...p,
        recommender_type: p.recommender_type === "MLA" ? "MLA" : "OTHER",
      })),
    [proposalsData]
  );

  const processedDepartments: Department[] = useMemo(
    () => departmentsData?.records || [],
    [departmentsData]
  );

  const processedIAs: ImplementationAgency[] = useMemo(
    () => iaData?.records || [],
    [iaData]
  );

  useEffect(() => {
    if (budgetHeadsError) console.error(budgetHeadsError);
    if (bankHeadsError) console.error(bankHeadsError);
    if (proposalsError) console.error(proposalsError);
    if (departmentsError) console.error(departmentsError);
    if (iaError) console.error(iaError);
  }, [
    budgetHeadsError,
    bankHeadsError,
    proposalsError,
    departmentsError,
    iaError,
  ]);

  useEffect(() => {
    if (activeTab === "budget-master") {
      setBudgetTableData(processedBudgetHeads);
    } else if (activeTab === "bank-master") {
      setBankTableData(processedBankHeads);
    } else if (activeTab === "proposal-master") {
      setProposalTableData(processedProposals);
    } else if (activeTab === "department-master") {
      setDepartmentTableData(processedDepartments);
    } else if (activeTab === "ia-master") {
      setIATableData(processedIAs);
    }
  }, [
    activeTab,
    processedBudgetHeads,
    processedBankHeads,
    processedProposals,
    processedDepartments,
    processedIAs,
  ]);

  //* logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  //? Render helpers
  const renderForm = () => {
    if (activeTab === "budget-master") {
      return (
        <BudgetHeadForm
          districts={districts}
          isLoading={districtsLoading}
          initialData={editingBudget}
          onSuccess={cancelBudgetEdit}
        />
      );
    }

    if (activeTab === "bank-master") {
      return (
        <BankMasterForm
          districts={districts}
          isLoading={districtsLoading}
          initialData={editingBank}
          onSuccess={cancelBankEdit}
        />
      );
    }

    if (activeTab === "proposal-master") {
      return (
        <ProposalForm
          initialData={
            selectedProposal
              ? {
                  ...selectedProposal,
                  recommender_type:
                    selectedProposal.recommender_type === "MLA"
                      ? "MLA"
                      : "OTHER",
                  area_type: selectedProposal.area_type === "RU" ? "RU" : "UR",

                  // Full LocationSchema mapping
                  location: {
                    area_type:
                      selectedProposal.area_type === "RU" ? "RU" : "UR",
                    district_id: selectedProposal.location?.district_id ?? "",
                    block_id: selectedProposal.location?.block_id ?? "",
                    constituency_id:
                      selectedProposal.location?.constituency_id ?? "",
                    local_body_id:
                      selectedProposal.location?.local_body_id ?? "",
                    panchayat_id: selectedProposal.location?.panchayat_id ?? "",
                    ward_id: selectedProposal.location?.ward_id ?? [],
                    village_id: selectedProposal.location?.village_id ?? [],

                    state_code: selectedProposal.location?.state_code ?? "",
                    state_name: selectedProposal.location?.state_name ?? "",
                    district_code:
                      selectedProposal.location?.district_code ?? "",
                    district_name:
                      selectedProposal.location?.district_name ?? "",
                    block_code: selectedProposal.location?.block_code ?? "",
                    block_name: selectedProposal.location?.block_name ?? "",
                    constituency_code:
                      selectedProposal.location?.constituency_code ?? "",
                    constituency_name:
                      selectedProposal.location?.constituency_name ?? "",

                    local_body_type_code:
                      selectedProposal.location?.local_body_type_code ?? "",
                    local_body_type_name:
                      selectedProposal.location?.local_body_type_name ?? "",
                    local_body_code:
                      selectedProposal.location?.local_body_code ?? "",
                    local_body_name:
                      selectedProposal.location?.local_body_name ?? undefined,

                    panchayat_code:
                      selectedProposal.location?.panchayat_code ?? "",
                    panchayat_name:
                      selectedProposal.location?.panchayat_name ?? "",

                    // ✅ required arrays
                    villages: selectedProposal.location?.villages ?? [],
                    wards: selectedProposal.location?.wards ?? [],
                  },
                }
              : null
          }
          onSuccess={() => setSelectedProposal(null)}
        />
      );
    }

    if (activeTab === "department-master") {
      return (
        <DepartmentMasterForm
          initialData={editingDepartment}
          onSuccess={cancelDepartmentEdit}
          districts={[]}
          isLoading={false}
        />
      );
    }

    if (activeTab === "ia-master") {
      return (
        <ImplementationAgencyForm
          initialData={editingIA}
          onSuccess={cancelIAEdit}
          districts={districts}
          isLoading={districtsLoading}
        />
      );
    }

    return null;
  };

  const renderTable = () => {
    if (activeTab === "budget-master") {
      if (budgetHeadsLoading || districtsLoading) return <PageLoader />;
      return (
        <DataTable
          columns={budgetHeadColumns(handleBudgetEdit, editingBudget)}
          data={budgetTableData}
          searchKey={TAB_OPTIONS[activeTab]?.searchKey ?? ""}
          showPagination
        />
      );
    }

    if (activeTab === "bank-master") {
      if (bankHeadsLoading) return <PageLoader />;
      return (
        <DataTable
          columns={bankHeadColumns(
            user?.role_name || "",
            handleBankEdit,
            editingBank
          )}
          searchKey={TAB_OPTIONS[activeTab]?.searchKey ?? ""}
          data={bankTableData}
          showPagination
        />
      );
    }

    if (activeTab === "proposal-master") {
      if (proposalsLoading) return <PageLoader />;
      return (
        <DataTable
          columns={getProposalColumns((row) => handleEditProposal(row))}
          data={proposalTableData}
          searchKey={TAB_OPTIONS[activeTab]?.searchKey ?? ""}
          showPagination
        />
      );
    }

    if (activeTab === "department-master") {
      if (departmentsLoading) return <PageLoader />;

      return (
        <DataTable
          columns={getDepartmentColumns(
            handleDepartmentEdit,
            editingDepartment
          )}
          data={departmentTableData}
          searchKey={TAB_OPTIONS[activeTab]?.searchKey ?? ""}
          showPagination
        />
      );
    }

    if (activeTab === "ia-master") {
      if (iaLoading) return <PageLoader />;

      return (
        <DataTable
          columns={getImplementationAgencyColumns(handleIAEdit, editingIA)}
          data={iaTableData}
          searchKey={TAB_OPTIONS[activeTab]?.searchKey ?? ""}
          showPagination
        />
      );
    }

    return null;
  };

  return (
    <main className="p-2 flex min-h-screen flex-col gap-2 bg-[radial-gradient(ellipse_at_top,theme(colors.sky.400),theme(colors.blue.800))] text-white">
      <nav className="top-2 flex p-3 items-center justify-between h-[70px] w-full border-none rounded-2xl bg-blue-200/50">
        <p className="bg-blue-800/25 text-xl text-blue-950 rounded-2xl p-3">
          USER: {user?.username}
        </p>{" "}
        <button
          className="bg-red-500/90 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "LOGOUT"}
        </button>
      </nav>

      <div className="flex flex-col items-center gap-2 pt-5 w-full">
        <section className="flex flex-col w-5/6">
          <div className="flex flex-col gap-5 card backdrop-blur-md overflow-hidden">
            <div className="flex p-2 gap-2 bg-white/50 rounded-2xl">
              {Object.entries(TAB_OPTIONS).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`tab-button focus-visible:outline-none rounded-xl text-black flex-1 py-4 text-center font-medium transition-all ${
                    activeTab === key ? "bg-white" : "hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab(key as keyof typeof TAB_OPTIONS)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-1 pt-5">
          <CardWrapper
            className="w-full"
            headerLabel={TAB_OPTIONS[activeTab]?.label}
          >
            {renderForm()}
          </CardWrapper>
        </div>
        <div className="w-full pt-5">{renderTable()}</div>
      </div>
    </main>
  );
};

export default HomePage;
