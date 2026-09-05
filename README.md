# Client Knowledge Quiz Platform

Two separate portals in one app:
- **Employees** sign in at `/employee/login` with an Employee ID + PIN, pick a client and difficulty (Easy/Medium/Hard/Expert), and take an 8-question quiz.
- **Admins** sign in at `/admin/login` and can: add clients, generate AI quiz questions per difficulty (via Claude), review/edit/approve/reject every AI-drafted question before it ever reaches employees, add/manage all employees (built for 400+), and see every result.

Nothing here is a demo — this is a real, production-shaped app. Follow the steps below and it will be genuinely live for your whole company, at zero cost until you choose to buy a custom domain.

---

## 1. Get the code running

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `SESSION_SECRET` — any long random string (`openssl rand -base64 32`)
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com/settings/keys (needed only for the "Generate questions (AI)" button)
- Leave `DATABASE_URL` as the default SQLite path for now — that's fine for local testing.

Then set up the database and your first admin login:

```bash
npx prisma migrate dev --name init
npm run seed
```

This prints your first admin username/password in the terminal — **note it down**, then run:

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in as admin, add a client, hit "Generate" to draft AI questions, approve them, then add employees in bulk and try the employee side yourself.

---

## 2. Get a free permanent database (5 minutes)

SQLite works locally but Vercel's servers don't keep files between requests, so production needs a real hosted database. Both of these have a permanent free tier:

- **Neon** (recommended, Postgres): https://neon.tech → New Project → copy the connection string.
- **Supabase**: https://supabase.com → New Project → Settings → Database → connection string.

Once you have the connection string:
1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. Update `.env`'s `DATABASE_URL` to the Neon/Supabase string.
3. Run `npx prisma migrate dev --name init` again against the new database, then `npm run seed`.

---

## 3. Put the code on GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new repo at https://github.com/new, then:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

---

## 4. Deploy for free on Vercel

1. Go to https://vercel.com → sign up (free) → **Add New Project** → import your GitHub repo.
2. In the project's **Environment Variables** settings, add the same three values from your `.env`:
   `DATABASE_URL`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`.
3. Click **Deploy**.

You now have a real, live URL like `https://your-project.vercel.app` — working for all 400 employees, no cost, no time limit.

Run the seed script once against production to create your first admin (from your machine, with `.env` pointed at the production `DATABASE_URL`):

```bash
npm run seed
```

Share:
- `https://your-project.vercel.app/employee/login` with employees
- `https://your-project.vercel.app/admin/login` with admins only

---

## 5. (Optional, later) Attach your own domain

Buy a domain from any registrar (Namecheap, GoDaddy, Google Domains — roughly $10–15/year, the one part of this that isn't free) and in Vercel go to **Project → Settings → Domains** and add it. Vercel gives you the DNS records to set at your registrar; it usually takes effect within an hour. Everything else stays exactly the same — same code, same database, same logins, just a nicer URL.

---

## How the pieces fit together

- **Employee side**: `/employee/login`, `/employee/dashboard`, `/employee/quiz/[clientId]`, `/employee/result/[attemptId]`
- **Admin side**: `/admin/login`, `/admin/dashboard`, `/admin/clients`, `/admin/questions` (review queue), `/admin/employees`, `/admin/results`
- **AI generation**: admin clicks "Generate (AI)" on a client+difficulty → Claude drafts 5 questions → they land in the review queue as `PENDING_REVIEW` → admin approves, edits, or rejects each one → only `APPROVED` questions are ever shown to employees. Re-run generation once a year (or whenever) per your original plan — old approved questions stay live until you replace them.
- **Roles**: enforced by `middleware.ts` (blocks unauthenticated access to `/admin/*` and `/employee/*`) plus a signed, HTTP-only session cookie.

## Notes on scaling to 400+ employees

- The bulk-add box on `/admin/employees` accepts one employee per line (`employeeId, name`) — paste all 400 at once.
- PINs are auto-generated 4-digit codes shown once at creation time — export/copy that table before navigating away.
- Neon/Supabase free tiers comfortably handle this volume of quiz data.
