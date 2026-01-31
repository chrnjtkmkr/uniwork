-- UNIWORK PRODUCTION SECURITY PROTOCOL: RLS POLICIES
-- Execute this script in the Supabase SQL Editor

-- 1. Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Channel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "File" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExternalAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. User Table Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON "User"
FOR SELECT USING (auth.uid() = "supabaseId");

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "User"
FOR UPDATE USING (auth.uid() = "supabaseId");

-- 3. Workspace Isolation Policies
-- Users can see workspaces they are members of
CREATE POLICY "Members can see workspace" ON "Workspace"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "_WorkspaceMembers" 
    JOIN "User" ON "_WorkspaceMembers"."B" = "User"."id"
    WHERE "_WorkspaceMembers"."A" = "Workspace"."id" 
    AND "User"."supabaseId" = auth.uid()
  ) OR "ownerId" IN (SELECT "id" FROM "User" WHERE "supabaseId" = auth.uid())
);

-- 4. Task Policies
CREATE POLICY "Members can manage tasks" ON "Task"
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM "Workspace"
    WHERE "Workspace"."id" = "Task"."workspaceId"
    AND (
      EXISTS (
        SELECT 1 FROM "_WorkspaceMembers"
        JOIN "User" ON "_WorkspaceMembers"."B" = "User"."id"
        WHERE "_WorkspaceMembers"."A" = "Workspace"."id" 
        AND "User"."supabaseId" = auth.uid()
      ) OR "ownerId" IN (SELECT "id" FROM "User" WHERE "supabaseId" = auth.uid())
    )
  )
);

-- 5. File Policies
CREATE POLICY "Members can manage files" ON "File"
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM "Workspace"
    WHERE "Workspace"."id" = "File"."workspaceId"
    AND (
      EXISTS (
        SELECT 1 FROM "_WorkspaceMembers"
        JOIN "User" ON "_WorkspaceMembers"."B" = "User"."id"
        WHERE "_WorkspaceMembers"."A" = "Workspace"."id" 
        AND "User"."supabaseId" = auth.uid()
      ) OR "ownerId" IN (SELECT "id" FROM "User" WHERE "supabaseId" = auth.uid())
    )
  )
);

-- 6. Message Policies
CREATE POLICY "Members can read messages" ON "Message"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Channel"
    JOIN "Workspace" ON "Channel"."workspaceId" = "Workspace"."id"
    WHERE "Channel"."id" = "Message"."channelId"
    AND (
      EXISTS (
        SELECT 1 FROM "_WorkspaceMembers"
        JOIN "User" ON "_WorkspaceMembers"."B" = "User"."id"
        WHERE "_WorkspaceMembers"."A" = "Workspace"."id" 
        AND "User"."supabaseId" = auth.uid()
      ) OR "ownerId" IN (SELECT "id" FROM "User" WHERE "supabaseId" = auth.uid())
    )
  )
);

-- 7. Audit Log (Write Only from Server / Admin Read)
CREATE POLICY "Service role can manage audit logs" ON "AuditLog"
FOR ALL USING (true) WITH CHECK (true);
