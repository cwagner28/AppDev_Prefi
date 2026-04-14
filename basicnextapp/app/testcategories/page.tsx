"use client";
import { useState, useEffect } from "react";
import { getTestCategories, createTestCategory, updateTestCategory, deleteTestCategory } from "@/app/actions/testcategories";

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  async function load() {
    setCategories(await getTestCategories());
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Categories</h1>

      {/* Add Form */}
      <form action={async (formData) => { await createTestCategory(formData); load(); }} className="flex gap-2 mb-8">
        <input name="name" placeholder="Name" required className="border p-2 rounded w-32" />
        <input name="description" placeholder="Description" className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              {editId === c.id ? (
                <>
                  <td className="border p-2">{c.id}</td>
                  <form action={async (formData) => { await updateTestCategory(c.id, formData); setEditId(null); load(); }}>
                    <td className="border p-2"><input name="name" defaultValue={c.name} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2"><input name="description" defaultValue={c.description} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2 flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </td>
                  </form>
                </>
              ) : (
                <>
                  <td className="border p-2">{c.id}</td>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.description}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => setEditId(c.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={async () => { await deleteTestCategory(c.id); load(); }} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
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
