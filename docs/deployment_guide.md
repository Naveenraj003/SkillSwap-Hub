# Deployment Guide

This guide describes how to deploy the SkillSwap Hub application to production environments.

---

## 1. Supabase Setup Steps

Supabase is used for user authentication and PostgreSQL database hosting.

1. Go to [Supabase Console](https://supabase.com/) and create a new project.
2. Under **Project Settings -> API**, copy:
   * **Project URL** (used as `SUPABASE_URL` in the backend environment configuration).
   * **API key** (the `anon` public token, used as `SUPABASE_KEY` in the backend environment configuration).
3. Under **Project Settings -> Database**, copy the **Transaction Connection String URL** (used as `DATABASE_URL` in the backend environment configuration). Ensure you replace the placeholder password with your actual database password.
4. Go to **Authentication -> Providers** and enable **Email/Password** authentication.

---

## 2. Backend Deployment (Render/Heroku/Fly.io)

### Deploying to Render:
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Select **Python** as the runtime environment.
3. Configure the build parameters:
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   * `DATABASE_URL`: Your Supabase connection string.
   * `SECRET_KEY`: A secure random string to sign JWTs.
   * `SUPABASE_URL`: Your Supabase Project URL.
   * `SUPABASE_KEY`: Your Supabase anon API key.
5. Click **Deploy**. SQLAlchemy will automatically initialize the database schemas upon server startup.

---

## 3. Frontend Deployment (Vercel)

1. Create a new project on Vercel and link your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Configure the build parameters:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL`: Your deployed backend API URL, e.g., `https://api.skillswaphub.com/api/v1`. Ensure there is no trailing slash.
5. Click **Deploy**.
