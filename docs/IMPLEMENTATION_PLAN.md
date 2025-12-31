# Weekly Habit & Goal Tracker - Implementation Plan

## Project Overview
A personal weekly habit and goal tracker with Next.js frontend and Supabase backend.

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Cost**: $0 (all free tiers)

### Design Decisions
- Dark mode theme
- Structured data inputs (not free-form text)
- Auto-detect current week
- Calendar view for history + date filtering

---

## Database Schema

### Tables

#### 1. `profiles` (auto-created by Supabase Auth trigger)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK to auth.users) | User ID |
| email | text | User's email |
| full_name | text | User's display name |
| avatar_url | text | Profile picture URL |
| created_at | timestamptz | Account creation date |

#### 2. `weekly_entries`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Entry ID |
| user_id | uuid (FK to profiles) | Owner |
| week_start | date | Monday of the week |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### 3. `habits`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Habit ID |
| entry_id | uuid (FK to weekly_entries) | Parent entry |
| name | text | Habit name |
| target_frequency | int | Times per week goal |
| completed_count | int | Actual completions |
| notes | text | Optional notes |
| order_index | int | Display order |

#### 4. `side_projects`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Project ID |
| entry_id | uuid (FK to weekly_entries) | Parent entry |
| name | text | Project name |
| goal | text | Weekly goal |
| status | text | 'not_started', 'in_progress', 'completed' |
| notes | text | Optional notes |
| order_index | int | Display order |

#### 5. `purchases_research`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Item ID |
| entry_id | uuid (FK to weekly_entries) | Parent entry |
| item_name | text | Item being researched |
| category | text | 'purchase', 'research' |
| priority | text | 'low', 'medium', 'high' |
| status | text | 'researching', 'decided', 'purchased', 'dropped' |
| notes | text | Notes/links |
| order_index | int | Display order |

#### 6. `experiences_travel`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Experience ID |
| entry_id | uuid (FK to weekly_entries) | Parent entry |
| title | text | Experience/trip name |
| planned_date | date | When it's planned |
| type | text | 'travel', 'event', 'experience' |
| status | text | 'planning', 'booked', 'completed' |
| notes | text | Details/links |
| order_index | int | Display order |

---

## Task Breakdown for Parallel Development

### 🔴 TASK 1: Project Setup & Configuration
**Files to create/modify:**
- `package.json`
- `next.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.local.example`
- `.gitignore`
- `app/layout.tsx`
- `app/globals.css`

**Responsibilities:**
1. Initialize Next.js 14 project with TypeScript
2. Configure Tailwind CSS with dark mode
3. Set up environment variables structure
4. Create base layout with dark theme
5. Set up project structure folders

**No conflicts with:** All other tasks (foundational)

---

### 🟠 TASK 2: Supabase Database Setup
**Files to create/modify:**
- `supabase/migrations/*.sql`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/types.ts` (generated)
- `docs/SUPABASE_SETUP.md`

**Responsibilities:**
1. Create Supabase project
2. Write SQL migrations for all tables
3. Set up Row Level Security (RLS) policies
4. Create Supabase client utilities
5. Generate TypeScript types from schema
6. Document setup steps

**Dependencies:** Task 1 (needs env vars structure)
**No conflicts with:** Tasks 3, 4, 5, 6

---

### 🟡 TASK 3: Authentication Implementation
**Files to create/modify:**
- `app/auth/callback/route.ts`
- `app/login/page.tsx`
- `components/auth/LoginButton.tsx`
- `components/auth/LogoutButton.tsx`
- `components/auth/AuthProvider.tsx`
- `middleware.ts`
- `lib/auth/helpers.ts`

**Responsibilities:**
1. Configure Google OAuth in Supabase
2. Create auth callback route
3. Build login page UI
4. Create auth context/provider
5. Implement middleware for protected routes
6. Handle auth state management

**Dependencies:** Task 1, Task 2 (needs Supabase client)
**No conflicts with:** Tasks 4, 5, 6

---

### 🟢 TASK 4: UI Components Library
**Files to create/modify:**
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/TextArea.tsx`
- `components/ui/Select.tsx`
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Calendar.tsx`
- `components/ui/Modal.tsx`
- `components/ui/Toast.tsx`
- `components/ui/Skeleton.tsx`
- `components/ui/index.ts`

**Responsibilities:**
1. Create reusable UI components
2. Implement dark mode styling
3. Add loading states
4. Ensure mobile responsiveness
5. Add accessibility features

**Dependencies:** Task 1 (needs Tailwind setup)
**No conflicts with:** Tasks 2, 3, 5, 6

---

### 🔵 TASK 5: API Routes & Data Layer
**Files to create/modify:**
- `app/api/entries/route.ts` (GET all, POST new)
- `app/api/entries/[id]/route.ts` (GET one, PUT, DELETE)
- `app/api/entries/current-week/route.ts`
- `lib/api/entries.ts` (client-side fetchers)
- `lib/api/habits.ts`
- `lib/api/projects.ts`
- `lib/api/purchases.ts`
- `lib/api/experiences.ts`
- `types/api.ts`

**Responsibilities:**
1. Create CRUD API routes for weekly entries
2. Create sub-item API routes (habits, projects, etc.)
3. Build client-side data fetching utilities
4. Implement error handling
5. Add request validation

**Dependencies:** Task 2 (needs database), Task 3 (needs auth)
**No conflicts with:** Task 4, Task 6

---

### 🟣 TASK 6: Page Components & Features
**Files to create/modify:**
- `app/page.tsx` (landing/redirect)
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/history/page.tsx`
- `components/dashboard/WeeklyEntryForm.tsx`
- `components/dashboard/HabitsSection.tsx`
- `components/dashboard/ProjectsSection.tsx`
- `components/dashboard/PurchasesSection.tsx`
- `components/dashboard/ExperiencesSection.tsx`
- `components/dashboard/WeekSelector.tsx`
- `components/dashboard/CalendarView.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/Header.tsx`

