"use client";
import { useState, useEffect } from "react";
import { getUom, createUom, updateUom, deleteUom } from "@/app/actions/uom";

export default function UomPage() {
  const [uoms, setUoms] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  async function load() {
    setUoms(await getUom());
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Units of Measure</h1>

      {/* Add Form */}
      <form action={async (formData) => { await createUom(formData); load(); }} className="flex gap-2 mb-8">
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
          {uoms.map((u) => (
            <tr key={u.id}>
              {editId === u.id ? (
                <>
                  <td className="border p-2">{u.id}</td>
                  <form action={async (formData) => { await updateUom(u.id, formData); setEditId(null); load(); }}>
                    <td className="border p-2"><input name="name" defaultValue={u.name} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2"><input name="description" defaultValue={u.description} className="border p-1 rounded w-full" /></td>
                    <td className="border p-2 flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </td>
                  </form>
                </>
              ) : (
                <>
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.description}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => setEditId(u.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={async () => { await deleteUom(u.id); load(); }} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
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
