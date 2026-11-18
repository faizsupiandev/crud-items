import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteItem } from "@/app/actions";
import { ItemForm } from "@/components/item-form";
import { ToggleButton } from "@/components/toggle-button";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    select: { title: true },
  });

  return { title: item?.title ?? "Item tidak ditemukan" };
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4 py-8 sm:p-8">
      <div>
        <Link href="/items" className="text-sm text-neutral-500 hover:text-brand-600">
          ← Kembali ke daftar
        </Link>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-semibold tracking-tight ${
                item.done ? "text-neutral-400 line-through" : ""
              }`}
            >
              {item.title}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {item.done ? "Selesai" : "Terbuka"} · dibuat{" "}
              {item.createdAt.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-neutral-400">
              terakhir diperbarui {item.updatedAt.toLocaleString("id-ID")}
            </p>
          </div>
          <ToggleButton id={item.id} done={item.done} />
        </div>

        {item.description ? (
          <p className="mt-4 whitespace-pre-line text-sm text-neutral-700">
            {item.description}
          </p>
        ) : (
          <p className="mt-4 text-sm italic text-neutral-400">
            Tidak ada deskripsi.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Edit item
        </h2>
        <ItemForm
          mode="edit"
          id={item.id}
          title={item.title}
          description={item.description ?? ""}
        />
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Hapus item
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Tindakan ini permanen dan tidak bisa dibatalkan.
        </p>
        <form action={deleteItem.bind(null, item.id)} className="mt-3">
          <button
            type="submit"
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Hapus item ini
          </button>
        </form>
      </section>
    </main>
  );
}
