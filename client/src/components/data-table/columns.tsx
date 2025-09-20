//* package imports
import { ArrowUpDown } from "lucide-react";
import { MdEditSquare } from "react-icons/md";
import { type ColumnDef, type Row } from "@tanstack/react-table";

//* file imports
import { Button } from "@/components/ui/button";
import type { ProposalFormValues } from "@/schemas/proposal.schema";

//? Budget Head Types and Columns
type BudgetHead = {
  _id: string;
  district_id: string;
  district_code: string;
  district_name: string;
  financial_year: string;
  sanction_number: string;
  allocated_budget: number;
  sanctioned_budget: number;
  sanctioned_budget_date: string;
  // released_budget: number;
  // release_budget_date: string;
  // allocated_budget_date: string;
};

const budgetHeadColumns = (
  onEdit: (row: BudgetHead) => void,
  editingRow?: BudgetHead | null
): ColumnDef<BudgetHead>[] => [
  {
    accessorKey: "district_name",
    header: () => <div className="text-center">District</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("district_name")}</div>
    ),
  },
  {
    accessorKey: "financial_year",
    header: () => <div className="text-center">Financial Year</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("financial_year")}</div>
    ),
  },
  {
    accessorKey: "sanction_number",
    header: () => <div className="text-center">Sanction Number</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("sanction_number")}</div>
    ),
  },
  {
    accessorKey: "allocated_budget",
    header: ({ column }) => (
      <div className="text-center w-full">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Allocated Budget
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("allocated_budget"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "sanctioned_budget",
    header: ({ column }) => (
      <div className="text-center w-full">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sanctioned Budget
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sanctioned_budget"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="text-center">{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "released_budget",
  //   header: ({ column }) => (
  //     <div className="text-center w-full">
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Released Budget
  //         <ArrowUpDown />
  //       </Button>
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("released_budget"));
  //     const formatted = new Intl.NumberFormat("en-IN", {
  //       style: "currency",
  //       currency: "INR",
  //     }).format(amount);
  //     return <div className="text-center">{formatted}</div>;
  //   },
  // },
  {
    accessorKey: "sanctioned_budget_date",
    header: () => <div className="text-center">Sanction Budget Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("sanctioned_budget_date"));
      const formatted = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const isEditing = editingRow?._id === row.original._id;

      return (
        <div className="flex justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            className={
              isEditing
                ? "text-red-600 hover:text-red-800"
                : "text-green-600 hover:text-green-800"
            }
          >
            {isEditing ? "Cancel" : <MdEditSquare size={20} />}
          </Button>
        </div>
      );
    },
  },
];

//? Bank Details Types and Dynamic Columns
type BankDetails = {
  _id: string;
  district_id: string;
  district_code: string;
  district_name: string;
  agency_code?: string;
  agency_name?: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  branch_code: string;
};

const bankHeadColumns = (
  userRole: string,
  onEdit: (row: BankDetails) => void,
  editingRow?: BankDetails | null
): ColumnDef<BankDetails>[] => {
  const baseColumns: ColumnDef<BankDetails>[] = [
    {
      accessorKey: "district_name",
      header: () => <div className="text-center">District</div>,
      cell: ({ row }: { row: Row<BankDetails> }) => (
        <div className="text-center">{row.getValue("district_name")}</div>
      ),
    },
    {
      accessorKey: "bank_name",
      header: () => <div className="text-center">Bank Name</div>,
      cell: ({ row }: { row: Row<BankDetails> }) => (
        <div className="text-center">{row.getValue("bank_name")}</div>
      ),
    },
    {
      accessorKey: "account_number",
      header: () => <div className="text-center">Account Number</div>,
      cell: ({ row }: { row: Row<BankDetails> }) => (
        <div className="text-center">{row.getValue("account_number")}</div>
      ),
    },
    {
      accessorKey: "ifsc_code",
      header: () => <div className="text-center">IFSC Code</div>,
      cell: ({ row }: { row: Row<BankDetails> }) => (
        <div className="text-center">{row.getValue("ifsc_code")}</div>
      ),
    },
    {
      accessorKey: "branch_name",
      header: () => <div className="text-center">Branch Name</div>,
      cell: ({ row }: { row: Row<BankDetails> }) => (
        <div className="text-center">{row.getValue("branch_name")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const isEditing = editingRow?._id === row.original._id;

        return (
          <div className="flex justify-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              className={
                isEditing
                  ? "text-red-600 hover:text-red-800"
                  : "text-green-600 hover:text-green-800"
              }
            >
              {isEditing ? "Cancel" : <MdEditSquare size={20} />}
            </Button>
          </div>
        );
      },
    },
  ];

  if (userRole !== "Planning") {
    baseColumns.splice(
      1,
      0,
      {
        accessorKey: "agency_code",
        header: () => <div className="text-center">Agency Code</div>,
        cell: ({ row }: { row: Row<BankDetails> }) => (
          <div className="text-center">{row.getValue("agency_code")}</div>
        ),
      },
      {
        accessorKey: "agency_name",
        header: () => <div className="text-center">Agency Name</div>,
        cell: ({ row }: { row: Row<BankDetails> }) => (
          <div className="text-center">{row.getValue("agency_name")}</div>
        ),
      }
    );
  }

  return baseColumns;
};

