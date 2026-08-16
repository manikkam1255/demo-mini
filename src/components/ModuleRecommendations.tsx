import React, { useState } from 'react';
import { CareerMatch, StudentProfile, SkillRatings } from '../types';
import { 
  Award, Sparkles, ArrowRight, CheckCircle2, TrendingUp, Briefcase, 
  ExternalLink, ChevronRight, Filter, SlidersHorizontal, LayoutDashboard, 
  Code2, BarChart3, ShieldCheck, Cpu, Palette, Cloud, Smartphone, Printer
} from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleRecommendationsProps {
  recommendations: CareerMatch[];
  studentProfile: StudentProfile;
  skillRatings: SkillRatings;
  onSelectCareer: (career: CareerMatch) => void;
  onGoToDashboard: () => void;
  onRetake: () => void;
  onOpenReport?: () => void;
}

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'software-developer': return Code2;
    case 'data-analyst': return BarChart3;
    case 'cybersecurity-analyst': return ShieldCheck;
    case 'ai-ml-engineer': return Cpu;
    case 'ui-ux-designer': return Palette;
    case 'cloud-devops-engineer': return Cloud;
    case 'mobile-app-developer': return Smartphone;
    default: return Briefcase;
  }
};

export const ModuleRecommendations: React.FC<ModuleRecommendationsProps> = ({
  recommendations,
  studentProfile,
  skillRatings,
  onSelectCareer,
  onGoToDashboard,
  onRetake,
  onOpenReport,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-growth' | 'tech' | 'data-design'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'salary'>('match');

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const topMatch = recommendations[0];
  const otherMatches = recommendations.slice(1);

  const filteredOtherMatches = otherMatches.filter((item) => {
    if (selectedFilter === 'high-growth') return item.marketGrowth.includes('Much faster') || item.marketGrowth.includes('+3');
    if (selectedFilter === 'tech') return item.category.includes('Tech') || item.category.includes('Cloud') || item.category.includes('Artificial');
    if (selectedFilter === 'data-design') return item.category.includes('Data') || item.category.includes('Design') || item.category.includes('Product');
    return true;
  }).sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    return b.matchScore - a.matchScore;
  });

  const TopIcon = getCategoryIcon(topMatch.id);

  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Module 07 of 08 • ML Output</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            🏆 AI Career Recommendations
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Personalized results for <span className="font-semibold text-stone-900">{studentProfile.fullName || 'Student'}</span> ({studentProfile.degree}, {studentProfile.yearOfStudy}).
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {onOpenReport && (
            <button
              type="button"
              id="rec-print-report-btn"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          )}

          <button
            type="button"
            id="rec-go-dashboard-btn"
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-400" />
            <span>Go to My Career Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* #1 BEST CAREER MATCH (HERO CARD - User PPT Specification) */}
      <motion.div
        id="hero-top-match-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-amber-50/50 border-2 border-orange-400/80 shadow-xl p-6 sm:p-8 overflow-hidden mb-10 group"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-400/20 via-amber-300/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Tag + Category */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>YOUR BEST CAREER MATCH</span>
              </span>
              <span className="text-xs font-semibold text-stone-500">{topMatch.category}</span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Fit Classification</span>
              <span className="text-xs font-extrabold text-orange-600 uppercase">{topMatch.matchLevel} Alignment</span>
            </div>
          </div>

          {/* Main Title & Match Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-200/70">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
                <TopIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950 tracking-tight">
                  {topMatch.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl line-clamp-2">
                  {topMatch.summary}
                </p>
              </div>
            </div>

            {/* Match Percentage Display */}
            <div className="sm:text-right shrink-0 bg-white/90 p-3.5 rounded-2xl border border-orange-200 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-orange-600 tracking-tight">
                {topMatch.matchScore}%
              </div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Overall Match Score
              </div>
            </div>
          </div>

          {/* Animated Visual Progress Bar (User PPT Style: ██████████████████░░) */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
              <span>ML Decision Vector Confidence</span>
              <span className="font-mono text-orange-700">{topMatch.matchScore} / 100</span>
            </div>
            <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-orange-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topMatch.matchScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 shadow-xs"
              />
            </div>
          </div>

          {/* Why This Matches You (User PPT Specification) */}
          <div className="mt-6">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <span>Why This Matches You</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {topMatch.whyMatch.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/90 border border-orange-200/80 text-xs text-stone-800 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics & Action Bar */}
          <div className="mt-6 pt-5 border-t border-orange-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Salary Range:</span>
                <span className="font-bold text-stone-900">{topMatch.salaryRange}</span>
              </div>
              <div className="hidden sm:block text-stone-300">|</div>
              <div>
                <span className="text-stone-400 block text-[11px]">Market Demand:</span>
                <span className="font-bold text-emerald-600">{topMatch.marketGrowth}</span>
              </div>
            </div>

            <button
              id="top-match-view-details-btn"
              onClick={() => onSelectCareer(topMatch)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer group-hover:scale-[1.01]"
            >
              <span>View Full Career Details & Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: OTHER RECOMMENDED CAREERS (User PPT Specification) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Other Recommended Career Paths
            </h3>
            <p className="text-xs text-stone-500">
              Alternative high-potential tracks discovered by our multi-feature classifier
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All Careers' },
              { id: 'high-growth', label: '⚡ High Growth' },
              { id: 'tech', label: '💻 Core Tech' },
              { id: 'data-design', label: '📊 Data & Product' },
            ].map((filter) => (
              <button
                key={filter.id}
                id={`filter-btn-${filter.id}`}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter.id
                    ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Other Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOtherMatches.map((career, idx) => {
            const Icon = getCategoryIcon(career.id);
            const rank = idx + 2; // e.g. #2, #3, etc.

            return (
              <motion.div
                key={career.id}
                id={`career-card-${career.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                onClick={() => onSelectCareer(career)}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Rank Badge & Match % */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-stone-400 bg-stone-100 px-2.5 py-1 rounded-lg">
                      #{rank} Match
                    </span>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                      <span className="text-xs font-black text-orange-600">{career.matchScore}%</span>
                      <span className="text-[10px] text-stone-500 font-semibold">Match</span>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-orange-100 text-stone-700 group-hover:text-orange-600 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                        {career.title}
                      </h4>
                      <span className="text-[11px] text-stone-400 font-medium">{career.category}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {career.summary}
                  </p>

                  {/* Mini Match Highlights */}
                  <div className="mt-3 space-y-1">
                    {career.whyMatch.slice(0, 2).map((w, i) => (
                      <div key={i} className="text-[11px] text-stone-500 flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">{career.averageStartingSalary}</span>
                  <span className="font-bold text-orange-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action: Retake Assessment */}
      <div className="mt-10 pt-6 border-t border-stone-200 text-center flex flex-wrap items-center justify-center gap-4">
        <button
          id="retake-assessment-bottom-btn"
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          🔄 Retake Assessment with Different Inputs
        </button>

        <button
          id="go-to-full-dashboard-btn"
          onClick={onGoToDashboard}
          className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          📊 Open My Student Career Profile & Skills Radar
        </button>
      </div>
    </div>
  );
};
