import { ChevronRight, Truck, Zap, BarChart3, Shield } from 'lucide-react';
import { DIMENSIONS } from '../data/assessment';

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
            <Truck className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-blue-400 font-semibold text-sm tracking-widest uppercase">
            Autonomous Transport
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Maturity Assessment
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-1">
            Framework
          </span>
        </h1>

        <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
          Evaluate your organization's readiness across 7 key dimensions and receive a
          personalized roadmap to advance your autonomous transport capabilities.
        </p>

        <div className="flex flex-wrap gap-6 mb-12">
          {[
            { icon: BarChart3, label: '7 Dimensions', sub: 'Comprehensive coverage' },
            { icon: Zap, label: '~10 Minutes', sub: 'Quick to complete' },
            { icon: Shield, label: 'Confidential', sub: 'No data stored' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <Icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-105"
        >
          Begin Assessment
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Dimensions grid */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Assessment Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIMENSIONS.map((dim) => (
            <div
              key={dim.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{dim.icon}</span>
                <h3 className="font-semibold text-white">{dim.name}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{dim.description}</p>
              <div className="mt-3 text-xs text-slate-500">
                {dim.questions.length} questions
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
