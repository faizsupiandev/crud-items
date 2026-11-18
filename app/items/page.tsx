import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { deleteItem } from "@/app/actions";
import { ItemForm } from "@/components/item-form";
import { ToggleButton } from "@/components/toggle-button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function ItemsPage({ searchParams }: PageProps) {
  const { q: rawQ, status: rawStatus } = await searchParams;

  const q = (rawQ ?? "").trim();
  const status =
    rawStatus === "open" || rawStatus === "done" ? rawStatus : "all";

  const where: Prisma.ItemWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status === "open") where.done = false;
  if (status === "done") where.done = true;

  const [items, total, doneCount] = await Promise.all([
    prisma.item.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.item.count(),
    prisma.item.count({ where: { done: true } }),
  ]);

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4 py-8 sm:p-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Item</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {total} item total · {doneCount} selesai · {total - doneCount} terbuka
        </p>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Tambah item baru
        </h2>
        <ItemForm mode="create" />
      </section>

      <section className="space-y-4">
        <form className="flex flex-col gap-2 sm:flex-row" action="/items">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari judul atau deskripsi..."
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600"
          >
            <option value="all">Semua</option>
            <option value="open">Terbuka</option>
            <option value="done">Selesai</option>
          </select>
          <button
            type="submit"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-brand-600 hover:text-brand-600"
          >
            Filter
          </button>
          {q || status !== "all" ? (
            <Link
              href="/items"
              className="rounded-lg px-4 py-2 text-center text-sm text-neutral-500 hover:text-neutral-900"
            >
              Reset
            </Link>
          ) : null}
        </form>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            {q || status !== "all"
              ? "Tidak ada item yang cocok dengan filter."
              : "Belum ada item. Tambahkan item pertama di atas."}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/items/${item.id}`}
                      className={`font-medium hover:text-brand-600 ${
                        item.done
                          ? "text-neutral-400 line-through"
                          : "text-neutral-900"
                      }`}
                    >
                      {item.title}
                    </Link>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-neutral-400">
                      {item.done ? "Selesai" : "Terbuka"} ·{" "}
                      {item.createdAt.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      item.done
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.done ? "Selesai" : "Terbuka"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ToggleButton id={item.id} done={item.done} />
                  <Link
                    href={`/items/${item.id}`}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-700 hover:border-brand-600 hover:text-brand-600"
                  >
                    Detail / Edit
                  </Link>
                  <form action={deleteItem.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
