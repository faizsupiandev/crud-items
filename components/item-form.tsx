"use client";

import { useActionState, useMemo } from "react";
import { createItem, updateItem, type ActionState } from "@/app/actions";

const initialState: ActionState = { error: null };

type ItemFormProps =
  | { mode: "create" }
  | { mode: "edit"; id: string; title: string; description: string };

export function ItemForm(props: ItemFormProps) {
  const editId = props.mode === "edit" ? props.id : null;

  const action = useMemo(
    () => (editId ? updateItem.bind(null, editId) : createItem),
    [editId],
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  const defaultTitle = props.mode === "edit" ? props.title : "";
  const defaultDescription = props.mode === "edit" ? props.description : "";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Judul
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={defaultTitle}
          placeholder="Contoh: Beli kopi"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Deskripsi <span className="text-neutral-400">(opsional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultDescription}
          placeholder="Detail singkat item ini"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? "Menyimpan..."
          : props.mode === "create"
            ? "Tambah item"
            : "Simpan perubahan"}
      </button>
    </form>
  );
}
