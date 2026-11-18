import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Item CRUD",
  description: "Sistem CRUD dasar dengan Next.js 15, Prisma, dan Neon",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
            <Link href="/items" className="font-semibold tracking-tight">
              Item CRUD
            </Link>
            <Link
              href="/items"
              className="text-sm text-neutral-600 hover:text-brand-600"
            >
              Daftar item
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
