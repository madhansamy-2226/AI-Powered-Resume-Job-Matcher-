# 🤖 AI Resume & Job Matcher

An AI-powered full-stack application that automates **resume parsing, candidate profiling, and job compatibility analysis**. Users can upload PDF resumes, extract structured candidate information using **Google Gemini 2.0 Flash**, and evaluate compatibility against job postings using an automated matching engine.

The application combines **AI-powered semantic evaluation with rule-based fallback matching** to provide reliable compatibility scores, personalized insights, strengths, and skill gaps.

---

## 🚀 Features

* 📄 **AI Resume Parsing** — Extracts skills, experience, education, and summary from PDF resumes.
* 🤖 **Gemini AI Integration** — Uses Google Gemini 2.0 Flash for structured resume analysis.
* 🔍 **Intelligent Job Matching** — Compares candidate profiles against job requirements.
* 📊 **Compatibility Scoring** — Generates job compatibility scores on a 0–100 scale.
* 💡 **Personalized Insights** — Identifies candidate strengths and skill gaps for each job.
* 🔄 **Rule-Based Fallback** — Provides matching functionality when AI processing is unavailable.
* 🔐 **RESTful API Architecture** — Dedicated APIs for resumes, jobs, and matching results.
* 🗄️ **Cloud PostgreSQL Database** — Stores resumes, job postings, and historical match results.
* 📱 **Responsive Dashboard** — React-based interface for viewing and filtering job matches.
* ☁️ **Cloud Deployment** — Frontend and backend deployed independently for scalability.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │   Frontend / Vite    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django REST API    │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │   pdfplumber    │        │  Gemini 2.0     │
        │  PDF Extraction │        │     Flash       │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ Structured Candidate │
                    │       Profile        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Supabase PostgreSQL   │
                    │                      │
                    │ Resumes              │
                    │ Job Postings         │
                    │ Match Results        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Matching Engine     │
                    │ Skills + Experience  │
                    │ + Domain Alignment   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Match Dashboard    │
                    │ Score + Strengths    │
                    │ + Skill Gaps         │
                    └──────────────────────┘
```

---

## 🔄 Application Workflow

```text
Upload Resume
      ↓
Extract PDF Text
      ↓
Gemini AI Resume Analysis
      ↓
Structured Candidate Profile
      ↓
Store in PostgreSQL
      ↓
Fetch Active Job Postings
      ↓
Evaluate Candidate vs Job
      ↓
Generate Compatibility Score
      ↓
Display Results & Skill Gaps
```

---

## 🧠 AI Matching Engine

The application uses a dual-layer matching approach.

### Primary: Gemini AI Evaluation

Candidate information is evaluated against job descriptions and requirements using Google Gemini 2.0 Flash.

The evaluation considers:

| Evaluation Area           | Weight |
| ------------------------- | -----: |
| Skills Alignment          |    50% |
| Experience Relevance      |    30% |
| Domain & Foundational Fit |    20% |

The system generates:

* Compatibility score
* Matching explanation
* Candidate strengths
* Skill gaps
* Job-specific feedback

### Fallback: Rule-Based Matching

If AI processing is unavailable or rate-limited, the application uses a rule-based keyword matching algorithm based on:

* Matched technical skills
* Job title alignment
* Candidate profile keywords

This provides a fallback mechanism for continued matching functionality.

---

## 🛠️ Technology Stack

### Backend

* Python 3.11
* Django 5.x
* Django REST Framework
* Gunicorn
* WhiteNoise

### AI & Processing

* Google Gemini 2.0 Flash
* Google GenAI SDK
* pdfplumber
* Rule-Based NLP

### Frontend

* React 18
* Vite
* JavaScript
* Tailwind CSS
* Axios

### Database

* PostgreSQL
* Supabase
* JSONB

### Deployment

* Vercel — Frontend
* Render — Backend API
* Supabase — PostgreSQL Database

---

## 🔌 REST API

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| `POST` | `/api/upload/`              | Upload and process a PDF resume     |
| `POST` | `/api/match/<resume_id>/`   | Match a resume against job postings |
| `GET`  | `/api/jobs/`                | Retrieve available job postings     |
| `GET`  | `/api/results/<resume_id>/` | Retrieve previous matching results  |

### Resume Upload

```http
POST /api/upload/
Content-Type: multipart/form-data
```

The endpoint:

1. Accepts a PDF resume.
2. Extracts text using `pdfplumber`.
3. Sends structured content to Gemini.
4. Generates candidate profile data.
5. Stores the processed resume in PostgreSQL.

### Job Matching

```http
POST /api/match/<resume_id>/
```

Returns job-specific:

```json
{
  "score": 92,
  "explanation": "Strong alignment with the required backend technologies.",
  "strengths": [
    "Python",
    "Django",
    "PostgreSQL"
  ],
  "gaps": [
    "CI/CD experience"
  ]
}
```

---

## 🗄️ Data Model

The application uses three primary entities:

```text
Resume
 ├── Candidate profile
 ├── Extracted skills
 ├── Experience
 └── Education

