# SkillSwap Hub

SkillSwap Hub is a peer-to-peer learning exchange platform where users connect, share knowledge, and swap skills directly. One user teaches a skill they are expert in, and in return learns another skill from their peer. The platform includes secure messaging, connection management, session scheduling, safety controls, and administrative moderation dashboard.

---

## Key Features

* **Secure Authentication:** Supabase Auth-backed registration and login.
* **Peer Discovery:** Search for peers by skill names or exact SkillSwap IDs.
* **Connection System:** Propose, accept, decline, or cancel connection requests.
* **Privacy & Safety Controls:** Block or restrict unwanted users. Blocking severs all connections and prevents messaging.
* **Real-Time messaging:** Chat safely with active connections. Integrates backend-enforced "3-unread-message limit" to prevent spam.
* **Session Scheduling:** Book learning slots, manage invitations, and complete swaps.
* **Jitsi Video Meeting Integration:** Automatically generates Jitsi meeting room links for accepted sessions. Enables secure joining validation (participants-only).
* **Abuse Reporting:** Submit reports and complaints on abusive behavior.
* **Admin Dashboard:** Search directory users, suspend/activate accounts, process abuse reports, and audit logs timeline actions.

---

## Technical Stack

* **Backend API:** FastAPI, SQLAlchemy 2.0 ORM, PostgreSQL (via psycopg2), Pydantic v2 schemas.
* **Frontend App:** Vite + React (TypeScript), TailwindCSS v4, Axios, React Router, Lucide Icons.
* **Authentication Provider:** Supabase Auth Client.

---

## Local Development Setup

### 1. Prerequisites
* Python 3.10+
* Node.js 18+
* PostgreSQL database

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template file:
   ```bash
   copy .env.example .env
   ```
5. Edit `.env` and fill in your Supabase connection parameters and PostgreSQL database URI:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
   SECRET_KEY=your-jwt-signing-secret
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   ```
6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Note: Database tables are automatically generated on startup when connecting to the configured PostgreSQL instance.*

---

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the npm packages:
   ```bash
   npm install
   ```
3. Copy the environment template file:
   ```bash
   copy .env.example .env
   ```
4. Run the Vite development bundler server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## Deployment Instructions

### Frontend (Vercel)
1. In the Vercel dashboard, click **Add New Project** and import the repository.
2. Set the **Root Directory** to `frontend`.
3. Add the following Environment Variable:
   * `VITE_API_URL`: Your deployed FastAPI backend URL, e.g., `https://api.skillswaphub.com/api/v1`.
4. Deploy the project.

### Backend (Render / Heroku / Fly.io)
1. Create a new Web Service pointing to the repository.
2. Set the **Build Command** to:
   ```bash
   pip install -r requirements.txt
   ```
3. Set the **Start Command** to:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Add the required Environment Variables matching the backend `.env` template.

### Database (Supabase)
1. Provision a free PostgreSQL database instance inside the Supabase console.
2. Paste the provided Connection String URL under the backend `DATABASE_URL` environment variable.
3. On backend deployment startup, SQLAlchemy will automatically run the schema metadata creations.
