"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTestCategories() {
  const result = await query("SELECT * FROM testcategories ORDER BY id");
  return result.rows;
}

export async function createTestCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  await query("INSERT INTO testcategories (name, description) VALUES ($1, $2)", [name, description]);
  revalidatePath("/testcategories");
}

export async function updateTestCategory(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  await query("UPDATE testcategories SET name=$1, description=$2 WHERE id=$3", [name, description, id]);
  revalidatePath("/testcategories");
}

export async function deleteTestCategory(id: number) {
  try {
    await query("DELETE FROM testcategories WHERE id=$1", [id]);
    revalidatePath("/testcategories");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "23503") {
      return { error: "Cannot delete: this item is used by a medical test." };
    }
    return { error: "Failed to delete item." };
  }
}
