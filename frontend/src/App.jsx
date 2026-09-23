import { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ParsedResume from './components/ParsedResume';
import MatchResults from './components/MatchResults';

const STEPS = [
  { key: 'upload', number: '1', title: 'Upload Resume' },
  { key: 'parsed', number: '2', title: 'Parsed Profile' },
  { key: 'results', number: '3', title: 'Match Results' },
];

function App() {
  const [step, setStep] = useState('upload'); // 'upload' | 'parsed' | 'results'
  const [resumeData, setResumeData] = useState(null);
  const [matchResults, setMatchResults] = useState([]);

  const handleUploadSuccess = (data) => {
    setResumeData(data);
    setStep('parsed');
  };

  const handleMatchResults = (results) => {
    setMatchResults(results);
    setStep('results');
  };

  const handleReset = () => {
    setStep('upload');
    setResumeData(null);
    setMatchResults([]);
  };

  const handleStepClick = (targetStep) => {
    if (targetStep === 'upload') {
      setStep('upload');
    } else if (targetStep === 'parsed' && resumeData) {
      setStep('parsed');
    } else if (targetStep === 'results' && matchResults.length > 0) {
      setStep('results');
    }
  };

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              RM
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base leading-tight">
                AI Resume Matcher
              </div>
              <div className="text-xs text-slate-500 hidden sm:block">
                Django REST Framework & AI Matching Engine
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Supabase DB</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>AI Match Engine</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium flex-wrap justify-center">
            {STEPS.map((s, idx) => {
              const isActive = s.key === step;
              const isPast = idx < currentStepIdx;
              const isClickable =
                s.key === 'upload' ||
                (s.key === 'parsed' && resumeData) ||
                (s.key === 'results' && matchResults.length > 0);

              return (
                <div key={s.key} className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepClick(s.key)}
                    disabled={!isClickable}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                        : isClickable
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isPast ? `✓ ${s.number}. ${s.title}` : `${s.number}. ${s.title}`}
                  </button>

                  {idx < STEPS.length - 1 && (
                    <span className="text-slate-300 font-bold">→</span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {step === 'upload' && (
          <ResumeUpload onSuccess={handleUploadSuccess} />
        )}
        {step === 'parsed' && (
          <ParsedResume
            data={resumeData}
            onMatch={handleMatchResults}
          />
        )}
        {step === 'results' && (
          <MatchResults
            results={matchResults}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Resume Matcher • Fresher Engineering Project</span>
          <span className="text-slate-400">
            Django • PostgreSQL (Supabase) • AI Match Engine • React
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
