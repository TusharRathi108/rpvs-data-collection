//* file imports
import BankMasterForm from "@/components/forms/bank-form";
import ProposalForm from "@/components/forms/proposal-form";
import BudgetHeadForm from "@/components/forms/budget-form";
import ImplementationAgencyForm from "@/components/forms/ia-form";
import DepartmentMasterForm from "@/components/forms/department-form";

import {
    budgetHeadColumns,
    bankHeadColumns,
    getProposalColumns,
    getDepartmentColumns,
    getImplementationAgencyColumns,
} from "@/components/data-table/columns";

//* Factory function for building tab based on role
export const getTabOptions = (roleName?: string) => {
    const baseTabs = {
        "budget-master": {
            label: "BUDGET MASTER",
            searchKey: "district_name",
            form: BudgetHeadForm,
            columns: budgetHeadColumns,
        },
        "bank-master": {
            label: "BANK MASTER",
            searchKey: "bank_name",
            form: BankMasterForm,
            columns: bankHeadColumns,
        },
    };

    if (roleName === "District") {
        return {
            "proposal-master": {
                label: "PROPOSAL MASTER",
                searchKey: "proposal_name",
                form: ProposalForm,
                columns: getProposalColumns,
            },
            ...baseTabs,
        } as const;
    }

    if (roleName === "Planning") {
        return {
            ...baseTabs,
            "department-master": {
                label: "DEPARTMENT MASTER",
                searchKey: "department_name",
                form: DepartmentMasterForm,
                columns: getDepartmentColumns,
            },
            "ia-master": {
                label: "IMPLEMENTATION AGENCY MASTER",
                searchKey: "agency_name",
                form: ImplementationAgencyForm,
                columns: getImplementationAgencyColumns,
            },
        } as const;
    }

    return baseTabs;
};