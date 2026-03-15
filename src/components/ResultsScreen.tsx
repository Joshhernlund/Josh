import { RotateCcw, Download, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  DIMENSIONS,
  MATURITY_LEVELS,
  getDimensionScore,
  getOverallScore,
  getMaturityLevel,
} from '../data/assessment';

interface Props {
  answers: Record<string, number>;
  onReset: () => void;
}

function MaturityBadge({ score }: { score: number }) {
  const level = getMaturityLevel(score);
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
      style={{ backgroundColor: level.bgColor, color: level.color, borderColor: level.color + '40' }}
    >
      <span>Level {level.level}</span>
      <span>·</span>
      <span>{level.name}</span>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const level = getMaturityLevel(score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={level.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-sm text-slate-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function DimensionCard({
  dimensionId,
  answers,
}: {
  dimensionId: string;
  answers: Record<string, number>;
}) {
  const dim = DIMENSIONS.find((d) => d.id === dimensionId)!;
  const score = getDimensionScore(dimensionId, answers);
  const level = getMaturityLevel(score);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{dim.icon}</span>
          <h3 className="font-semibold text-slate-700 text-sm">{dim.name}</h3>
        </div>
        <span className="text-2xl font-bold" style={{ color: level.color }}>
          {score}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: dim.color }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: level.color }}>
          {level.name}
        </span>
        <span className="text-xs text-slate-400">Level {level.level}/5</span>
      </div>
    </div>
  );
}

function RecommendationCard({
  dimensionId,
  score,
}: {
  dimensionId: string;
  score: number;
}) {
  const dim = DIMENSIONS.find((d) => d.id === dimensionId)!;
  const level = getMaturityLevel(score);

  const recommendations: Record<string, Record<number, string>> = {
    strategy: {
      1: 'Develop a formal autonomous transport vision document and secure executive sponsorship.',
      2: 'Create a multi-year roadmap with measurable milestones and dedicated budget allocation.',
      3: 'Establish governance structures and KPIs to track autonomous transport progress.',
      4: 'Benchmark against industry leaders and integrate AT strategy into corporate planning cycles.',
      5: 'Lead industry consortiums and share best practices to shape the future of autonomous transport.',
    },
    technology: {
      1: 'Begin technology landscaping and run small proof-of-concept pilots with AV vendors.',
      2: 'Expand pilots, define technology architecture standards, and build internal expertise.',
      3: 'Implement an integrated technology platform and systematic testing/validation processes.',
      4: 'Scale deployments with continuous performance monitoring and optimization feedback loops.',
      5: 'Invest in proprietary R&D and co-develop next-generation autonomous technology.',
    },
    infrastructure: {
      1: 'Audit existing infrastructure gaps and develop a phased upgrade investment plan.',
      2: 'Begin V2X connectivity trials and smart charging infrastructure deployment.',
      3: 'Roll out standardized infrastructure upgrades across operational areas.',
      4: 'Achieve comprehensive connectivity coverage and predictive infrastructure maintenance.',
      5: 'Pioneer smart infrastructure integrations and contribute to open standards.',
    },
    safety: {
      1: 'Establish a dedicated AV safety team and conduct a baseline regulatory compliance review.',
      2: 'Implement a formal safety management system and begin regulatory approval processes.',
      3: 'Achieve full regulatory compliance and deploy proactive cybersecurity measures.',
      4: 'Implement predictive safety analytics and automated incident response workflows.',
      5: 'Lead regulatory development and publish safety performance as an industry benchmark.',
    },
    data: {
      1: 'Define a data strategy and identify key data sources across the vehicle fleet.',
      2: 'Build centralized data infrastructure and begin basic AI/ML experimentation.',
      3: 'Deploy production AI/ML models and establish data governance policies.',
      4: 'Achieve real-time analytics capabilities and automated optimization loops.',
      5: 'Develop proprietary AI models and establish data-sharing ecosystems with partners.',
    },
    operations: {
      1: 'Map current operational processes and identify key change management needs.',
      2: 'Pilot new operational workflows and begin workforce reskilling programs.',
      3: 'Standardize AV operational procedures and deploy structured training curricula.',
      4: 'Optimize operations with performance metrics and a skilled autonomous transport workforce.',
      5: 'Continuously innovate operational models and lead industry workforce development.',
    },
    sustainability: {
      1: 'Establish baseline emissions measurement and set autonomous transport sustainability goals.',
      2: 'Integrate sustainability KPIs into AT planning and launch community engagement pilots.',
      3: 'Implement carbon tracking across AV fleet and formalize community partnerships.',
      4: 'Achieve measurable emissions reductions and integrate with smart city initiatives.',
      5: 'Position as a sustainability leader and contribute to net-zero transport ecosystems.',
    },
  };

  const rec = recommendations[dimensionId]?.[level.level] || 'Continue optimizing current capabilities.';
  const isStrength = score >= 60;

  return (
    <div className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex-shrink-0 mt-0.5">
        {isStrength ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-500" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{dim.icon}</span>
          <span className="font-semibold text-slate-700 text-sm">{dim.name}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: dim.color, backgroundColor: `${dim.color}15` }}>
            Score: {score}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{rec}</p>
      </div>
    </div>
  );
}

