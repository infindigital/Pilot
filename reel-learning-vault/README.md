# 🎓 Reel Learning Vault

A personal learning-content tracker that turns your **saved‑and‑forgotten** pile of
Instagram reels, YouTube Shorts, LinkedIn posts and tweets into skills you
actually implement.

Capture content in seconds, push it through a learning pipeline
(**Saved → To Learn → Learning → Implemented → Mastered → Archived**), track a
5‑step progress checklist per item, and watch your streaks, badges and analytics
grow.

Built with **React + Vite + Tailwind CSS + Recharts**. Data is stored
**permanently in the cloud** via **Supabase** (Postgres + auth), private to your
account and synced across every device. If Supabase isn't configured it
gracefully falls back to **LocalStorage** so the app still runs offline / for
quick demos.

---

## ✨ Features

- **Dashboard** — Total Saved, To Learn, Learning, Implemented, Archived &
  Completion Rate % with progress bars and a pipeline overview.
- **Add / Quick Add** — full editor (title, creator, platform, URL, notes,
  category, priority, status, knowledge base) plus a lightweight Quick Add modal
  for fast capture.
- **Status workflow** — six‑stage pipeline with colour‑coded status badges.
- **Progress tracking** — five checkpoints per item (Watched, Took Notes,
  Practiced, Implemented, Shared With Team) with auto‑calculated %.
- **Today's Learning queue** — top 5 unfinished items with a one‑click
  *Mark as Learned*.
- **Categories** — content grouped by skill with counts & average progress;
  click to filter the library.
- **Search & filters** — search title/creator/notes; filter by platform,
  category, status, priority; sort by newest, oldest, priority or progress.
- **Personal knowledge base** — editable Summary, Key Takeaways and Action Steps
  on every item.
- **Learning calendar** — month view with per‑day added/completed activity,
  week stats and learning streak.
- **Analytics** — Learning by Category, Completion Rate, Most Saved Platforms and
  Monthly Trend (Recharts).
- **Motivation system** — streak, implemented count, completion % and unlockable
  badges (🏆 🔥 ⚡ 🚀).
- **Power features** — CSV export/import, bulk status updates, bulk delete,
  favorites, per‑item reminders, Quick Add.
- **Dark mode**, fully responsive, accessible (focus rings, ARIA labels,
  `prefers-reduced-motion`).

---

## 🚀 Quick start (local)

> Requires **Node.js 18+**.

```bash
npm install
npm run dev      # http://localhost:5173
```

Without a `.env` the app runs in **LocalStorage demo mode** (no login, sample
data). To enable permanent cloud storage + login, set up Supabase below.

