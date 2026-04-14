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

  async function load() {
    setTests(await getMedicalTests());
    setUoms(await getUom());
    setCategories(await getTestCategories());
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Medical Tests</h1>

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
      <table className="w-full border-collapse border text-sm">
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
                  <form action={async (formData) => { await updateMedicalTest(t.id, formData); setEditId(null); load(); }}>
                    <td className="border p-2"><input name="name" defaultValue={t.name} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2">
                      <select name="idcategory" defaultValue={t.idcategory} className="border p-1 rounded">
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="border p-2">
                      <select name="iduom" defaultValue={t.iduom} className="border p-1 rounded">
                        {uoms.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </td>
                    <td className="border p-2"><input name="normalmin" defaultValue={t.normalmin} type="number" step="any" className="border p-1 rounded w-20" /></td>
                    <td className="border p-2"><input name="normalmax" defaultValue={t.normalmax} type="number" step="any" className="border p-1 rounded w-20" /></td>
                    <td className="border p-2 flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </td>
                  </form>
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
                    <button onClick={() => setEditId(t.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
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
