"use client";
import { useState, useEffect } from "react";
import { getMedicalTests, createMedicalTest, updateMedicalTest, deleteMedicalTest } from "@/app/actions/medicaltests";
import { getUom } from "@/app/actions/uom";
import { getTestCategories } from "@/app/actions/testcategories";

export default function MedicalTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [uoms, setUoms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editUomId, setEditUomId] = useState("");
  const [editNormalMin, setEditNormalMin] = useState("");
  const [editNormalMax, setEditNormalMax] = useState("");

  async function load() {
    setTests(await getMedicalTests());
    setUoms(await getUom());
    setCategories(await getTestCategories());
  }

  useEffect(() => { load(); }, []);

  function startEdit(test: any) {
    setEditId(test.id);
    setEditName(test.name ?? "");
    setEditDescription(test.description ?? "");
    setEditCategoryId(String(test.idcategory ?? ""));
    setEditUomId(String(test.iduom ?? ""));
    setEditNormalMin(String(test.normalmin ?? ""));
    setEditNormalMax(String(test.normalmax ?? ""));
  }

  async function saveEdit(id: number) {
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("description", editDescription);
    formData.set("idcategory", editCategoryId);
    formData.set("iduom", editUomId);
    formData.set("normalmin", editNormalMin);
    formData.set("normalmax", editNormalMax);
    await updateMedicalTest(id, formData);
    setEditId(null);
    await load();
  }

  async function downloadExcel() {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medical Tests");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Category", key: "category", width: 30 },
      { header: "Unit", key: "unit", width: 20 },
      { header: "Min", key: "normalmin", width: 15 },
      { header: "Max", key: "normalmax", width: 15 },
    ];

    tests.forEach((t) => {
      worksheet.addRow({
        id: t.id,
        name: t.name ?? "",
        category: t.category ?? "",
        unit: t.unit ?? "",
        normalmin: t.normalmin ?? "",
        normalmax: t.normalmax ?? "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medical-tests.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="print-page p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Medical Tests</h1>
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

      {/* Add Form */}
      <form action={async (formData) => { await createMedicalTest(formData); load(); }} className="flex flex-wrap gap-2 mb-8">
        <input name="name" placeholder="Test Name" required className="border p-2 rounded w-48" />
        <input name="description" placeholder="Description" className="border p-2 rounded flex-1" />
        <select name="idcategory" required className="border p-2 rounded">
          <option value="">Category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="iduom" required className="border p-2 rounded">
          <option value="">Unit</option>
          {uoms.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <input name="normalmin" placeholder="Min" type="number" step="any" className="border p-2 rounded w-20" />
        <input name="normalmax" placeholder="Max" type="number" step="any" className="border p-2 rounded w-20" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      {/* Table */}
      <table className="print-table w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Category</th>
            <th className="border p-2 text-left">Unit</th>
            <th className="border p-2 text-left">Min</th>
            <th className="border p-2 text-left">Max</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id}>
              {editId === t.id ? (
                <>
                  <td className="border p-2">{t.id}</td>
                  <td className="border p-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-1 rounded w-full" /></td>
                  <td className="border p-2">
                    <select value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)} className="border p-1 rounded">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </td>
                  <td className="border p-2">
                    <select value={editUomId} onChange={(e) => setEditUomId(e.target.value)} className="border p-1 rounded">
                      {uoms.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </td>
                  <td className="border p-2"><input value={editNormalMin} onChange={(e) => setEditNormalMin(e.target.value)} type="number" step="any" className="border p-1 rounded w-20" /></td>
                  <td className="border p-2"><input value={editNormalMax} onChange={(e) => setEditNormalMax(e.target.value)} type="number" step="any" className="border p-1 rounded w-20" /></td>
                  <td className="border p-2 flex gap-2">
                    <button type="button" onClick={() => saveEdit(t.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{t.id}</td>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">{t.category}</td>
                  <td className="border p-2">{t.unit}</td>
                  <td className="border p-2">{t.normalmin}</td>
                  <td className="border p-2">{t.normalmax}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => startEdit(t)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={async () => { await deleteMedicalTest(t.id); load(); }} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
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
