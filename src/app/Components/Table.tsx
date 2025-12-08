"use client";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

type TableProps = {
  title?: string;
  endpoint: string;
  columns: {
    field: string;
    header: string;
    sortable?: boolean;
  }[];
  onEdit?: (rowData: any) => void;
  onView?: (rowData: any) => void;
  onDelete?: (rowData: any) => void;
};

export default function Table({
  title,
  endpoint,
  columns,
  onEdit,
  onView,
  onDelete,
}: TableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  // Action Button Handlers
  const handleEdit = (rowData: any) => {
    if (onEdit) onEdit(rowData);
  };

  const handleView = (rowData: any) => {
    if (onView) onView(rowData);
  };

  const handleDelete = (rowData: any) => {
    if (onDelete) onDelete(rowData);
  };

  // Render Action Column
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => handleView(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="card bg-transparent">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black-200">{title}</h2>

        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="p-inputtext-sm"
          />
        </span>
      </div>

      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
        globalFilter={globalFilter}
        emptyMessage="No records found."
        className="p-datatable-sm"
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
          />
        ))}
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>
    </div>
  );
}
