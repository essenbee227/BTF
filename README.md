## Dubai GaiaGro

Dubai GaiaGro is a sustainability-focused travel companion for Dubai. It helps users:

- Discover eco-friendly places on an interactive map
- Complete missions and upload proof photos
- Earn **EcoCoins** as a reward system
- Join themed community groups and (future) chat rooms

The app is built with **Next.js 16 (App Router)** and integrates authentication, a map, missions with image uploads, and community discovery.

---

## Features

- **User Authentication**
  - Email/password auth using NextAuth Credentials Provider
  - Passwords stored securely (hashed with bcrypt)
  - Protected routes for Map, Missions, and Community pages

- **Eco Map (Dubai)**
  - Interactive map built with **Leaflet** and **react-leaflet**
  - Custom colored markers for different place types:
    - Green = eco hotels
    - Yellow = eco attractions
    - Blue = water refill points
    - Purple = eco districts
  - Places and metadata stored in a typed `ecoPlaces` data file

- **Missions & EcoCoins**
  - Personalized missions per user (e.g. Green Commute, Refill & Save)
  - Upload photo proof for each mission
  - Backend processes images, detects duplicates, and stores them
  - Completing uploads increases mission progress and awards **EcoCoins**
  - Deleting a photo rolls back progress and refunds EcoCoins

- **Photo Uploads (Missions)**
  - Image validation (type & size)
  - Image optimization via **sharp** (resize & compress)
  - Files stored under `public/uploads/missions`
  - Photo metadata and AI-ish analysis stored in the database

- **Community Groups**
  - Predefined groups (Solo Travelers, Eco-Foodies, Women Travelers, etc.)
  - Filter by tags like `solo`, `women`, `outdoor`, `food`, etc.
  - "Join Group" navigates to a group-specific chat URL
  - Chat rooms currently show a placeholder UI (chat coming later)

---

## Tech Stack

- **Frontend & Framework**
  - [Next.js 16](https://nextjs.org/) with the App Router
  - React & TypeScript
  - Tailwind-like utility classes via `globals.css`

- **Authentication**
  - [NextAuth.js](https://next-auth.js.org/) with Credentials Provider
  - Prisma adapter (`@auth/prisma-adapter`)
  - JWT-based sessions

- **Database & ORM**
  - [Prisma](https://www.prisma.io/)
  - SQLite (via `prisma/dev.db`) or another database depending on your config
  - Models for `User`, `Mission`, `MissionPhoto`, etc.

- **Maps**
  - [Leaflet](https://leafletjs.com/)
  - [react-leaflet](https://react-leaflet.js.org/)

- **Image Processing**
  - [sharp](https://sharp.pixelplumbing.com/) for resizing/compression
  - Node `crypto` for image hashing and duplicate detection

---

## Project Structure (relevant parts)

- `src/app/`
  - `page.tsx` – Landing page
  - `map/page.tsx` – Protected eco map page
  - `missions/page.tsx` – Protected missions dashboard
  - `community/page.tsx` – Protected community groups page
  - `community/chat/[groupId]/page.tsx` – Group-specific chat placeholder
  - `auth/signin/page.tsx` – Sign-in form
  - `auth/signup/page.tsx` – Sign-up form
  - `api/auth/[...nextauth]/route.ts` – NextAuth handler
  - `api/auth/register/route.ts` – User registration
  - `api/missions/upload-photo/route.ts` – Mission photo upload + EcoCoins award
  - `api/missions/photos/route.ts` – Fetch mission photos
  - `api/missions/delete-photo/route.ts` – Delete mission photo + EcoCoins refund

- `src/components/`
  - `Navbar.tsx` – Top navigation, shows links for authenticated users
  - `Providers.tsx` – Wraps app in `SessionProvider`
  - `MapComponent.tsx` – Leaflet map with markers
  - `MapClient.tsx` – Client wrapper that loads `MapComponent` with `ssr: false`
  - `MissionCard.tsx` – Mission UI + photo upload and progress display

- `src/data/`
  - `ecoPlaces.ts` – Typed list of eco-friendly locations in Dubai

- `src/lib/`
  - `auth.ts` – NextAuth configuration and `auth()` helper

- `prisma/`
  - `schema.prisma` – Database models
  - `migrations/` – Prisma migrations
  - `dev.db` – Local SQLite DB (if used)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root and set at least:

```bash
DATABASE_URL="file:./prisma/dev.db"          # or your database URL
NEXTAUTH_SECRET="your-random-secret"        # e.g. from `openssl rand -hex 32`
NEXTAUTH_URL="http://localhost:3000"        # dev URL
```

If you change the database, update `schema.prisma` and `DATABASE_URL` accordingly.

### 3. Run Prisma migrations

If you’re starting fresh (or changed the schema):

```bash
npx prisma migrate dev
```

This will create/update the database tables.

### 4. Start the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create an account

1. Go to `/auth/signup`.
2. Register with name, email, and password.
3. Log in at `/auth/signin`.
4. You’ll then be able to access `/map`, `/missions`, and `/community`.

---

## Development Notes

- **Auth-protected pages** use `auth()` on the server and redirect unauthenticated users to `/auth/signin`.
- The **map** is only rendered on the client to avoid `window is not defined` errors with Leaflet.
- **Mission photos** are stored on disk under `public/uploads/missions` and referenced by URL in the database.
- EcoCoins logic lives mainly in the mission photo API routes (award on upload, refund on delete).
- Community chat pages are currently placeholders – real-time chat is a future enhancement.

---

## Scripts

- `npm run dev` – Start the Next.js dev server with Turbopack.
- `npm run build` – Create a production build.
- `npm start` – Run the production server (after `npm run build`).
- `npx prisma studio` – Open Prisma Studio to inspect the database (optional).

---

## Future Improvements

- Real-time chat in community groups (e.g. via WebSockets or a service like Pusher).
- More advanced image analysis for mission proof.
- Admin dashboard for verifying mission photos.
- More detailed eco place data (ratings, opening hours, user reviews).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
