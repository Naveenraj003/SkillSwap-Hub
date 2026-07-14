# Database Design Documentation

SkillSwap Hub uses a relational database schema. Tables, primary keys, relationships, cascades, indexes, and constraints are defined below.

---

## Entity Relationship Summary

All primary keys use UUIDs for secure identification. Cascades (`ON DELETE CASCADE`) are defined on foreign keys so that removing a user automatically cleans up related data (profiles, connection requests, blocks, messages, sessions).

---

## Table Schemas

### 1. `users`
Stores login profiles and roles.
* `user_id` (UUID, Primary Key, default `uuid4`)
* `email` (VARCHAR(255), Unique, Indexed, Not Null)
* `password_hash` (TEXT, Nullable)
* `skillswap_id` (VARCHAR(50), Unique, Indexed, Not Null)
* `created_at` (TIMESTAMP, default `utcnow`)
* `status` (VARCHAR(50), default `'Active'`) # Active, Suspended
* `is_admin` (BOOLEAN, default `False`)

### 2. `profiles`
Stores metadata about users.
* `profile_id` (UUID, Primary Key)
* `user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Unique, Not Null)
* `full_name` (VARCHAR(100), Not Null)
* `profile_image` (TEXT, Nullable)
* `bio` (TEXT, Nullable)
* `experience` (TEXT, Nullable)

### 3. `skills`
Stores verified skills.
* `skill_id` (UUID, Primary Key)
* `skill_name` (VARCHAR(100), Unique, Indexed, Not Null)
* `verified` (BOOLEAN, default `False`)

### 4. `user_skills`
Maps users to the skills they teach or want to learn.
* `user_skill_id` (UUID, Primary Key)
* `user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `skill_id` (UUID, FK -> `skills.skill_id` ON DELETE CASCADE, Not Null)
* `skill_type` (VARCHAR(50), Not Null) # 'Teaching' or 'Learning'
* `skill_level` (VARCHAR(50), Not Null) # 'Beginner', 'Intermediate', 'Advanced', 'Expert'

### 5. `blocks`
Stores active blocks between users.
* `block_id` (UUID, Primary Key)
* `blocker_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `blocked_user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `created_at` (TIMESTAMP)

### 6. `restrictions`
Stores user interaction restrictions.
* `restriction_id` (UUID, Primary Key)
* `restrictor_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `restricted_user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `reason` (TEXT, Nullable)
* `created_at` (TIMESTAMP)

### 7. `connection_requests`
Stores invitations to connect.
* `request_id` (UUID, Primary Key)
* `sender_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `receiver_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `skill_id` (UUID, FK -> `skills.skill_id` ON DELETE CASCADE, Not Null)
* `message` (TEXT, Nullable)
* `status` (VARCHAR(50), default `'Pending'`) # Pending, Accepted, Rejected
* `created_at` (TIMESTAMP)

### 8. `connections`
Stores confirmed learning relationships.
* `connection_id` (UUID, Primary Key)
* `user_one` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `user_two` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `created_at` (TIMESTAMP)
* *Constraint:* Unique index on `(user_one, user_two)` where `user_one < user_two` to prevent duplicates.

### 9. `notifications`
Stores real-time system alerts.
* `notification_id` (UUID, Primary Key)
* `user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `title` (VARCHAR(255), Not Null)
* `message` (TEXT, Not Null)
* `type` (VARCHAR(100), Not Null)
* `is_read` (BOOLEAN, default `False`)
* `created_at` (TIMESTAMP, default `utcnow`, Indexed)

### 10. `conversations`
Tracks messaging channels.
* `conversation_id` (UUID, Primary Key)
* `user_one` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `user_two` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `created_at` (TIMESTAMP, default `utcnow`)
* `updated_at` (TIMESTAMP, default `utcnow`)
* *Constraint:* Unique index on `(user_one, user_two)` to ensure only one conversation exists per pair.

### 11. `messages`
Stores individual chat messages.
* `message_id` (UUID, Primary Key)
* `conversation_id` (UUID, FK -> `conversations.conversation_id` ON DELETE CASCADE, Not Null)
* `sender_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `receiver_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `content` (TEXT, Not Null)
* `is_read` (BOOLEAN, default `False`)
* `created_at` (TIMESTAMP, default `utcnow`, Indexed)

### 12. `sessions`
Stores scheduled skill swaps.
* `session_id` (UUID, Primary Key)
* `requester_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `receiver_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `skill_id` (UUID, FK -> `skills.skill_id` ON DELETE CASCADE, Not Null)
* `topic` (VARCHAR(255), Not Null)
* `description` (TEXT, Nullable)
* `proposed_date` (VARCHAR(50), Not Null)
* `proposed_time` (VARCHAR(50), Not Null)
* `duration` (INTEGER, Not Null)
* `status` (VARCHAR(50), default `'Requested'`) # Requested, Accepted, Scheduled, Completed, Rejected, Cancelled
* `meeting_url` (VARCHAR(512), Nullable)
* `created_at` (TIMESTAMP)

### 13. `meetings`
Logs video session entries.
* `meeting_id` (UUID, Primary Key)
* `session_id` (UUID, FK -> `sessions.session_id` ON DELETE CASCADE, Unique, Not Null)
* `meeting_url` (VARCHAR(512), Not Null)
* `created_at` (TIMESTAMP)

### 14. `reports`
Tracks user complaints.
* `report_id` (UUID, Primary Key)
* `reporter_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `reported_user_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `reason` (VARCHAR(100), Not Null)
* `description` (TEXT, Not Null)
* `status` (VARCHAR(50), default `'Pending'`) # Pending, Reviewed, Resolved
* `created_at` (TIMESTAMP)

### 15. `admin_actions`
Audit log of admin actions.
* `action_id` (UUID, Primary Key)
* `admin_id` (UUID, FK -> `users.user_id` ON DELETE CASCADE, Not Null)
* `action_type` (VARCHAR(100), Not Null)
* `target_id` (UUID, Nullable)
* `details` (TEXT, Not Null)
* `created_at` (TIMESTAMP)
