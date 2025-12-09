"use client";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import "./Table.css";

type TableProps = {
  title?: string;
  endpoint: string;
  columns: {
    field: string;
    header: string;
    sortable?: boolean;
  }[];
};

export default function Table({ title, endpoint, columns }: TableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const toast = useRef<Toast>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleDelete = async (rowData: any) => {
    confirmDialog({
      message: `Are you sure you want to delete this record?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const res = await fetch(`${endpoint}/${rowData.id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Record deleted successfully",
            });
            fetchData();
          } else {
            throw new Error("Delete failed");
          }
        } catch (err) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete record",
          });
        }
      },
    });
  };

  const handleEdit = (rowData: any) => {
    // Navigate to edit page or open modal
    console.log("Edit:", rowData);
    toast.current?.show({
      severity: "info",
      summary: "Edit",
      detail: `Edit functionality for ID: ${rowData.id}`,
    });
  };

  const handleView = (rowData: any) => {
    console.log("View:", rowData);
    toast.current?.show({
      severity: "info",
      summary: "View",
      detail: `View functionality for ID: ${rowData.id}`,
    });
  };

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
    <>
      <Toast ref={toast} />
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
    </>
  );
}
