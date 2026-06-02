# HASS Quality Properties — Setup Guide

This guide walks through connecting all the external services and deploying to Vercel.

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed locally
- A [GitHub](https://github.com) account (for Vercel import)
- A [Vercel](https://vercel.com) account (free tier)
- A [Neon](https://neon.tech) account (free tier — 0.5 GB storage)
- A [Clerk](https://clerk.com) account (free tier — 50,000 monthly active users)
- A [Cloudflare](https://cloudflare.com) account (free tier — 10 GB R2 storage)

---

## 1. Neon — Database

1. Log in to [Neon Console](https://console.neon.tech)
2. Create a new project → pick any region close to your users
3. Open the **SQL Editor** tab
4. Copy the entire contents of `src/db/schema.sql` and paste it in
5. Run it — this creates both tables (`properties`, `inquiries`) + indexes + seed data
6. Go to **Connection Details** → copy the **pooled connection string** (it ends with `-pooler`)
7. Save it as `DATABASE_URL` in your `.env.local`

> **Important:** Neon scales to zero after 5 minutes of inactivity. The first query after idle will be slow (~500 ms cold start). This is normal and fine on the free tier.

---

## 2. Clerk — Authentication

1. Log in to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application → name it "Hass Admin"
3. In **Configure / Email, Phone & Username** → enable **Email** as identifier, disable the rest
4. Skip the **Add custom pages & paths** section (already configured)
5. Go to **API Keys** → under **Quick Copy**, get:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)
6. Save these in `.env.local`
7. In Clerk Dashboard → **Sessions** → set **Session duration** to 14 days (or your preference)
8. Go to **User & Authentication / Email & SMS Templates** → customize the sign-in email if desired

> The Clerk `<SignIn />` component is rendered at `/admin/login` with custom styling to match your brand.

---

## 3. Cloudflare R2 — File Storage

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2** → **Create Bucket**
3. Bucket name: `hass-properties` (or any name — update `R2_BUCKET_NAME` accordingly)
4. Region: **auto**
5. Once created, go to Bucket → **Settings** → **Public Access**
   - Turn on **Public** → copy the **Public Bucket URL** (looks like `https://pub-xxx.r2.dev`)
   - Save this as `R2_PUBLIC_URL`
6. Still in R2 → **Manage R2 API Tokens** → **Create API Token**
   - Permission: **Object Read & Write**
   - Scope: your bucket
   - Copy the **Access Key ID** and **Secret Access Key** (shown once only!)
   - Save these as `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
7. Find your **Account ID** on the R2 overview page (top-right, looks like a hex hash)
   - Save this as `R2_ACCOUNT_ID`

---

## 4. Local Development

### 4.1 Configure environment

```bash
cp .env.example .env.local
```

Fill in all values from the steps above. The file should contain:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=hass-properties
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 4.2 Fix broken packages (Windows only)

If you see native module errors on Windows, run:

```bash
npm rebuild @next/swc-win32-x64-msvc lightningcss
```

### 4.3 Run the dev server

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Admin dashboard (after login): http://localhost:3000/admin

---

## 5. Deploy to Vercel

### 5.1 One-click Git import

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com) → **Add New Project**
3. Import your repository
4. Framework preset: **Next.js** (auto-detected)
5. Root directory: `./`
6. Build command: `npm run build` (auto-detected)

### 5.2 Environment variables

In the Vercel project dashboard → **Settings** → **Environment Variables**, add every variable from `.env.local` (both preview and production). **Do not include `APP_URL`** — Vercel sets this automatically.

### 5.3 Deploy

Click **Deploy**. The first build will take 2–3 minutes.

### 5.4 Custom domain (optional)

In Vercel → **Settings** → **Domains** → add your domain and update DNS.

---

## 6. Vercel Free Tier Notes

| Resource | Limit | Mitigation |
|----------|-------|------------|
| **Serverless function duration** | 10 seconds | All queries are fast (< 200 ms). Upload route may exceed this for large files — keep images under 5 MB. |
| **Serverless invocations** | 100,000 / month | Fine for a small-to-mid traffic real estate site. Each page load makes 2–4 API calls. |
| **Bandwidth** | 100 GB / month | Images served from R2 (not Vercel) — zero bandwidth cost. Only the HTML + JS is served by Vercel. |
| **Build minutes** | 6,000 / month | Enough for hundreds of builds. |
| **Edge functions** | Included | Only `middleware.ts` runs on the edge. No additional cost. |

---

## 7. Architecture Overview

```
Browser
  │
  ├── Static assets (CSS, JS) ─── Vercel CDN
  │
  ├── Public pages ────────────── fetch() → Next.js API Routes → Neon SQL
  │                                    ↑
  │                              Cache-Control headers (CDN caches 1-2 min)
  │
  ├── Admin pages ─────────────── fetch() → Clerk auth check → Next.js API Routes → Neon SQL
  │                                    ↑
  │                              Clerk middleware protects /admin/*
  │
  └── Image uploads ───────────── fetch() → Clerk auth check → /api/upload → Cloudflare R2
                                       ↑
                                  File stored in R2 bucket, public URL returned
```

### Key files

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Neon serverless client (single connection singleton) |
| `src/lib/repositories/properties.ts` | All property SQL queries |
| `src/lib/repositories/inquiries.ts` | All inquiry SQL queries |
| `src/lib/r2.ts` | Cloudflare R2 S3 client configuration |
| `src/middleware.ts` | Clerk route protection (edge) |
| `src/app/api/upload/route.ts` | File upload handler (auth required) |
| `src/db/schema.sql` | Full database schema + seed data |

---

## 8. Troubleshooting

### "Cannot find module '../lightningcss.win32-x64-msvc.node'"

Windows native module issue. Fix:
```bash
npm rebuild lightningcss
```

### "Database connection refused"

- Ensure `DATABASE_URL` uses the **pooled** connection string (`-pooler`)
- Check Neon dashboard → the database is not paused
- Try connecting directly: `psql "$DATABASE_URL"`

### "Unauthorized" on admin pages

- Clerk keys must be set in Vercel environment variables (not just `.env.local`)
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_` and `CLERK_SECRET_KEY` starts with `sk_`
- Check Clerk Dashboard → the application is in **Development** mode

### Images not loading

- Ensure the R2 bucket is set to **Public** access
- Verify `R2_PUBLIC_URL` is correct (should start with `https://pub-`)
- Check `next.config.ts` has the correct hostname patterns for R2 domains
