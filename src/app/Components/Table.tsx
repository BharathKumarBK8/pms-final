"use client";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./Table.css";

type TableProps = {
  title?: string;
  data: any[];
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
  data,
  columns,
  onEdit,
  onView,
  onDelete,
}: TableProps) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex space-x-2">
      {onEdit && (
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => onEdit(rowData)}
        />
      )}
      {onView && (
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => onView(rowData)}
        />
      )}
      {onDelete && (
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => onDelete(rowData)}
        />
      )}
    </div>
  );

  return (
    <>
      <div className="card bg-transparent">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>

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

          {(onEdit || onView || onDelete) && (
            <Column header="Actions" body={actionBodyTemplate} />
          )}
        </DataTable>
      </div>
    </>
  );
}
