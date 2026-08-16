import React from 'react';
import { Target, Cpu, BarChart3, BookOpen, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleWelcomeProps {
  onStart: () => void;
  onLoadSample: (key: string) => void;
  hasSavedProfile: boolean;
  onViewDashboard: () => void;
  studentName?: string;
}

export const ModuleWelcome: React.FC<ModuleWelcomeProps> = ({
  onStart,
  onLoadSample,
  hasSavedProfile,
  onViewDashboard,
  studentName,
}) => {
  const featureCards = [
    {
      id: 'feature-card-1',
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Multi-variable vector matching aligned to your unique talents, academic year, and aspirations.',
      accent: 'border-orange-200 bg-orange-50/50 text-orange-600',
    },
    {
      id: 'feature-card-2',
      icon: Cpu,
      title: 'AI & ML-Based Prediction',
      description: 'Random Forest & Decision Tree feature weighting paired with Gemini deep career guidance reasoning.',
      accent: 'border-amber-200 bg-amber-50/50 text-amber-600',
    },
    {
      id: 'feature-card-3',
      icon: BarChart3,
      title: 'Skill Matrix & Gap Analysis',
      description: 'Instant visualization of your core competencies vs. actual industry requirements and hiring bars.',
      accent: 'border-emerald-200 bg-emerald-50/50 text-emerald-600',
    },
    {
      id: 'feature-card-4',
      icon: BookOpen,
      title: 'Actionable Career Roadmaps',
      description: 'Phase-by-phase 6-month milestones, recommended free certifications, and interview focus points.',
      accent: 'border-blue-200 bg-blue-50/50 text-blue-600',
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4">
      {/* Top Banner / Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Next-Gen Machine Learning Career Guidance</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
          Find the Career That <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600">Fits You.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Answer a few questions about your skills, interests and academic performance.
          Our AI will recommend suitable career paths for you with detailed skill gap roadmaps.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="start-assessment-btn"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-base shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <span>Start Career Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {hasSavedProfile && (
            <button
              id="view-saved-dashboard-btn"
              onClick={onViewDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-medium text-base border border-stone-300 shadow-xs transition-colors cursor-pointer"
            >
              <span>View Saved Dashboard ({studentName || 'Student'})</span>
            </button>
          )}
        </div>

        {/* Quick Demo Pre-fill Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
          <span className="font-medium text-stone-400">Quick Test Samples:</span>
          <button
            id="demo-priya-quick-btn"
            onClick={() => onLoadSample('priya')}
            className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-800 border border-stone-200 transition-colors"
          >
            Priya (CS / Dev)
          </button>
          <button
            id="demo-rohit-quick-btn"
            onClick={() => onLoadSample('rohit')}
            className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-800 border border-stone-200 transition-colors"
          >
            Rohit (IT / Data)
          </button>
          <button
            id="demo-ananya-quick-btn"
            onClick={() => onLoadSample('ananya')}
            className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-800 border border-stone-200 transition-colors"
          >
            Ananya (BCA / UI/UX)
          </button>
        </div>
      </motion.div>

      {/* 4 Key Highlight Cards */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              id={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3.5 ${card.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Methodology & Flow Card (PPT Alignment) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white shadow-lg border border-stone-700/60"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Transparent ML Architecture</span>
            </div>
            <h4 className="text-lg font-bold text-white">How the Recommendation Engine Works</h4>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Our system captures 6 core skill dimensions, domain preferences, and academic performance, preprocessing features through a weighted Decision Tree & Random Forest vector model before delivering explainable match confidence scores.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 text-xs font-mono bg-stone-800/80 p-3 rounded-xl border border-stone-700">
            <span className="px-2 py-1 bg-stone-700/80 rounded text-stone-300">Input Data</span>
            <span className="text-orange-400">→</span>
            <span className="px-2 py-1 bg-stone-700/80 rounded text-stone-300">Feature Weighting</span>
            <span className="text-orange-400">→</span>
            <span className="px-2 py-1 bg-orange-950/80 text-orange-300 border border-orange-700/50 rounded">ML Prediction</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
