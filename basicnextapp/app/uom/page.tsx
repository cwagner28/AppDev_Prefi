"use client";
import { useState, useEffect } from "react";
import { getUom, createUom, updateUom, deleteUom } from "@/app/actions/uom";

export default function UomPage() {
  const [uoms, setUoms] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function load() {
    setUoms(await getUom());
  }

  useEffect(() => { load(); }, []);

  function startEdit(u: any) {
    setEditId(u.id);
    setEditName(u.name ?? "");
    setEditDescription(u.description ?? "");
    setErrorMessage("");
  }

  async function saveEdit(id: number) {
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("description", editDescription);
    await updateUom(id, formData);
    setEditId(null);
    await load();
  }

  async function handleDelete(id: number) {
    const result = await deleteUom(id);
    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }
    setErrorMessage("");
    await load();
  }

  async function downloadExcel() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Units of Measure");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Description", key: "description", width: 40 },
    ];

    uoms.forEach((u) => {
      worksheet.addRow({
        id: u.id,
        name: u.name ?? "",
        description: u.description ?? "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "uom.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="print-page p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Units of Measure</h1>
        <div className="no-print flex gap-2">
          <button
            type="button"
            onClick={downloadExcel}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Download to Excel
          </button>
          <button
            type="button"
            onClick={printPdf}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Print to PDF
          </button>
        </div>
      </div>
      {errorMessage ? <p className="mb-4 text-red-600">{errorMessage}</p> : null}

      {/* Add Form */}
      <form action={async (formData) => { await createUom(formData); load(); }} className="flex gap-2 mb-8">
        <input name="name" placeholder="Name" required className="border p-2 rounded w-32" />
        <input name="description" placeholder="Description" className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      {/* Table */}
      <table className="print-table w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uoms.map((u) => (
            <tr key={u.id}>
              {editId === u.id ? (
                <>
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-1 rounded w-full" /></td>
                  <td className="border p-2"><input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border p-1 rounded w-full" /></td>
                  <td className="border p-2 flex gap-2">
                    <button type="button" onClick={() => saveEdit(u.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.description}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => startEdit(u)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
