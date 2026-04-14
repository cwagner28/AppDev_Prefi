"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUom() {
  const result = await query("SELECT * FROM uom ORDER BY id");
  return result.rows;
}

export async function createUom(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  await query("INSERT INTO uom (name, description) VALUES ($1, $2)", [name, description]);
  revalidatePath("/uom");
}

export async function updateUom(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  await query("UPDATE uom SET name=$1, description=$2 WHERE id=$3", [name, description, id]);
  revalidatePath("/uom");
}

export async function deleteUom(id: number) {
  await query("DELETE FROM uom WHERE id=$1", [id]);
  revalidatePath("/uom");
}
