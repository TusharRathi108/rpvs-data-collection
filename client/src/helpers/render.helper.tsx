//* file imports
import { DataTable } from "@/components/data-table/data-table";
import PageLoader from "@/components/mini-components/page-loader";

type TabOptions = ReturnType<typeof import("@/utils/tab-config").getTabOptions>;

export const renderForm = ({
  activeTab,
  TAB_OPTIONS,
  districts,
  districtsLoading,
  editingRow,
  selectedRow,
  cancelEdit,
  setSelectedRow,
}: {
  activeTab: keyof TabOptions;
  TAB_OPTIONS: TabOptions;
  districts: any[];
  districtsLoading: boolean;
  editingRow: any;
  selectedRow: any;
  cancelEdit: () => void;
  setSelectedRow: (val: any) => void;
}) => {
  const { form: FormComponent } = TAB_OPTIONS[activeTab];
  if (!FormComponent) return null;

  return (
    <FormComponent
      districts={districts}
      isLoading={districtsLoading}
      initialData={editingRow || selectedRow}
      onSuccess={() => {
        cancelEdit();
        setSelectedRow(null);
      }}
    />
  );
};

// ---------- Render Table ----------
export const renderTable = ({
  activeTab,
  TAB_OPTIONS,
  tableData,
  editingRow,
  handleToggleEdit,
  setSelectedRow,
  loadingStates,
}: {
  activeTab: keyof TabOptions;
  TAB_OPTIONS: TabOptions;
  tableData: any[];
  editingRow: any;
  handleToggleEdit: (row: any) => void;
  setSelectedRow: (val: any) => void;
  loadingStates: Record<string, boolean>;
}) => {
  const { columns, searchKey } = TAB_OPTIONS[activeTab];

  if (loadingStates[activeTab]) return <PageLoader />;

  return (
    <DataTable
      columns={columns((row: any) => {
        if (activeTab === "budget-master" || activeTab === "bank-master") {
          handleToggleEdit(row);
        } else {
          setSelectedRow(row);
        }
      }, editingRow)}
      data={tableData}
      searchKey={searchKey}
      showPagination
    />
  );
};
