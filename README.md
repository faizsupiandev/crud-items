# Item CRUD

Sistem CRUD dasar: tambah, lihat, ubah, hapus item. Dibangun dengan Next.js 15
(App Router), TypeScript, Tailwind CSS v4, Prisma 6, dan PostgreSQL (Neon).

## 1. Install

```bash
npm install
```

Versi sudah dipin di `package.json` (Next 15.5.29, Prisma 6.19.3). Jangan
menjalankan `npm install next prisma` tanpa versi — npm akan mengambil Next 16
dan Prisma 8.

## 2. Siapkan database Neon

1. Buat project di [neon.tech](https://neon.tech).
2. Salin dua connection string dari dashboard:
   - host `-pooler` → `DATABASE_URL` (tambahkan `?sslmode=require&pgbouncer=true&connection_limit=1`)
   - host langsung → `DIRECT_URL` (tambahkan `?sslmode=require`)
3. Buat `.env` di root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require&pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/DBNAME?sslmode=require"
```

`.env` sudah masuk `.gitignore`, jangan pernah di-commit.

## 3. Migrasi

```bash
npx prisma migrate dev --name init
```

Perintah ini berjalan lewat `DIRECT_URL`. Untuk database yang sudah pernah
dimigrasi (misalnya di CI), gunakan `npx prisma migrate deploy`.

## 4. Jalankan

```bash
npm run dev
```

Buka http://localhost:3000 — akan diarahkan ke `/items`.

## Struktur

```
app/
  actions.ts              server actions: create, update, toggle, delete
  layout.tsx              root layout + import globals.css
  page.tsx                redirect ke /items
  items/page.tsx          daftar + pencarian + filter + form tambah
  items/[id]/page.tsx     detail + form edit + hapus
components/
  item-form.tsx           client component (useActionState), create & edit
  toggle-button.tsx       client component (useTransition)
lib/db.ts                 singleton PrismaClient
prisma/schema.prisma      model Item
```

## Deploy ke Vercel

1. Push repo ke GitHub, import di Vercel.
2. Set `DATABASE_URL` dan `DIRECT_URL` untuk environment Production **dan**
   Preview (Settings → Environment Variables).
3. Build command biarkan kosong agar memakai `package.json`
   (`prisma generate && next build`).
4. Jalankan migrasi dari mesin lokal / CI dengan `npx prisma migrate deploy`.
   Jangan taruh di build script — preview deployment akan saling balapan di
   database yang sama.