interface ProposalMaster {
  _id: string;
  sector_id: string;
  nodal_minister?: string;
  reference_number: string;
  manual_reference_number?: string;
  recommender_name: string;
  recommender_contact: number;
  recommender_email: string;
  recommender_type: "MLA" | "OTHER";
  recommender_designation?: string;
  area_type: "RU" | "UR";
  proposal_name: string;
  sector_name: string;
  sub_sector_name: string;
  permissible_work: string[];
  proposal_amount: number;
  approved_by_dlc: boolean;
  approved_by_nm: boolean;
  location: ProposalFormValues["location"];
}

const getProposalColumns = (
  onEdit: (row: ProposalMaster) => void
): ColumnDef<ProposalMaster>[] => [
  {
    accessorKey: "proposal_name",
    header: () => <div className="text-center">Proposal Name</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("proposal_name")}</div>
    ),
  },
  {
    accessorKey: "reference_number",
    header: () => <div className="text-center">Reference #</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("reference_number")}</div>
    ),
  },
  {
    accessorKey: "manual_reference_number",
    header: () => <div className="text-center">Manual Ref #</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("manual_reference_number") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "recommender_name",
    header: () => <div className="text-center">Recommender</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("recommender_name")}</div>
    ),
  },
  {
    accessorKey: "recommender_contact",
    header: () => <div className="text-center">Contact</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("recommender_contact")}</div>
    ),
  },
  {
    accessorKey: "recommender_email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("recommender_email")}</div>
    ),
  },
  {
    accessorKey: "sector_name",
    header: () => <div className="text-center">Sector</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("sector_name")}</div>
    ),
  },
  {
    accessorKey: "sub_sector_name",
    header: () => <div className="text-center">Sub-Sector</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("sub_sector_name") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "permissible_work",
    header: () => <div className="text-center">Works</div>,
    cell: ({ row }) => {
      const works = row.getValue("permissible_work") as string[];
      return (
        <div className="text-center">
          {works && works.length > 0 ? works.join(", ") : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "proposal_amount",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount (₹)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("proposal_amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "approved_by_dlc",
    header: () => <div className="text-center">DLC Approved</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("approved_by_dlc") ? "✅" : "❌"}
      </div>
    ),
  },
  {
    accessorKey: "approved_by_nm",
    header: () => <div className="text-center">NM Approved</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("approved_by_nm") ? "✅" : "❌"}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center">Location</div>,
    cell: ({ row }) => {
      const loc = row.original.location;
      const parts = [
        loc?.district_name,
        loc?.constituency_name,
        loc?.block_name,
        loc?.panchayat_name,
        loc?.local_body_name,
      ].filter(Boolean);
      return <div className="text-center">{parts.join(" › ") || "—"}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: Row<ProposalMaster> }) => (
      <div className="flex justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          className="text-green-600 hover:text-green-800"
        >
          <MdEditSquare size={20} />
        </Button>
      </div>
    ),
  },
];

type Department = {
  _id: string;
  department_name: string;
  contact_person: string;
  contact_number: string;
  contact_email: string;
};

const getDepartmentColumns = (
  onEdit: (row: Department) => void
): ColumnDef<Department>[] => [
  {
    accessorKey: "department_name",
    header: () => <div className="text-center">Department</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("department_name")}</div>
    ),
  },
  {
    accessorKey: "contact_person",
    header: () => <div className="text-center">Contact Person</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("contact_person")}</div>
    ),
  },
  {
    accessorKey: "contact_number",
    header: () => <div className="text-center">Contact Number</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("contact_number")}</div>
    ),
  },
  {
    accessorKey: "contact_email",
    header: () => <div className="text-center">Contact Email</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("contact_email")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: Row<Department> }) => (
      <div className="flex justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          className="text-green-600 hover:text-green-800"
        >
          <MdEditSquare size={20} />
        </Button>
      </div>
    ),
  },
];

type ImplementationAgency = {
  _id: string;
  financial_year: string;
  district_name: string;
  block_name: string;
  agency_name: string;
  contact_person?: string;
  contact_number?: string;
  contact_email?: string;
};

const getImplementationAgencyColumns = (
  onEdit: (row: ImplementationAgency) => void
): ColumnDef<ImplementationAgency>[] => [
  {
    accessorKey: "financial_year",
    header: () => <div className="text-center">Financial Year</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("financial_year")}</div>
    ),
  },
  {
    accessorKey: "district_name",
    header: () => <div className="text-center">District</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("district_name")}</div>
    ),
  },
  {
    accessorKey: "block_name",
    header: () => <div className="text-center">Block</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("block_name")}</div>
    ),
  },
  {
    accessorKey: "agency_name",
    header: () => <div className="text-center">Agency Name</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("agency_name")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: Row<ImplementationAgency> }) => (
      <div className="flex justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
          className="text-green-600 hover:text-green-800"
        >
          <MdEditSquare size={20} />
        </Button>
      </div>
    ),
  },
];

export {
  type BudgetHead,
  budgetHeadColumns,
  type BankDetails,
  bankHeadColumns,
  type ProposalMaster,
  getProposalColumns,
  type Department,
  getDepartmentColumns,
  type ImplementationAgency,
  getImplementationAgencyColumns,
};
