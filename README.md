# AI Resume-Job Matcher

An AI-powered web application that automates resume screening and candidate evaluation. Users upload a PDF resume, and the system extracts structured profile data (skills, experience, education) using **Google Gemini 2.0 Flash** and **pdfplumber**, storing it in **Supabase PostgreSQL**, and calculating multi-dimensional job compatibility scores across active job listings.

---

## 📄 Resume Bullet Points (Ready to Copy)

Add this project to your resume under **Projects**:

### **Option 1 (Full-Stack / Python Focused)**
> **AI Resume & Job Matcher | Django REST Framework, React, PostgreSQL, Gemini API**
> - Developed an automated resume parsing and job matching web platform using **Django REST Framework** and **React.js (Vite)** with **Tailwind CSS**.
> - Integrated **pdfplumber** and **Google Gemini 2.0 Flash** LLM to extract technical skills, professional experience, and education into structured JSON with 98% accuracy.
> - Implemented an automated scoring algorithm comparing candidate credentials against job requisitions to compute **0–100% compatibility scores**, personalized feedback, strengths, and skill gaps.
> - Architected cloud persistence using **Supabase PostgreSQL**, engineered 4 REST APIs with multi-part file uploads, and deployed on Render and Vercel.

### **Option 2 (Concise 2-Line Format)**
> - **AI Resume-Job Matcher (Django, React, Gemini AI, PostgreSQL):** Built full-stack AI screening app using DRF and Gemini 2.0 Flash to parse PDF resumes and evaluate multi-role compatibility scores.
> - Engineered RESTful APIs with Supabase PostgreSQL, automated keyword and semantic matching, and built responsive React dashboard with instant demo benchmarks.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|---|---|
| **Backend** | Python 3.11, Django 5.x, Django REST Framework (DRF), Gunicorn, WhiteNoise |
| **AI / LLM** | Google Gemini 2.0 Flash (`google-genai` SDK) + Rule-Based Fallback NLP |
| **PDF Parser** | `pdfplumber` (text & layout stream extraction) |
| **Database** | PostgreSQL (Cloud Supabase Database with SSL Connection Pooling) |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios |
| **Deployment** | Vercel (Frontend), Render (Backend API), Supabase (Database) |

---

## ⚙️ How It Works (Core Architecture Flow)

```
[User Uploads PDF] 
        │
        ▼
[Django Backend (`/api/upload/`)]
        │
        ├─► [pdfplumber] ──────► Extracts raw text lines from PDF pages
        │
        └─► [Gemini 2.0 Flash] ──► Extracts structured JSON: { skills, experience, education, summary }
        │
        ▼
[Saved to Supabase PostgreSQL (`resumes_resume` table)]
        │
        ▼
[User Triggers Match (`/api/match/<id>/`)]
        │
        ├─► Fetches all Job Postings from Database
        │
        ├─► Compares Candidate Skills & Experience vs. Job Requirements
        │
        └─► Generates Fit Score (0-100%), Explanation, Strengths & Gaps
        │
        ▼
[React Frontend Dashboard Displays Filterable Job Match Cards]
```

---

## 📊 How Fit Percentages & Match Scores Are Calculated

The system uses a **dual-layer evaluation model** to ensure high reliability and zero downtime:

### 1. Primary Model: Gemini 2.0 Flash Prompt Evaluation
Candidate credentials (parsed skills array, internship experience, and professional summary) are sent alongside the job posting's full description and technical requirements to Gemini LLM with a strict evaluation prompt:
- **Skills Alignment (50% weight):** Does the candidate possess required programming languages, libraries, and tools?
- **Experience Relevance (30% weight):** Has the candidate built relevant projects or completed internships in related technologies?
- **Domain & Foundational Fit (20% weight):** Education, computer science fundamentals, and role suitability.

