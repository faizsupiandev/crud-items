"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export type ActionState = { error: string | null };

export async function createItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) {
    return { error: "Judul wajib diisi." };
  }
  if (title.length > 200) {
    return { error: "Judul maksimal 200 karakter." };
  }

  await prisma.item.create({
    data: { title, description: description || null },
  });

  revalidatePath("/items");
  redirect("/items");
}

export async function updateItem(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) {
    return { error: "Judul wajib diisi." };
  }
  if (title.length > 200) {
    return { error: "Judul maksimal 200 karakter." };
  }

  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Item tidak ditemukan." };
  }

  await prisma.item.update({
    where: { id },
    data: { title, description: description || null },
  });

  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
  redirect(`/items/${id}`);
}

export async function toggleItem(id: string, done: boolean) {
  await prisma.item.update({ where: { id }, data: { done } });
  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath("/items");
  redirect("/items");
}
