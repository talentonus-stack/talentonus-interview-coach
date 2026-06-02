This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase Integration

This project is connected to Supabase for authentication and database services. Below is a breakdown of the setup steps performed to integrate Supabase into this Next.js application:

### 1. Installed Supabase Client
We installed the necessary packages `@supabase/supabase-js` and `@supabase/ssr` to interact with Supabase from both the client and server sides in a Next.js App Router application.

### 2. Created Supabase Configuration
Environment variables were configured in `.env.local` to securely store the Supabase URL and the anonymous key:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Created Database Connection Utilities
We set up two utility files to instantiate the Supabase client based on the context:
- `utils/supabase/client.ts`: Creates a browser client for use in Client Components.
- `utils/supabase/server.ts`: Creates a server client with cookie management for Server Components, Server Actions, and Route Handlers.

### 4. Created Authentication System
Server Actions were implemented in `app/login/actions.ts` to handle user authentication:
- `login(formData)`: Authenticates an existing user using `signInWithPassword`.
- `signup(formData)`: Registers a new user using `signUp`.

### 5. Created Login Page
A Login page was built at `app/login/page.tsx`, featuring a form that collects the user's email and password and invokes the `login` Server Action.

### 6. Created Signup Page
A Signup page was built at `app/signup/page.tsx`, featuring a form that collects new user credentials and invokes the `signup` Server Action.

### 7. Generated SQL Schema & Configured Profiles with RLS
A SQL schema file was created at `supabase/schema.sql`. This file includes statements to:
- **Create Profile Table:** Defines a `profiles` table that references the built-in `auth.users` table.
- **Configure Row Level Security (RLS):** Secures the `profiles` table with policies ensuring users can only read public profiles and can only insert/update their own profile data.
- **Set Up a Trigger:** Automatically creates a new entry in the `profiles` table whenever a new user signs up in the `auth.users` table.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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