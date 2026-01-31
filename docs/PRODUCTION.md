# UniWork: Production Launch Manual

This document contains all the necessary technical specifications and operational checklists for transitioning UniWork to a production environment.

## 1. Required Environment Variables
Ensure the following variables are configured in your Vercel/Production hosting provider:

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSql connection string (with pooled proxy) | Supabase |
| `DIRECT_URL` | Direct database connection string (migration) | Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase API endpoint | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon key for local auth/storage | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **(SERVER ONLY)** Secret key for admin ops | Supabase |
| `RESEND_API_KEY` | API Key for email delivery | [Resend](https://resend.com) |
| `RESEND_FROM_EMAIL` | Verified sender email address | Resend |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `https://[DOMAIN]/api/auth/callback/google` | Google Cloud Console |
| `DROPBOX_APP_KEY` | OAuth App Key | Dropbox Developers |
| `DROPBOX_APP_SECRET` | OAuth App Secret | Dropbox Developers |
| `DROPBOX_REDIRECT_URI` | `https://[DOMAIN]/api/auth/callback/dropbox` | Dropbox Developers |
| `NEXT_PUBLIC_APP_URL` | Your production domain (e.g., https://uniwork.ai) | Vercel |

---

## 2. Supabase RLS Activation
Run the script located at [prisma/rls_policies.sql](file:///c:/osapp/prisma/rls_policies.sql) in your Supabase SQL Editor. 

> [!WARNING]
> This will restrict all data access to authenticated workspace members. Ensure your users are correctly mapped to their workspaces before enabling.

---

## 3. OAuth App Registration
For **Google Cloud Console**:
1. Create a "Web Application" OAuth 2.0 Client ID.
2. Add `https://[YOUR_DOMAIN]/api/auth/callback/google` to "Authorized redirect URIs".
3. Scopes required: `https://www.googleapis.com/auth/drive.readonly`, `openid`, `email`, `profile`.

For **Dropbox Developers**:
1. Create a "Scoped Management" App.
2. Add `https://[YOUR_DOMAIN]/api/auth/callback/dropbox` to "Redirect URIs".
3. Scopes required: `files.metadata.read`, `files.content.read`.

---

## 4. Production Deployment Checklist
- [ ] **Database Migration**: Run `npx prisma db push` or `npx prisma migrate deploy` against the production DB.
- [ ] **RLS Audit**: Confirm RLS is "Enabled" for all tables in the Supabase Dashboard.
- [ ] **SSL Enforcement**: Ensure Vercel is configured to redirect HTTP to HTTPS.
- [ ] **Rate Limiting**: (Optional) Configure Vercel Edge Middleware for API rate limiting.

---

## 5. Smoke-Test Matrix
Execute these steps on the live production URL:
1. **Login**: Verify successful session initialization and redirection to `/dashboard`.
2. **Team Invite**: Send an invite to an external email. Verify Resend sends the email.
3. **Link Acceptance**: Click the link in the email and verify successful workspace joining.
4. **Cloud Sync**: Connect a Google Drive account. Verify files appear in the Hub.
5. **Task Update**: Move a task from "Backlog" to "In Progress". Verify real-time sync.
6. **Error Check**: Introduce a manual error (e.g., delete an ENV variable) and verify the `ErrorBoundary` displays the "Neural Link Interrupted" screen.
