# Medistore — Client (Next.js + TypeScript)

This is the Next.js frontend for the Medistore project. It is a TypeScript + Next.js application that communicates with the backend API (Server_Side) to render the shop, authentication flows, cart, orders, and seller/admin dashboards.

## Technologies used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components

## Live URLs

- Frontend: (not deployed) — replace with your frontend URL if deployed
- Backend API: (not deployed) — replace with your backend API URL if deployed

## Features

- Browse medicines: categories, search, filters, pagination
- Authentication: signup, signin, JWT-based sessions
- Cart & checkout flow
- Orders: create/view (customer), manage (seller)
- Seller dashboard: add/update medicines, view orders
- Admin dashboard: manage users, medicines, orders
- Reviews & ratings
- Responsive UI and accessible components

## Prerequisites

- Node.js (recommended 18+)
- npm (or yarn / pnpm)

## Quick start (local development)

1. Install dependencies:

```bash
cd client-side
npm install
```

2. Configure environment variables:

Create a file named `.env.local` in the `client-side` folder. At minimum set the API base URL used by the client:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Note: the client currently contains a hardcoded `API_BASE_URL` in [src/lib/api/api.ts](client-side/src/lib/api/api.ts#L1). To point the app to a local backend either set `NEXT_PUBLIC_API_URL` as above and uncomment the environment lookup in that file, or update `API_BASE_URL` directly.

3. Start the dev server:

```bash
npm run dev
# Open http://localhost:3000
```

## Build & Production

Build and run:

```bash
npm run build
npm run start
```

The production server runs on whatever port you expose (default Next is 3000).

## Linting

Run the linter with:

```bash
npm run lint
```

## Notes

- API calls are centralized in [src/lib/api/api.ts](client-side/src/lib/api/api.ts#L1). If you get CORS or connection errors, verify that the backend is running and that `NEXT_PUBLIC_API_URL` points to the correct base path (e.g. `http://localhost:5000/api/v1`).
- Auth tokens are stored in `localStorage` by the client and attached as `Authorization: Bearer <token>` to requests.
- To run the client against the included Server_Side locally:
  1.  Start the server (see Server_Side README).
  2.  Set `NEXT_PUBLIC_API_URL` to `http://localhost:5000/api/v1` and restart the client.

## Deploying

You can deploy this app to Vercel, Netlify, or any platform that supports Next.js. For Vercel deploys, ensure your environment variables (especially API URL) are configured in your project settings.

---

See the server README for backend setup: [Server_Side/README.md](Server_Side/README.md)
