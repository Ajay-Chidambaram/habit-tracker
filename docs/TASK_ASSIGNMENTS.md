# Task Assignments for Parallel Agents

This document provides clear boundaries for parallel agent work. Each agent should ONLY modify files in their assigned section.

---

## 🔴 AGENT 1: Project Setup & Configuration

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
├── package.json
├── next.config.js  
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
├── .gitignore
├── app/layout.tsx
├── app/globals.css
└── app/page.tsx (initial redirect only)
```

### Instructions:
1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false`
2. Configure Tailwind for dark mode (`darkMode: 'class'`)
3. Set up dark theme color palette in `globals.css`
4. Create `.env.local.example` with placeholder values
5. Update base layout with dark background and font

### Acceptance Criteria:
- [ ] `npm run dev` works without errors
- [ ] Dark mode is default
- [ ] Environment variables structure documented
- [ ] Project runs on `localhost:3000`

### Estimated Time: 30 minutes

---

## 🟠 AGENT 2: Supabase Database Setup

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── lib/supabase/
│   ├── client.ts
│   ├── server.ts
│   └── types.ts
└── docs/SUPABASE_SETUP.md
```

### Instructions:
1. Create Supabase project at https://supabase.com
2. Write SQL migration with all tables (see IMPLEMENTATION_PLAN.md)
3. Set up Row Level Security (RLS) policies
4. Create browser and server Supabase clients
5. Generate types using `npx supabase gen types typescript`
6. Document setup steps in SUPABASE_SETUP.md

### SQL Tables to Create:
- `profiles` (with trigger from auth.users)
- `weekly_entries`
- `habits`
- `side_projects`
- `purchases_research`
- `experiences_travel`

### Acceptance Criteria:
- [ ] All tables created in Supabase
- [ ] RLS policies protect user data
- [ ] TypeScript types generated
- [ ] Client utilities work with auth

### Estimated Time: 45 minutes

### Dependencies:
- Needs `.env.local.example` from Agent 1

---

## 🟡 AGENT 3: Authentication Implementation

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
├── app/auth/
│   └── callback/route.ts
├── app/login/
│   └── page.tsx
├── components/auth/
│   ├── AuthProvider.tsx
│   ├── LoginButton.tsx
│   └── LogoutButton.tsx
├── lib/auth/
│   └── helpers.ts
└── middleware.ts
```

### Instructions:
1. Configure Google OAuth in Supabase Dashboard
   - Go to Authentication > Providers > Google
   - Add OAuth credentials from Google Cloud Console
2. Create auth callback route for OAuth redirect
3. Build login page with Google sign-in button
4. Create AuthProvider context for client-side auth state
5. Implement middleware to protect `/dashboard/*` routes

### Google OAuth Setup:
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

### Acceptance Criteria:
- [ ] User can sign in with Google
- [ ] User is redirected to dashboard after login
- [ ] Unauthenticated users redirected to login
- [ ] User can sign out

### Estimated Time: 45 minutes

### Dependencies:
- Needs Supabase client from Agent 2
- Needs base layout from Agent 1

---

## 🟢 AGENT 4: UI Components Library

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
└── components/ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── TextArea.tsx
    ├── Select.tsx
    ├── Card.tsx
    ├── Badge.tsx
    ├── Calendar.tsx
    ├── Modal.tsx
    ├── Toast.tsx
    ├── Skeleton.tsx
    └── index.ts
```

### Instructions:
1. Create reusable UI components with Tailwind
2. All components must support dark mode
3. Add proper TypeScript interfaces for props
4. Include loading/disabled states where appropriate
5. Ensure mobile responsiveness
6. Export all from `index.ts`

### Component Specifications:

**Button**: Primary, secondary, ghost, danger variants. Sizes: sm, md, lg.
**Input**: Label, error state, icon support.
**TextArea**: Auto-resize option, character count.
**Select**: Custom styled dropdown.
**Card**: Header, body, footer sections.
**Badge**: Status colors (success, warning, error, info).
**Calendar**: Month view, date selection, week highlighting.
**Modal**: Overlay, close button, sizes.
**Toast**: Success, error, info variants with auto-dismiss.
**Skeleton**: Loading placeholder animations.

### Acceptance Criteria:
- [ ] All 10 components created
- [ ] Dark mode styling
- [ ] TypeScript props interfaces
- [ ] Mobile responsive
- [ ] Exported from index.ts

### Estimated Time: 1 hour

### Dependencies:
- Needs Tailwind config from Agent 1

---

## 🔵 AGENT 5: API Routes & Data Layer

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
├── app/api/
│   └── entries/
│       ├── route.ts
│       ├── [id]/route.ts
│       └── current-week/route.ts
├── lib/api/
│   ├── entries.ts
│   ├── habits.ts
│   ├── projects.ts
│   ├── purchases.ts
│   └── experiences.ts
└── types/
    └── api.ts
```

