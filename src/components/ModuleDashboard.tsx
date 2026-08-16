import React from 'react';
import { StudentProfile, SkillRatings, InterestPreferences, CareerPreferences, CareerMatch } from '../types';
import { 
  LayoutDashboard, User, Brain, Heart, Target, Award, Sparkles, 
  ArrowRight, RefreshCw, Printer, Download, Star, CheckCircle2, 
  TrendingUp, BookOpen, ChevronRight, BarChart2, ShieldCheck, Code2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleDashboardProps {
  profile: StudentProfile;
  skills: SkillRatings;
  interests: InterestPreferences;
  preferences: CareerPreferences;
  recommendations: CareerMatch[];
  onSelectCareer: (career: CareerMatch) => void;
  onRetake: () => void;
  onOpenReport: () => void;
}

export const ModuleDashboard: React.FC<ModuleDashboardProps> = ({
  profile,
  skills,
  interests,
  preferences,
  recommendations,
  onSelectCareer,
  onRetake,
  onOpenReport,
}) => {
  const topCareer = recommendations[0] || null;

  const skillBars = [
    { name: 'Programming & Logic', score: skills.programming, pct: Math.round((skills.programming / 5) * 100), color: 'bg-blue-500' },
    { name: 'Problem Solving', score: skills.problemSolving, pct: Math.round((skills.problemSolving / 5) * 100), color: 'bg-amber-500' },
    { name: 'Mathematics & Stats', score: skills.mathematics, pct: Math.round((skills.mathematics / 5) * 100), color: 'bg-purple-500' },
    { name: 'Communication', score: skills.communication, pct: Math.round((skills.communication / 5) * 100), color: 'bg-emerald-500' },
    { name: 'Creativity & Design', score: skills.creativity, pct: Math.round((skills.creativity / 5) * 100), color: 'bg-pink-500' },
    { name: 'Leadership & Teamwork', score: skills.leadership, pct: Math.round((skills.leadership / 5) * 100), color: 'bg-orange-500' },
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      {/* Top Welcome Header (PPT mandate: "Hi, Student 👋") */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-2 border border-orange-500/30">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Module 08 of 08 • Student Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Hi, {profile.fullName || 'Student'} 👋
          </h1>
          <p className="text-sm text-stone-300 mt-1 max-w-xl">
            {profile.degree || 'Degree'} • {profile.yearOfStudy || 'Undergraduate'} • {profile.college || 'University'} (CGPA: {profile.cgpa})
          </p>
        </div>

        {/* Quick Report / Export actions */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            id="dashboard-export-report-btn"
            onClick={onOpenReport}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Career Report</span>
          </button>

          <button
            id="dashboard-retake-btn"
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols on lg): Top Match & Recommended List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Match Spotlight */}
          {topCareer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                  ⭐ Top Predicted Career Match
                </span>
                <span className="text-xs font-semibold text-stone-500">{topCareer.category}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-2xl font-black text-stone-900">{topCareer.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-md">{topCareer.summary}</p>
                </div>

                <div className="bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-200 text-center shrink-0">
                  <span className="text-2xl font-black text-orange-600 block">{topCareer.matchScore}%</span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Match Score</span>
                </div>
              </div>

              {/* Strengths & Gaps summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                  <span className="font-bold text-emerald-950 block mb-1">Key Strengths to Leverage:</span>
                  <ul className="space-y-1 text-[11px] text-stone-700">
                    {topCareer.yourStrengths.slice(0, 2).map((st, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{st.skill} ({st.rating}/5)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
                  <span className="font-bold text-amber-950 block mb-1">Next Priority Skills to Bridge:</span>
                  <ul className="space-y-1 text-[11px] text-stone-700">
                    {topCareer.skillsToImprove.slice(0, 2).map((gap, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                        <span className="truncate">{gap.skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 flex justify-end">
                <button
                  id="dashboard-open-top-career-modal-btn"
                  onClick={() => onSelectCareer(topCareer)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Roadmap & AI Insights</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Recommended Careers Ranking List (User PPT mandate) */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">Recommended Careers Ranking</h3>
                <p className="text-xs text-stone-500">Ranked by ML compatibility model</p>
              </div>
              <span className="text-xs font-semibold text-stone-400">{recommendations.length} Careers Evaluated</span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((career, idx) => (
                <div
                  key={career.id}
                  id={`dashboard-rank-row-${career.id}`}
                  onClick={() => onSelectCareer(career)}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-200 group-hover:bg-orange-500 group-hover:text-white text-stone-700 text-xs font-black flex items-center justify-center transition-colors">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                        {career.title}
                      </h4>
                      <span className="text-[11px] text-stone-400">{career.category} • {career.averageStartingSalary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-orange-600">{career.matchScore}%</span>
                      <span className="text-[10px] text-stone-400 block font-medium">Match</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills Matrix & Profile Metadata */}
        <div className="space-y-6">
          
          {/* Your Skills Breakdown (PPT mandate) */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-1">Your Skills Matrix</h3>
            <p className="text-xs text-stone-500 mb-4">6-dimensional capability profile</p>

            <div className="space-y-3.5">
              {skillBars.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>{skill.name}</span>
                    <span className="font-mono text-stone-900">{skill.pct}% ({skill.score}/5)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Specialized skills */}
            {skills.specializedSkills && skills.specializedSkills.length > 0 && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Specialized Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.specializedSkills.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interests & Aspirations Summary */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs text-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900">Career Preferences</h3>

            <div>
              <span className="text-stone-400 font-semibold block mb-1">Selected Domain Interests:</span>
              <div className="flex flex-wrap gap-1.5">
                {interests.domains.map((d) => (
                  <span key={d} className="px-2 py-0.5 bg-orange-50 text-orange-800 rounded border border-orange-200 font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-stone-400 font-semibold block mb-1">Preferred Work Styles:</span>
              <div className="flex flex-wrap gap-1.5">
                {interests.workTypes.map((w) => (
                  <span key={w} className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-medium">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-stone-500 font-medium">Work Environment:</span>
              <span className="font-bold text-stone-900">{preferences.workEnvironment}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