**Responsibilities:**
1. Build dashboard layout
2. Create weekly entry form with all sections
3. Implement calendar view for history
4. Add date filtering
5. Build responsive navigation
6. Handle form state and validation

**Dependencies:** Task 3, Task 4, Task 5
**No conflicts with:** None (final integration)

---

## Recommended Parallel Execution Order

```
Phase 1 (Start Together):
├── 🔴 TASK 1: Project Setup
├── 🟢 TASK 4: UI Components (after Task 1 basics)
└── 📝 TASK 2: Database Schema Design (documentation)

Phase 2 (After Phase 1):
├── 🟠 TASK 2: Supabase Implementation
└── 🟡 TASK 3: Authentication

Phase 3 (After Phase 2):
└── 🔵 TASK 5: API Routes

Phase 4 (After Phase 3):
└── 🟣 TASK 6: Page Components
```

### Safe Parallel Combinations:
- ✅ Task 1 + Task 2 (schema design only)
- ✅ Task 1 + Task 4
- ✅ Task 2 + Task 3 + Task 4
- ✅ Task 4 + Task 5
- ⚠️ Task 5 + Task 6 (careful with shared types)

---

## File Structure

```
habit-tracker/
├── app/
│   ├── api/
│   │   └── entries/
│   │       ├── route.ts
│   │       ├── [id]/route.ts
│   │       └── current-week/route.ts
│   ├── auth/
│   │   └── callback/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── history/page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── LoginButton.tsx
│   │   └── LogoutButton.tsx
│   ├── dashboard/
│   │   ├── CalendarView.tsx
│   │   ├── ExperiencesSection.tsx
│   │   ├── HabitsSection.tsx
│   │   ├── Header.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── PurchasesSection.tsx
│   │   ├── Sidebar.tsx
│   │   ├── WeeklyEntryForm.tsx
│   │   └── WeekSelector.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Calendar.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── Skeleton.tsx
│       ├── TextArea.tsx
│       ├── Toast.tsx
│       └── index.ts
├── lib/
│   ├── api/
│   │   ├── entries.ts
│   │   ├── experiences.ts
│   │   ├── habits.ts
│   │   ├── projects.ts
│   │   └── purchases.ts
│   ├── auth/
│   │   └── helpers.ts
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── types.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── types/
│   └── api.ts
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   └── SUPABASE_SETUP.md
├── .env.local.example
├── .gitignore
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Definition of Done

### Per Task:
- [ ] All files created as specified
- [ ] TypeScript types properly defined
- [ ] Mobile responsive
- [ ] Dark mode applied
- [ ] No linting errors
- [ ] Basic error handling

### Overall Project:
- [ ] User can sign in with Google
- [ ] User can create/edit weekly entry
- [ ] User can add/remove items in each section
- [ ] User can view past weeks via calendar
- [ ] User can filter entries by date
- [ ] App is deployed on Vercel
- [ ] Data persists in Supabase

---

## Notes for Agents

1. **Always use TypeScript** with strict mode
2. **Follow Next.js 14 App Router** conventions
3. **Use Server Components** where possible, Client Components only when needed
4. **Prefix client components** with `'use client'` directive
5. **Use Tailwind CSS** for all styling - no external CSS files
6. **Dark mode**: Use `dark:` variants or CSS variables
7. **Mobile-first**: Design for mobile, enhance for desktop

---

*Last Updated: December 31, 2024*