### Instructions:
1. Create API routes for CRUD operations on weekly entries
2. Build client-side data fetching utilities
3. Define TypeScript types for API requests/responses
4. Implement proper error handling
5. Add request validation

### API Endpoints:
- `GET /api/entries` - List all entries for user
- `POST /api/entries` - Create new weekly entry
- `GET /api/entries/[id]` - Get specific entry with all items
- `PUT /api/entries/[id]` - Update entry and items
- `DELETE /api/entries/[id]` - Delete entry
- `GET /api/entries/current-week` - Get or create current week's entry

### Acceptance Criteria:
- [ ] All API routes working
- [ ] Proper authentication checks
- [ ] Error responses standardized
- [ ] Client utilities typed
- [ ] Validation on inputs

### Estimated Time: 1 hour

### Dependencies:
- Needs Supabase client and types from Agent 2
- Needs auth helpers from Agent 3

---

## 🟣 AGENT 6: Page Components & Features

### Assigned Files (EXCLUSIVE OWNERSHIP):
```
├── app/dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── history/page.tsx
└── components/dashboard/
    ├── CalendarView.tsx
    ├── ExperiencesSection.tsx
    ├── HabitsSection.tsx
    ├── Header.tsx
    ├── ProjectsSection.tsx
    ├── PurchasesSection.tsx
    ├── Sidebar.tsx
    ├── WeeklyEntryForm.tsx
    └── WeekSelector.tsx
```

### Instructions:
1. Build dashboard layout with sidebar and header
2. Create weekly entry form with all 4 sections
3. Implement add/remove items in each section
4. Build calendar view for viewing history
5. Add date range filtering
6. Handle form submission and updates

### Page Structure:
- **Dashboard**: Current week's entry form
- **History**: Calendar + list of past entries

### Form Sections:
1. **Habits**: Name, target frequency, completed count, notes
2. **Side Projects**: Name, goal, status dropdown, notes
3. **Purchases/Research**: Item name, category, priority, status, notes
4. **Experiences/Travel**: Title, date, type, status, notes

### Acceptance Criteria:
- [ ] Dashboard shows current week
- [ ] All 4 sections functional
- [ ] Can add/remove items
- [ ] Form saves to database
- [ ] Calendar shows past weeks
- [ ] Mobile responsive

### Estimated Time: 1.5 hours

### Dependencies:
- Needs UI components from Agent 4
- Needs API utilities from Agent 5
- Needs Auth provider from Agent 3

---

## Execution Timeline

```
Hour 0-0.5:
  🔴 Agent 1: Project Setup ────────────►
  
Hour 0.5-1:
  🟢 Agent 4: UI Components ────────────────────────►
  🟠 Agent 2: Database Setup ───────────────────────►
  
Hour 1-1.5:
  🟡 Agent 3: Authentication ───────────────────────►
  
Hour 1.5-2.5:
  🔵 Agent 5: API Routes ───────────────────────────►
  
Hour 2.5-4:
  🟣 Agent 6: Page Components ──────────────────────────────────►
```

---

## Communication Protocol

### When Starting:
1. Announce which task you're working on
2. Confirm no one else is modifying your files

### When Blocked:
1. Specify which dependency you need
2. Which agent owns that dependency

### When Complete:
1. Announce task completion
2. List any issues or notes for dependent tasks

---

## Quick Reference: File Ownership

| File/Folder | Owner |
|-------------|-------|
| `package.json`, `*.config.*` | Agent 1 |
| `supabase/*`, `lib/supabase/*` | Agent 2 |
| `app/auth/*`, `app/login/*`, `components/auth/*`, `middleware.ts` | Agent 3 |
| `components/ui/*` | Agent 4 |
| `app/api/*`, `lib/api/*`, `types/*` | Agent 5 |
| `app/dashboard/*`, `components/dashboard/*` | Agent 6 |

---

*Any questions? Review IMPLEMENTATION_PLAN.md for technical details.*

