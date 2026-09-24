import { useState } from 'react';
import api from '../api';
import { matchCandidateClient } from '../clientMatcher';

export default function ParsedResume({ data, onMatch }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!data || !data.parsed_data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 max-w-2xl mx-auto">
        No candidate profile loaded. Please upload a resume first.
      </div>
    );
  }

  const { parsed_data, id } = data;
  const { summary, skills, experience, education } = parsed_data;

  const handleMatch = async () => {
    setIsLoading(true);
    setError('');

    try {
      const endpoint = id ? `match/${id}/` : 'match/';
      const response = await api.post(endpoint, {
        resume_id: id,
        parsed_data,
        raw_text: data.raw_text || summary || ''
      });
      onMatch(response.data);
    } catch (err) {
      console.warn('Backend match endpoint error, using client-side matching engine fallback:', err);
      try {
        const results = matchCandidateClient(parsed_data, data.raw_text || summary || '');
        onMatch(results);
      } catch (clientErr) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          'Failed to match candidate with job postings.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Action Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Resume Extracted Successfully
          </div>
          <h2 className="text-xl font-bold text-slate-900">Parsed Candidate Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review the extracted credentials before running match analysis.
          </p>
        </div>

        <button
          onClick={handleMatch}
          disabled={isLoading}
          className={`py-2.5 px-6 rounded-lg text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            isLoading
              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <span>Matching with Jobs...</span>
          ) : (
            <>
              <span>Find Matching Jobs</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Professional Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {summary}
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Technical Skills
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {skills?.length || 0} skills detected
          </span>
        </div>

        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No specific technical skills parsed.</p>
        )}
      </div>

      {/* Experience & Education */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Experience
          </h3>
          {experience && experience.length > 0 ? (
            <div className="space-y-3">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-indigo-500 pl-3 space-y-0.5">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    {exp.role || exp.title}
                  </div>
                  <div className="text-xs font-medium text-indigo-600">
                    {exp.company} {exp.duration && <span className="text-slate-400 font-normal">({exp.duration})</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Fresher candidate profile / Project-based background.</p>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Education
          </h3>
          {education && education.length > 0 ? (
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-emerald-500 pl-3 space-y-0.5">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    {edu.degree}
                  </div>
                  <div className="text-xs text-slate-600">
                    {edu.institution}
                  </div>
                  {edu.year && (
                    <div className="text-[11px] text-slate-400">
                      Graduation: {edu.year}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No education entries extracted.</p>
          )}
        </div>
      </div>
    </div>
  );
}
