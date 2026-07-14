# API Endpoint Documentation

This document describes the HTTP endpoints exposed by the SkillSwap Hub backend. All endpoints are prefixed with `/api/v1`.

---

## 1. Authentication Router (`/auth`)

* **`POST /auth/register`**
  * *Auth:* No
  * *Request Body:* `UserRegister` (email, password, full_name)
  * *Response:* `UserOut`
* **`POST /auth/login`**
  * *Auth:* No
  * *Request Body:* `UserLogin` (email, password)
  * *Response:* `Token` (access_token, token_type)
* **`GET /auth/me`**
  * *Auth:* Yes
  * *Response:* `UserOut`

---

## 2. Profile Router (`/profile`)

* **`GET /profile/me`**
  * *Auth:* Yes
  * *Response:* `UserWithProfileOut`
* **`PUT /profile/me`**
  * *Auth:* Yes
  * *Request Body:* `ProfileUpdate` (full_name, bio, profile_image, experience)
  * *Response:* `ProfileOut`
* **`GET /profile/{user_id}`**
  * *Auth:* Yes
  * *Response:* `PublicUserOut`

---

## 3. Skills Router (`/skills`)

* **`GET /skills/available`**
  * *Auth:* Yes
  * *Response:* `List[SkillOut]`
* **`POST /skills/my-skills`**
  * *Auth:* Yes
  * *Request Body:* `UserSkillCreate` (skill_id, skill_type, skill_level)
  * *Response:* `UserSkillOut`
* **`GET /skills/my-skills`**
  * *Auth:* Yes
  * *Response:* `List[UserSkillOut]`
* **`DELETE /skills/my-skills/{user_skill_id}`**
  * *Auth:* Yes
  * *Response:* `{"message": "Skill deleted successfully"}`

---

## 4. Search Router (`/search`)

* **`GET /search/skill`**
  * *Auth:* Yes
  * *Query Params:* `query` (skill name)
  * *Response:* `List[SearchResultUser]`
* **`GET /search/id`**
  * *Auth:* Yes
  * *Query Params:* `query` (SkillSwap ID)
  * *Response:* `ExactProfile`

---

## 5. Connections Router (`/connections`)

* **`POST /connections/request`**
  * *Auth:* Yes
  * *Request Body:* `sender_id`, `receiver_id`, `skill_id`, `message`
  * *Response:* `ConnectionRequestOut`
* **`GET /connections/requests/received`**
  * *Auth:* Yes
  * *Response:* `List[ConnectionRequestOut]`
* **`GET /connections/requests/sent`**
  * *Auth:* Yes
  * *Response:* `List[ConnectionRequestOut]`
* **`POST /connections/requests/{request_id}/accept`**
  * *Auth:* Yes
  * *Response:* `{"message": "Connection established successfully"}`
* **`POST /connections/requests/{request_id}/reject`**
  * *Auth:* Yes
  * *Response:* `{"message": "Connection request rejected"}`
* **`POST /connections/requests/{request_id}/cancel`**
  * *Auth:* Yes
  * *Response:* `{"message": "Connection request cancelled"}`
* **`GET /connections`**
  * *Auth:* Yes
  * *Response:* `List[PublicUserOut]`

---

## 6. Notifications Router (`/notifications`)

* **`GET /notifications`**
  * *Auth:* Yes
  * *Response:* `List[NotificationOut]`
* **`PUT /notifications/{notification_id}/read`**
  * *Auth:* Yes
  * *Response:* `NotificationOut`

---

## 7. Privacy Router (`/privacy`)

* **`POST /privacy/block`**
  * *Auth:* Yes
  * *Query Params:* `blocked_user_id`
  * *Response:* `BlockOut`
* **`POST /privacy/unblock`**
  * *Auth:* Yes
  * *Query Params:* `blocked_user_id`
  * *Response:* `{"message": "User unblocked successfully"}`
* **`POST /privacy/restrict`**
  * *Auth:* Yes
  * *Query Params:* `restricted_user_id`, `reason`
  * *Response:* `RestrictionOut`
