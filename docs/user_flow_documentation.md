# User Flow Documentation

This document describes the step-by-step journeys for standard users and administrators in SkillSwap Hub.

---

## 1. Standard User Journey

### Step 1: Registration & Login
1. Navigate to `/register` and fill in your email, password, and full name.
2. After successful signup, redirect to `/login` to enter your credentials.
3. Upon successful login, you are redirected to the `/dashboard`.

### Step 2: Complete Profile & Add Skills
1. Go to `/settings` using the profile settings tab link.
2. Complete your bio and experience, and save.
3. In the skills editor section:
   * Add skills you can teach (Teaching Skills) and set your experience level (Beginner, Intermediate, Advanced, Expert).
   * Add skills you want to learn (Learning Skills).

### Step 3: Peer Discovery & Connection
1. Navigate to `/explore`.
2. Under "Search by Skill Name", enter a skill you want to learn (e.g., Python).
3. The platform displays users teaching that skill.
4. Click **Connect** on a card, type a custom invite message, and send the request.

### Step 4: Accepting Invites & Chatting
1. The recipient receives a real-time notification alert.
2. They navigate to `/requests` and accept the connection request.
3. Once connected, either user can navigate to `/chat`, select the conversation sidebar card, and start messaging.
4. *Unread message limits (up to 3 unread)* are verified dynamically during messaging.

### Step 5: Scheduling & Meeting
1. Navigate to `/sessions`.
2. Click **Book Session**, select your connection, pick the skill, type a topic and description, set a date and time, and send the proposal.
3. The peer accepts the proposal from their pending tab.
4. The status transitions to `Accepted` (which automatically creates a secure meeting room).
5. When the session is active, click **Join Meeting** to join the Jitsi call in a new browser tab.
6. Once the call is finished, click **Complete Session** to archive it in your history log.

---

## 2. Administrator Moderation Journey

### Step 1: Login
1. Log in using an administrator account. The platform detects the `is_admin` claim and shows the **Admin Control Panel** tab link in the layout headers.
2. Click the link to navigate to `/admin`.

### Step 2: User Moderation
1. Under the **Users Directory** tab, view all registered accounts.
2. Search for specific users using their email or SkillSwap ID.
3. Suspend accounts that violate platform policies by clicking **Suspend** and providing a reason. Suspended users will be blocked from logging in or performing actions.
4. Re-activate accounts by clicking **Activate**.

### Step 3: Report & Complaint Resolution
1. Navigate to the **Complaints & Reports** tab to view complaints filed by users.
2. Review the reporter name, reported name, reason category, and detailed descriptions.
3. Moderate the target account if needed, then update the report status to `Reviewed` or `Resolved`.

### Step 4: Audit Logs Tracking
1. Navigate to the **Action Logs** tab.
2. View the audit logs, including timestamps, administrator names, action types (e.g. `SUSPEND_USER`), and detailed descriptions.
