"use client";

import { useTransition } from "react";
import { toggleItem } from "@/app/actions";

export function ToggleButton({ id, done }: { id: string; done: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleItem(id, !done))}
      className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-brand-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {done ? "Buka lagi" : "Tandai selesai"}
    </button>
  );
}
