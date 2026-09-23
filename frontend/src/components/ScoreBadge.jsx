export default function ScoreBadge({ score }) {
  const numScore = Number(score) || 0;

  let config = {
    ring: "stroke-emerald-500",
    text: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Strong Fit",
  };

  if (numScore < 50) {
    config = {
      ring: "stroke-rose-500",
      text: "text-rose-700",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      label: "Low Fit",
    };
  } else if (numScore < 75) {
    config = {
      ring: "stroke-amber-500",
      text: "text-amber-700",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Moderate Fit",
    };
  }

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            className={`${config.ring} transition-all duration-700`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-base font-bold ${config.text}`}>
            {numScore}<span className="text-[10px] font-normal text-slate-400">%</span>
          </span>
        </div>
      </div>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badge}`}
      >
        {config.label}
      </span>
    </div>
  );
}
