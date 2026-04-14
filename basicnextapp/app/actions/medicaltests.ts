"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMedicalTests() {
  const result = await query(`
    SELECT mt.id, mt.name, mt.description, mt.normalmin, mt.normalmax,
      tc.name AS category, u.name AS unit,
      mt.idcategory, mt.iduom
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u ON mt.iduom = u.id
    ORDER BY mt.id
  `);
  return result.rows;
}

export async function createMedicalTest(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const iduom = formData.get("iduom") as string;
  const idcategory = formData.get("idcategory") as string;
  const normalmin = formData.get("normalmin") as string;
  const normalmax = formData.get("normalmax") as string;
  await query(
    "INSERT INTO medicaltests (name, description, iduom, idcategory, normalmin, normalmax) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, description, iduom, idcategory, normalmin, normalmax]
  );
  revalidatePath("/medicaltests");
}

export async function updateMedicalTest(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const iduom = formData.get("iduom") as string;
  const idcategory = formData.get("idcategory") as string;
  const normalmin = formData.get("normalmin") as string;
  const normalmax = formData.get("normalmax") as string;
  await query(
    "UPDATE medicaltests SET name=$1, description=$2, iduom=$3, idcategory=$4, normalmin=$5, normalmax=$6 WHERE id=$7",
    [name, description, iduom, idcategory, normalmin, normalmax, id]
  );
  revalidatePath("/medicaltests");
}

export async function deleteMedicalTest(id: number) {
  await query("DELETE FROM medicaltests WHERE id=$1", [id]);
  revalidatePath("/medicaltests");
}