export default function ResultsScreen({ answers, onReset }: Props) {
  const overallScore = getOverallScore(answers);
  const overallLevel = getMaturityLevel(overallScore);

  const radarData = DIMENSIONS.map((dim) => ({
    subject: dim.shortName,
    score: getDimensionScore(dim.id, answers),
    fullMark: 100,
  }));

  const dimensionScores = DIMENSIONS.map((dim) => ({
    id: dim.id,
    score: getDimensionScore(dim.id, answers),
  })).sort((a, b) => a.score - b.score);

  const weakAreas = dimensionScores.slice(0, 3);
  const strongAreas = dimensionScores.slice(-2).reverse();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Assessment Complete
              </p>
              <h1 className="text-3xl font-bold mb-4">Your Maturity Results</h1>
              <MaturityBadge score={overallScore} />
              <p className="text-slate-300 mt-4 max-w-lg leading-relaxed text-sm">
                {overallLevel.description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge score={overallScore} />
              <span className="text-slate-300 text-sm">Overall Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Maturity scale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Maturity Scale
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            {MATURITY_LEVELS.map((level) => {
              const isActive = overallLevel.level === level.level;
              return (
                <div
                  key={level.level}
                  className={`flex-1 rounded-xl p-4 border-2 transition-all ${
                    isActive ? 'shadow-md scale-105' : 'opacity-60'
                  }`}
                  style={{
                    borderColor: isActive ? level.color : 'transparent',
                    backgroundColor: level.bgColor,
                  }}
                >
                  <div className="font-bold text-sm mb-0.5" style={{ color: level.color }}>
                    {level.name}
                  </div>
                  <div className="text-xs text-slate-500">Level {level.level}</div>
                  {isActive && (
                    <div className="mt-2 w-2 h-2 rounded-full mx-auto" style={{ backgroundColor: level.color }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar + dimension scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Capability Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6' }}
                />
                <Tooltip
                  formatter={(value) => [`${value}/100`, 'Score']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension scores */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Dimension Breakdown</h2>
            <div className="space-y-3">
              {DIMENSIONS.map((dim) => {
                const score = getDimensionScore(dim.id, answers);
                const level = getMaturityLevel(score);
                return (
                  <div key={dim.id} className="flex items-center gap-3">
                    <span className="text-base w-6 flex-shrink-0">{dim.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">{dim.shortName}</span>
                        <span className="text-sm font-bold ml-2" style={{ color: level.color }}>
                          {score}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${score}%`, backgroundColor: dim.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dimension cards */}
        <div>
          <h2 className="font-bold text-slate-800 text-lg mb-4">Detailed Scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIMENSIONS.map((dim) => (
              <DimensionCard key={dim.id} dimensionId={dim.id} answers={answers} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="font-bold text-slate-800 text-lg mb-4">
            Priority Recommendations
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              Focus areas requiring immediate attention
            </p>
            {weakAreas.map((item) => (
              <RecommendationCard key={item.id} dimensionId={item.id} score={item.score} />
            ))}

            {strongAreas.length > 0 && (
              <>
                <p className="text-sm text-slate-500 mt-6 mb-4 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Areas of strength to build upon
                </p>
                {strongAreas.map((item) => (
                  <RecommendationCard key={item.id} dimensionId={item.id} score={item.score} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pb-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
