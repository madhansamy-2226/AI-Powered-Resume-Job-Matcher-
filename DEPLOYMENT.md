# 🚀 Complete Deployment Guide: AI Resume-Job Matcher

This project uses a standard, industry-standard modern 3-tier cloud architecture:
- **Database:** Supabase PostgreSQL (Cloud Database — *Already Live & Configured*)
- **Backend API:** Render / Railway (Python + Django REST Framework)
- **Frontend UI:** Vercel (React + Vite)

---

## 📦 Step 1: Push Project to GitHub

Open a terminal in your project root (`Ai Resume-job matcher`) and run:

```bash
git init
git add .
git commit -m "Initial commit: AI Resume Matcher full stack with Supabase & Gemini"

# Create a repository on GitHub (e.g. ai-resume-job-matcher) and link:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-job-matcher.git
git push -u origin main
```

---

## 🐍 Step 2: Deploy Django Backend on Render (Free)

1. Go to **[Render.com](https://render.com/)** and log in with GitHub.
2. Click **New +** ➔ **Web Service**.
3. Select your GitHub repository (`ai-resume-job-matcher`).
4. Configure the service settings:
   - **Name:** `ai-resume-matcher-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --no-input
     ```
   - **Start Command:**
     ```bash
     gunicorn config.wsgi:application
     ```
   - **Instance Type:** `Free`

5. Under **Environment Variables**, add the following:
   | Key | Value |
   |---|---|
   | `SECRET_KEY` | `django-insecure-production-secret-key-12345` |
   | `DB_NAME` | `postgres` |
   | `DB_USER` | `django_user.bizhnakccezfgmbhgjry` |
   | `DB_PASSWORD` | `ResumeMatcher2026!` |
   | `DB_HOST` | `aws-0-ap-south-1.pooler.supabase.com` |
   | `DB_PORT` | `6543` |
   | `GEMINI_API_KEY` | *Your Gemini API Key (e.g. AIzaSy...)* |
   | `PYTHON_VERSION` | `3.11.9` |

6. Click **Create Web Service**.
7. Once deployment finishes, copy your Render API URL (e.g., `https://ai-resume-matcher-api.onrender.com`).

---

## ⚛️ Step 3: Deploy React Frontend on Vercel (Free)

1. Go to **[Vercel.com](https://vercel.com/)** and log in with GitHub.
2. Click **Add New...** ➔ **Project**.
3. Select your GitHub repository (`ai-resume-job-matcher`).
4. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit ➔ Select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://ai-resume-matcher-api.onrender.com/api/` |
   *(Replace with your actual Render URL ending with `/api/`)*
6. Click **Deploy**.
7. In ~60 seconds, your frontend will be live at `https://your-project.vercel.app`!

---

## 🗄️ Step 4: Supabase Database (Already Live)

Your Supabase database is active and pre-populated:
- **Host:** `aws-0-ap-south-1.pooler.supabase.com`
- **Port:** `6543`
- **Database:** `postgres`
- **User:** `django_user.bizhnakccezfgmbhgjry`
- **Tables:** `resumes_jobposting` (5 seed jobs ready), `resumes_resume`, `resumes_matchresult`

---

## ✅ Step 5: Verification & Testing

1. Open your live Vercel frontend URL.
2. Click **Use Sample Profile** (or upload your PDF resume).
3. Review the extracted skills & experience.
4. Click **Find Matching Jobs** ➔ See AI fit scores and feedback calculated live!
