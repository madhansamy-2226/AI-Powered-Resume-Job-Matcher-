import { useState, useRef } from 'react';
import api from '../api';
import { extractPdfText, parseResumeClient } from '../clientMatcher';

const DEMO_PROFILES = [
  {
    id: 1,
    name: "Madhan S.",
    role: "Full Stack Python Developer (Fresher)",
    skills: ["Python", "Django", "DRF", "React.js", "PostgreSQL", "Docker", "REST APIs"],
    desc: "Intern at Besant Technologies • Built 3+ Web Apps with Django & React",
    icon: "🐍",
    data: {
      id: 2,
      parsed_data: {
        summary: "Full Stack Python Developer with hands-on expertise in Python, Django REST Framework, React.js, PostgreSQL, and Docker. Proven track record building end-to-end web applications with JWT authentication, RBAC, and responsive UI.",
        skills: ["Python", "Django", "Django REST Framework", "React.js", "JavaScript", "PostgreSQL", "SQL", "Docker", "Git", "REST APIs", "JWT Auth", "Supabase", "Postman", "Swagger", "HTML5", "CSS3"],
        experience: [
          {
            role: "Python Full Stack Developer Intern",
            company: "Besant Technologies Chennai",
            duration: "Jul 2025 – Feb 2026",
            description: "Engineered 15+ production-ready REST APIs with Django REST Framework. Developed responsive React.js frontends and optimized PostgreSQL queries."
          }
        ],
        education: [
          {
            degree: "Bachelor of Computer Science (B.Sc CS)",
            institution: "Ranipet Arts and Science College, Thiruvalluvar University",
            year: "2022 – 2025"
          }
        ]
      }
    }
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Frontend React & UI Engineer (Fresher)",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Redux", "Next.js", "UI/UX"],
    desc: "Frontend Intern • 6 Months building responsive React dashboards",
    icon: "⚛️",
    data: {
      id: 1,
      parsed_data: {
        summary: "Frontend Developer specializing in React.js, TypeScript, Tailwind CSS, and state management. Passionate about component architecture, performance optimization, and cross-browser responsive interfaces.",
        skills: ["React.js", "TypeScript", "JavaScript ES6+", "Tailwind CSS", "Redux Toolkit", "Next.js", "HTML5", "CSS3", "Vite", "Git", "REST APIs", "Figma"],
        experience: [
          {
            role: "Frontend Engineer Intern",
            company: "WebCraft Digital Studio",
            duration: "Aug 2025 – Jan 2026",
            description: "Developed reusable React UI component library, integrated REST endpoints, and improved client-side rendering speed by 35%."
          }
        ],
        education: [
          {
            degree: "B.Tech in Computer Engineering",
            institution: "Anna University",
            year: "2021 – 2025"
          }
        ]
      }
    }
  },
  {
    id: 3,
    name: "Vikram Kumar",
    role: "Data Analyst & Python (Fresher)",
    skills: ["Python", "SQL", "Pandas", "PostgreSQL", "Tableau", "FastAPI"],
    desc: "Data Analytics Intern • SQL querying & interactive Tableau dashboards",
    icon: "📊",
    data: {
      id: 2,
      parsed_data: {
        summary: "Data Analyst and Python Developer with strong analytical capabilities in SQL querying, Python data wrangling (Pandas, NumPy), data visualization (Tableau, PowerBI), and RESTful API backend integration.",
        skills: ["SQL", "Python", "Pandas", "NumPy", "PostgreSQL", "Tableau", "PowerBI", "FastAPI", "Data Modeling", "ETL Pipelines", "Git"],
        experience: [
          {
            role: "Data Analyst Intern",
            company: "Insight Analytics Corp",
            duration: "May 2025 – Dec 2025",
            description: "Formulated SQL queries across 100K+ records, designed business intelligence dashboards in Tableau, and automated reporting pipelines."
          }
        ],
        education: [
          {
            degree: "B.Sc in Data Science & Statistics",
            institution: "Madras University",
            year: "2022 – 2025"
          }
        ]
      }
    }
  }
];

export default function ResumeUpload({ onSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.endsWith('.pdf')) {
        setFile(dropped);
      } else {
        setError('Please upload a PDF document.');
      }
    }
  };

  const handleFileChange = (e) => {
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
      } else {
        setError('Please upload a PDF document.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF resume file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(response.data);
    } catch (err) {
      console.warn('Backend upload encountered issue, executing resilient client-side analysis:', err);
      try {
        const rawText = await extractPdfText(file);
        const parsedResult = parseResumeClient(rawText, file.name);
        onSuccess(parsedResult);
      } catch (clientErr) {
        setError('Failed to extract resume data. Please try another PDF or use a sample profile below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = (profile) => {
    setIsLoading(true);
    setTimeout(() => {
      onSuccess(profile.data);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Upload Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Upload Resume (PDF)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI Engine will extract skills, experience, and education structured data.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : file
              ? 'border-emerald-400 bg-emerald-50/40'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-2.5">
            {file ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{file.name}</div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • PDF Ready for AI analysis
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 underline font-medium pt-1"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-xl shadow-xs">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="text-indigo-600 font-semibold hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF files up to 5MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              !file || isLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
            }`}
          >
            {isLoading ? (
              <span>Extracting Skills with AI...</span>
            ) : (
              <span>Upload & Analyze</span>
            )}
          </button>
        </div>
      </div>

      {/* Demo Profile Cards */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Or Test with a Pre-Loaded Sample Profile
          </h3>
          <span className="text-[11px] text-slate-400">One-click test</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {DEMO_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleLoadDemo(profile)}
              disabled={isLoading}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-left transition-all flex flex-col justify-between group bg-slate-50/50"
            >
              <div>
                <div className="text-lg mb-1">{profile.icon}</div>
                <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-600">
                  {profile.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {profile.role}
                </div>
              </div>
              <div className="mt-3 text-[10px] font-semibold text-indigo-600">
                Load Profile →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