* **`POST /privacy/unrestrict`**
  * *Auth:* Yes
  * *Query Params:* `restricted_user_id`
  * *Response:* `{"message": "Restriction removed successfully"}`
* **`GET /privacy/blocked`**
  * *Auth:* Yes
  * *Response:* `List[BlockOut]`
* **`GET /privacy/restricted`**
  * *Auth:* Yes
  * *Response:* `List[RestrictionOut]`

---

## 8. Chat Router (`/chat`)

* **`POST /chat/conversations`**
  * *Auth:* Yes
  * *Request Body:* `ConversationCreate` (receiver_id)
  * *Response:* `ConversationOut`
* **`GET /chat/conversations`**
  * *Auth:* Yes
  * *Response:* `List[ConversationOut]`
* **`GET /chat/conversations/{conversation_id}/messages`**
  * *Auth:* Yes
  * *Response:* `List[MessageOut]`
* **`POST /chat/conversations/{conversation_id}/messages`**
  * *Auth:* Yes
  * *Request Body:* `MessageCreate` (content)
  * *Response:* `MessageOut`
* **`PUT /chat/conversations/{conversation_id}/read`**
  * *Auth:* Yes
  * *Response:* `{"message": "Messages marked as read"}`

---

## 9. Sessions Router (`/sessions`)

* **`POST /sessions/request`**
  * *Auth:* Yes
  * *Request Body:* `SessionCreate` (receiver_id, skill_id, topic, description, proposed_date, proposed_time, duration)
  * *Response:* `SessionOut`
* **`GET /sessions/requests/received`**
  * *Auth:* Yes
  * *Response:* `List[SessionOut]`
* **`GET /sessions/requests/sent`**
  * *Auth:* Yes
  * *Response:* `List[SessionOut]`
* **`POST /sessions/{session_id}/accept`**
  * *Auth:* Yes
  * *Response:* `SessionOut`
* **`POST /sessions/{session_id}/schedule`**
  * *Auth:* Yes
  * *Response:* `SessionOut`
* **`POST /sessions/{session_id}/reject`**
  * *Auth:* Yes
  * *Response:* `SessionOut`
* **`POST /sessions/{session_id}/cancel`**
  * *Auth:* Yes
  * *Response:* `SessionOut`
* **`POST /sessions/{session_id}/complete`**
  * *Auth:* Yes
  * *Response:* `SessionOut`
* **`GET /sessions/active`**
  * *Auth:* Yes
  * *Response:* `List[SessionOut]`
* **`GET /sessions/history`**
  * *Auth:* Yes
  * *Response:* `List[SessionOut]`

---

## 10. Meetings Router (`/meetings`)

* **`GET /meetings/{session_id}/join`**
  * *Auth:* Yes
  * *Response:* `MeetingOut`

---

## 11. Reports Router (`/reports`)

* **`POST /reports`**
  * *Auth:* Yes
  * *Request Body:* `ReportCreate` (reported_user_id, reason, description)
  * *Response:* `ReportOut`

---

## 12. Admin Router (`/admin`)

* **`GET /admin/users`**
  * *Auth:* Yes (Admin only)
  * *Query Params:* `search`
  * *Response:* `List[PublicUserOut]`
* **`POST /admin/users/{user_id}/suspend`**
  * *Auth:* Yes (Admin only)
  * *Query Params:* `reason`
  * *Response:* `PublicUserOut`
* **`POST /admin/users/{user_id}/activate`**
  * *Auth:* Yes (Admin only)
  * *Response:* `PublicUserOut`
* **`GET /admin/reports`**
  * *Auth:* Yes (Admin only)
  * *Response:* `List[ReportOut]`
* **`PUT /admin/reports/{report_id}/status`**
  * *Auth:* Yes (Admin only)
  * *Query Params:* `status_str`
  * *Response:* `ReportOut`
* **`GET /admin/actions`**
  * *Auth:* Yes (Admin only)
  * *Response:* `List[AdminActionOut]`