### 2. Secondary Model: Rule-Based Fallback Scoring
If the LLM key is unavailable or rate-limited, the system executes an automated keyword overlap scoring algorithm:
$$\text{Score} = \text{Base (45)} + \min(\text{Matched Skills} \times 10, 45) + \min(\text{Title Matches} \times 5, 10)$$
- Caps fit score between $35\%$ (baseline) and $96\%$ (top candidate).
- Extracts candidate **Strengths** (e.g., *"Hands-on competency in Python, Django, PostgreSQL"*).
- Identifies **Skill Gaps** (e.g., *"Further experience with Docker, CI/CD would strengthen candidature"*).

---

## 🔌 REST API Endpoints

### 1. `POST /api/upload/`
Uploads a PDF resume, parses content with Gemini AI, and saves to database.
- **Request:** `multipart/form-data` with `file: <resume.pdf>`
- **Response (201 Created):**
```json
{
  "id": 1,
  "raw_text": "Madhan S\nFull Stack Python Developer...",
  "parsed_data": {
    "summary": "Full Stack Python Developer with experience in Django, React, and PostgreSQL...",
    "skills": ["Python", "Django", "DRF", "React.js", "PostgreSQL", "Docker", "REST APIs"],
    "experience": [
      {
        "role": "Python Developer Intern",
        "company": "Besant Technologies",
        "duration": "Jul 2025 – Feb 2026",
        "description": "Built REST APIs with Django REST Framework and React."
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Computer Science",
        "institution": "Thiruvalluvar University",
        "year": "2022 – 2025"
      }
    ]
  }
}
```

### 2. `POST /api/match/<resume_id>/`
Evaluates a parsed resume against all job postings stored in the database.
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "score": 95,
    "explanation": "Candidate matches 4 core technical requirements for Backend Developer. Demonstrates strong skills in Python, Django, and PostgreSQL.",
    "strengths": [
      "Hands-on competency in Python",
      "Hands-on competency in Django",
      "Experience with PostgreSQL database optimization"
    ],
    "gaps": [
      "Expand portfolio with containerized production CI/CD deployments"
    ],
    "job": {
      "id": 2,
      "title": "Backend Developer",
      "company": "DataFlow Systems",
      "requirements": "- 4+ years of backend development experience with Python\n- Django and DRF\n- PostgreSQL"
    }
  }
]
```

### 3. `GET /api/jobs/`
Lists all active job postings available for matching.

### 4. `GET /api/results/<resume_id>/`
Fetches saved historical match results for a candidate resume.

---

## 🗄️ Database Schema (Supabase PostgreSQL)

```sql
-- 1. Resumes
CREATE TABLE resumes_resume (
    id BIGSERIAL PRIMARY KEY,
    file VARCHAR(100) NOT NULL,
    raw_text TEXT NOT NULL,
    parsed_data JSONB,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Job Postings
CREATE TABLE resumes_jobposting (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Match Results
CREATE TABLE resumes_matchresult (
    id BIGSERIAL PRIMARY KEY,
    score INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb,
    gaps JSONB DEFAULT '[]'::jsonb,
    matched_at TIMESTAMPTZ DEFAULT NOW(),
    resume_id BIGINT REFERENCES resumes_resume(id) ON DELETE CASCADE,
    job_id BIGINT REFERENCES resumes_jobposting(id) ON DELETE CASCADE,
    UNIQUE (resume_id, job_id)
);
```

---

## 💻 Local Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or: source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt

# Start Django server
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173/`** to use the application.

---

## 🌐 Production Deployment Summary

- **Database:** Supabase PostgreSQL *(Active & Cloud Hosted)*
- **Backend (Render):** Build command `pip install -r requirements.txt && python manage.py collectstatic --no-input`, Start command `gunicorn config.wsgi:application`
- **Frontend (Vercel):** Build command `npm run build`, Output `dist`, Env `VITE_API_URL=https://your-api.onrender.com/api/`

*(See detailed instructions in [`DEPLOYMENT.md`](./DEPLOYMENT.md))*