Other scripts: `npm run build` (production build), `npm run preview` (serve the
build at http://localhost:4173).

---

## ☁️ Permanent storage with Supabase (free)

### 1. Create the project & database
1. Sign up at [supabase.com](https://supabase.com) and create a new project
   (pick a strong DB password, any region).
2. In the dashboard open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This
   creates the `items` table and Row Level Security so each user only ever sees
   their own data.
3. (Optional) Go to **Authentication → Providers → Email** and turn *off*
   "Confirm email" if you want to log in immediately without email verification.

### 2. Connect the app
1. In Supabase open **Project Settings → API** and copy the **Project URL** and
   the **anon public** key.
2. In the project folder, copy the example env file and paste your values:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Restart the dev server (`npm run dev`). You'll now see a **login / sign-up**
   screen. Create an account — your data is saved to Supabase and synced to any
   device you log in from.

> The anon key is meant to be public in front-end apps; your data is protected
> by Row Level Security, not by hiding the key. Never expose the `service_role`
> key.

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the
   repo.
3. **Important — set the Root Directory** to `reel-learning-vault` (the app lives
   in a subfolder). Vercel auto-detects Vite (build: `npm run build`, output:
   `dist`).
4. Under **Environment Variables**, add the same two values from your `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. You'll get a public `https://…vercel.app` URL. Every push to
   the branch redeploys automatically.

That's it — open the URL on your laptop or phone, sign in, and your vault is the
same everywhere.

> Tip: keep your data backed up with the **Export** button (Library page); CSV
> **Import** restores or migrates it.

---

## 🎨 Design System

| Token        | Value                                  |
| ------------ | -------------------------------------- |
| Primary      | Indigo `#4F46E5`                       |
| Secondary    | `#818CF8`                              |
| Success/CTA  | Green `#22C55E`                        |
| Font         | Plus Jakarta Sans                      |
| Style        | Micro‑interactions, card‑based         |
| Inspiration  | Notion · Linear · Trello · Duolingo    |

---

## 🏗️ Architecture

State flows through three React contexts and a single storage adapter, so the UI
never touches `localStorage` directly. Swapping persistence for a cloud API
later means changing **one file** (`src/lib/storage.js`).

```
ThemeProvider ─ dark/light mode
AuthProvider  ─ Supabase session (sign in / up / out), current user
VaultProvider ─ items + all mutations (useReducer); syncs to Supabase per user,
                or LocalStorage when unconfigured
UIProvider    ─ active page, navigation params, global modal stack
```

**Cloud sync strategy:** the reducer keeps unchanged items at the same object
reference, so a cheap reference‑diff on every change tells the sync layer exactly
which rows to `upsert` / `delete` in Supabase — no manual save button, no full
re‑writes. Each item is one row (`id`, `user_id`, `data` jsonb), and Row Level
Security guarantees users only ever touch their own rows.

- **Pure analytics layer** (`src/lib/analytics.js`) turns the item array into
  stats, streaks and chart series — easy to memoise and unit‑test.
- **Domain config** (`src/lib/constants.js`) drives every dropdown, badge and
  workflow rule. Add a platform/category/status in one place.
- **Item model factory** (`src/lib/model.js`) normalises records on load, so new
  fields auto‑upgrade old saved data.

### Folder structure

```
reel-learning-vault/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                 # providers + mount
    ├── App.jsx                  # shell, routing, global modals
    ├── index.css                # Tailwind + base styles
    ├── lib/
    │   ├── constants.js         # platforms, categories, statuses, priorities
    │   ├── supabaseClient.js    # Supabase client (from env vars)
    │   ├── repo.js              # cloud CRUD (list / upsert / delete)
    │   ├── storage.js           # LocalStorage fallback adapter
    │   ├── model.js             # item factory + progress helpers
    │   ├── workflow.js          # status pipeline rules
    │   ├── analytics.js         # stats, streaks, chart series
    │   ├── badges.js            # gamification definitions
    │   ├── csv.js               # import / export
    │   ├── dates.js             # date helpers
    │   └── sampleData.js        # first‑run seed data
    ├── context/
    │   ├── ThemeContext.jsx
    │   ├── AuthContext.jsx      # Supabase auth/session
    │   ├── VaultContext.jsx     # reducer + actions + cloud/local sync
    │   └── UIContext.jsx        # navigation + modals
    ├── hooks/
    │   └── useFilteredItems.js  # search / filter / sort
    ├── components/
    │   ├── ui/                  # Button, Card, Badge, Modal, Field, ProgressBar…
    │   ├── layout/              # Sidebar, Topbar, nav config
    │   └── dashboard/           # StatCard
    ├── features/items/          # ItemCard, ItemForm, modals, checklist, BulkBar
    └── pages/                   # AuthPage, Dashboard, Queue, Library, Categories,
                                 # Calendar, Analytics, Achievements

supabase/
└── schema.sql                   # run once in the Supabase SQL editor
.env.example                     # copy to .env with your Supabase keys
```

---

## 🔮 Future‑ready

The architecture was designed so these can be layered on without a rewrite:

- **AI summaries** — add an `aiSummary` field to the model and an enrich action;
  the knowledge‑base UI already has a home for it.
- **Reel / API integrations** — fetch metadata in the storage/service layer and
  pre‑fill the Quick Add form.
- **Chrome extension** — reuse `model.js` + `storage.js`; the extension writes to
  the same schema.
- **Mobile app** — the pure `lib/` logic is platform‑agnostic and portable to
  React Native.
- **Cloud sync** — ✅ implemented via Supabase (`repo.js`); LocalStorage remains
  as an automatic offline fallback.

---

## 💡 10 features to make it addictive (and actually consume what you save)

1. **Daily learning goal + ring** — set "learn 1 thing/day"; a Duolingo‑style
   ring fills as you complete items. Streak freezes if you hit the goal.
2. **Spaced‑repetition resurfacing** — auto‑resurface implemented items after
   7/30/90 days as "Did this stick?" so learning converts to long‑term memory.
3. **"Saved is debt" pressure meter** — visualise unwatched backlog as a growing
   number with a weekly *burn‑down* target to clear it.
4. **AI auto‑summary & auto‑tagging** — paste a URL, get a draft summary, key
   takeaways, suggested category and priority instantly.
5. **Implementation proof** — attach a screenshot/link/note as evidence to mark
   something "Implemented"; build a portfolio of what you've actually shipped.
6. **Focus / learning sessions** — a Pomodoro timer that pulls from Today's
   Queue and logs minutes learned per category.
7. **Weekly review email/recap** — an in‑app Monday digest: what you learned,
   what's rotting in the backlog, and 3 suggested items for the week.
8. **Browser extension one‑click save** — capture from Instagram/YouTube/X
   without leaving the page; the biggest driver of consistent capture.
9. **Leagues / shareable streak cards** — generate a shareable image of your
   streak & badges; optional friend leaderboard for accountability.
10. **Smart "next best lesson"** — a recommender that surfaces one item to do
    next based on priority, momentum (in‑progress), and category balance.

---

Made for personal use. Your vault, your rules. 🚀