Job Posting
 ├── Title
 ├── Company
 ├── Description
 └── Requirements

Match Result
 ├── Compatibility score
 ├── Explanation
 ├── Strengths
 └── Skill gaps
```

Resume and job data are persisted in **Supabase PostgreSQL**, while structured AI-generated profile information and matching insights are stored using PostgreSQL JSONB fields.

---

## 📂 Project Structure

```text
AI-Resume-Job-Matcher/
│
├── backend/
│   ├── config/
│   ├── resumes/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── DEPLOYMENT.md
├── README.md
└── .gitignore
```

---

## 💻 Local Development

### Prerequisites

Make sure you have installed:

* Python 3.11+
* Node.js 18+
* npm
* PostgreSQL / Supabase account
* Google Gemini API key

### 1. Clone Repository

```bash
git clone https://github.com/your-username/AI-Resume-Job-Matcher.git

cd AI-Resume-Job-Matcher
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

#### Windows

```bash
.\venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173/
```

---

## 🔐 Environment Variables

Create a `.env` file for the backend:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

GEMINI_API_KEY=your-gemini-api-key

DATABASE_URL=your-supabase-postgresql-connection-string
```

For the frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

> Never commit `.env` files or API keys to GitHub.

---

## ☁️ Production Deployment

### Frontend — Vercel

```text
Build Command:
npm run build

Output Directory:
dist
```

Environment variable:

```env
VITE_API_URL=https://your-api.onrender.com/api/
```

### Backend — Render

Build command:

```bash
pip install -r requirements.txt && python manage.py collectstatic --no-input
```

Start command:

```bash
gunicorn config.wsgi:application
```

### Database — Supabase

The production backend uses **Supabase PostgreSQL** for cloud database persistence.

---

## 📊 Key Technical Highlights

* AI-powered PDF resume parsing
* Structured JSON extraction from unstructured documents
* LLM-based candidate-job evaluation
* Rule-based fallback matching
* REST API architecture
* PostgreSQL JSONB data storage
* Multipart PDF file uploads
* React dashboard
* Cloud deployment
* Separation of frontend, backend, and database layers

---

## 🔮 Future Enhancements

* [ ] Resume-to-job semantic embeddings
* [ ] Vector database integration
* [ ] Recruiter dashboard
* [ ] Resume improvement recommendations
* [ ] Job recommendation engine
* [ ] Authentication and user accounts
* [ ] Email notifications for high-match jobs
* [ ] Resume scoring and ATS keyword analysis
* [ ] Advanced analytics dashboard

---

## 👨‍💻 Author

**Madhan S**

**Full Stack Python Developer**

* GitHub: `https://github.com/madhansamy-2226`
* LinkedIn: `https://linkedin.com/in/madhan-sn2226`

---

## 📄 License

This project is developed for **educational, portfolio, and demonstration purposes**.
