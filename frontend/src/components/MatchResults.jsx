import { useState } from 'react';
import ScoreBadge from './ScoreBadge';

export default function MatchResults({ results, onReset }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJobId, setExpandedJobId] = useState(null);

  if (!results || results.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-xl mx-auto">
        <p className="text-slate-600 mb-4 text-sm">No match evaluation available.</p>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Try Another Resume
        </button>
      </div>
    );
  }

  const topMatch = results[0];
  const strongCount = results.filter((r) => (r.score || 0) >= 75).length;
  const moderateCount = results.filter((r) => (r.score || 0) >= 50 && (r.score || 0) < 75).length;

  const filteredResults = results
    .filter((r) => {
      if (filter === 'high') return (r.score || 0) >= 75;
      if (filter === 'moderate') return (r.score || 0) >= 50 && (r.score || 0) < 75;
      return true;
    })
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.job?.title?.toLowerCase().includes(q) ||
        r.job?.company?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Meta Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Job Fit Evaluation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matched against {results.length} active job postings in the database
            </p>
          </div>

          {/* Exact Filter Tabs as requested */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Roles ({results.length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'high'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Strong Fit (75%+)
            </button>
            <button
              onClick={() => setFilter('moderate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'moderate'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Moderate (50-74%)
            </button>
          </div>
        </div>

        {/* Quick Top Match Callout */}
        {topMatch && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Top Recommendation: <strong className="text-slate-900">{topMatch.job?.title}</strong> at {topMatch.job?.company}
            </span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {topMatch.score}% Score
            </span>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result, index) => {
          const isTop = index === 0 && filter === 'all' && (result.score || 0) >= 75;
          const isExpanded = expandedJobId === result.id;

          return (
            <div
              key={result.id || index}
              className={`bg-white rounded-xl border p-6 transition-all ${
                isTop
                  ? 'border-indigo-300 ring-1 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Score Circular Ring */}
                <div className="flex-shrink-0 self-center sm:self-start">
                  <ScoreBadge score={result.score} />
                </div>

                {/* Main Details */}
                <div className="flex-grow space-y-3 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {result.job?.title}
                      </h3>
                      <div className="text-xs font-medium text-indigo-600 mt-0.5">
                        {result.job?.company}
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation Box */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-800 block mb-0.5">AI Fit Analysis:</span>
                    {result.explanation}
                  </div>

                  {/* Strengths & Gaps */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    {/* Strengths */}
                    {result.strengths && result.strengths.length > 0 && (
                      <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100">
                        <span className="font-semibold text-emerald-900 text-xs block mb-1">
                          ✓ Key Strengths
                        </span>
                        <ul className="space-y-1 text-xs text-emerald-800">
                          {result.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gaps */}
                    {result.gaps && result.gaps.length > 0 && (
                      <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-100">
                        <span className="font-semibold text-amber-900 text-xs block mb-1">
                          ! Gaps / Recommendations
                        </span>
                        <ul className="space-y-1 text-xs text-amber-800">
                          {result.gaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Expand Job Description */}
                  {result.job?.description && (
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : result.id)}
                        className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Job Details' : 'View Job Description & Requirements'}</span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed space-y-2">
                          <div className="font-semibold text-slate-900">Job Description:</div>
                          <p>{result.job.description}</p>
                          {result.job.requirements && (
                            <>
                              <div className="font-semibold text-slate-900 pt-1">Requirements:</div>
                              <p>{result.job.requirements}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          ← Upload Another Resume
        </button>
      </div>
    </div>
  );
}
