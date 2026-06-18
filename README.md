# PersonaMap

PersonaMap is a Next.js MVP for an evidence-based personality database. Users can browse fictional character and public figure profiles, view initial MBTI and Enneagram reads, suggest typings when authenticated, and add evidence cards.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- `@supabase/ssr` for App Router auth cookies
- Zod for validation
- Vitest for focused unit tests

## Requirements

- Node.js `>=20.19.0`
- npm
- A Supabase project

The Node version is pinned because some current dev dependencies require Node 20.19 or newer.

## Local Setup

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Find both values in Supabase Dashboard -> Project Settings -> API.

The public website runs through the anon key plus Row Level Security. Only the optional private initial typing API uses `SUPABASE_SERVICE_ROLE_KEY`, and that key must remain server-only.

## Supabase Project Setup

1. Create a new project at https://supabase.com.
2. Open Project Settings -> API.
3. Copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the `anon public` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Open Authentication -> Providers and make sure Email is enabled.
6. Open Authentication -> URL Configuration.
7. Set Site URL for local development:

```text
http://localhost:3000
```

8. Add Redirect URLs:

```text
http://localhost:3000/login
http://localhost:3000/profiles
```

For Vercel, also add your production domain equivalents, for example:

```text
https://your-domain.vercel.app/login
https://your-domain.vercel.app/profiles
```

## Deploy To Vercel

1. Push the repo to GitHub.
2. Import the repository into Vercel.
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - optionally `NEXT_PUBLIC_SITE_URL` if you want to pin auth redirects to a canonical domain
   - optionally `SUPABASE_SERVICE_ROLE_KEY`, `PERSONAMAP_INTERNAL_API_TOKEN`, and `PERSONAMAP_SYSTEM_USER_ID` if you want the private initial typing API enabled
4. Deploy the app.
5. After Vercel gives you the deployment URL, add the production auth redirect URLs in Supabase Auth settings.
6. Redeploy if you change environment variables.

## Database Setup

Run the schema first, then the seed.

In Supabase Dashboard:

1. Open SQL Editor.
2. Paste the full contents of `db/schema.sql`.
3. Run it.
4. Paste the full contents of `db/seed.sql`.
5. Run it.

With `psql`, if you have a database connection string:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

`db/schema.sql` creates the tables, constraints, indexes, timestamp triggers, and RLS policies. `db/seed.sql` creates MBTI and Enneagram options plus starter profiles. Evidence is not seeded because it references real `auth.users` rows. Initial typings can be seeded later through the private API below.

## Private Initial Typing API

PersonaMap includes a server-only endpoint that lets a local side script save one initial typing result for each profile:

```text
POST /api/internal/type-vote
```

Required server-side environment variables:

```bash
SUPABASE_SERVICE_ROLE_KEY=
PERSONAMAP_INTERNAL_API_TOKEN=
PERSONAMAP_SYSTEM_USER_ID=
```

`PERSONAMAP_SYSTEM_USER_ID` must be the UUID of a real Supabase Auth user because the existing `votes.user_id` column references `auth.users(id)`. The service-role key must only be set in trusted server environments such as Vercel environment variables or local `.env.local`; never expose it to client-side code.

Example request:

```bash
curl -X POST "https://your-domain.vercel.app/api/internal/type-vote" \
  -H "Authorization: Bearer $PERSONAMAP_INTERNAL_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileSlug": "bruce-wayne-the-dark-knight",
    "systemCode": "MBTI",
    "typeCode": "INTJ"
  }'
```

You may also pass `profileId` instead of `profileSlug`. Repeating the request updates the existing system-owned typing for that profile and typing system instead of creating duplicate public counts.

## Run The App

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Auth Flow Notes

- Unauthenticated users can browse profiles.
- Typing suggestions, evidence submission, and profile creation require a Supabase session.
- Signup redirects to `/profiles`.
- If email confirmation is enabled in Supabase, users may need to confirm by email before login/session availability.
- Logout clears the Supabase auth cookie through `@supabase/ssr`.

## Known Limitations

- Comments are represented in the schema but not implemented in the UI.
- Evidence voting is represented in the schema but not implemented in the UI.
- No custom `loading.tsx` or `error.tsx` route states yet.
- The app includes local fallback seed data for browsing when Supabase env vars are missing.
- Real write flows require Supabase env vars and the schema to be applied.
- The SQL seed intentionally avoids fake user-generated evidence.
