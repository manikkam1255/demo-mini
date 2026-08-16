import React, { useState } from 'react';
import { CareerMatch, StudentProfile, SkillRatings } from '../types';
import { 
  X, Sparkles, CheckCircle2, TrendingUp, AlertCircle, Briefcase, 
  BookOpen, Star, ArrowUpRight, GraduationCap, Clock, Award, 
  Share2, Printer, ExternalLink, Bot, Check, DollarSign, Bookmark,
  Layers, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CareerDetailsModalProps {
  career: CareerMatch | null;
  studentProfile: StudentProfile;
  skillRatings: SkillRatings;
  onClose: () => void;
  onOpenReport?: () => void;
}

export const CareerDetailsModal: React.FC<CareerDetailsModalProps> = ({
  career,
  studentProfile,
  skillRatings,
  onClose,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'skills' | 'roadmap' | 'ai-counsel'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!career) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header with Banner */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white relative">
          <button
            id="close-career-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {career.category}
                </span>
                <span className="text-[11px] font-semibold text-stone-400">
                  Targeted for {studentProfile.yearOfStudy || 'Undergraduate'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {career.title}
              </h2>
            </div>

            {/* Match Score Badge & Evaluated Skill Level */}
            <div className="flex items-center gap-3 bg-stone-800/90 border border-stone-700/80 px-4 py-2.5 rounded-2xl shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Overall Match</div>
                <div className="text-xs text-orange-400 font-medium">{career.matchLevel} Fit</div>
                {career.userSkillLevel && (
                  <div className="text-[10px] text-stone-300 font-semibold mt-0.5">{career.userSkillLevel}</div>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/30">
                {career.matchScore}%
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'overview', label: '📊 Career Overview' },
              { id: 'resources', label: '📚 Books & Real Resources' },
              { id: 'skills', label: '🧠 Skills & Gaps' },
              { id: 'roadmap', label: '🗺️ 6-Month Roadmap' },
              { id: 'ai-counsel', label: '🤖 AI Advisor Insights' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`modal-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white font-bold shadow-xs'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Summary card */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-stone-500 mb-2">
                  Role Description
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  {career.summary}
                </p>

                {/* Key Stat Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block font-medium">Industry Package Range</span>
                    <span className="text-sm font-bold text-stone-900 mt-0.5 block">{career.salaryRange}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block font-medium">Market Growth Index</span>
                    <span className="text-sm font-bold text-emerald-600 mt-0.5 block">{career.marketGrowth}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block font-medium">Work Setup Fit</span>
                    <span className="text-sm font-bold text-stone-900 mt-0.5 block">{career.workEnvironmentFit}</span>
                  </div>
                </div>
              </div>

              {/* Why this matches you (PPT mandate) */}
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200 shadow-xs">
                <h3 className="text-sm font-bold text-orange-950 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Why This Matches Your Student Profile</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {career.whyMatch.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-800 bg-white/80 p-2.5 rounded-xl border border-orange-200/60">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Job Opportunities & Designations (PPT mandate) */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-stone-700" />
                  <span>Entry-Level & Growth Career Opportunities</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {career.careerOpportunities.map((opp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-800">
                      <span>{opp}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: BOOKS & REAL RESOURCES (User Mandate) */}
          {activeTab === 'resources' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              {/* Section 1: Curated Industry Books */}
              {career.curatedBooks && career.curatedBooks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Curated Books & Foundational Texts
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {career.curatedBooks.map((book) => (
                      <div key={book.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                              {book.badge}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{book.rating}</span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-stone-900">{book.title}</h4>
                          <span className="text-xs text-stone-500 font-medium">By {book.author} • {book.pagesOrLength}</span>

                          <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">{book.summary}</p>

                          <div className="mt-3 space-y-1">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Core Takeaways:</span>
                            {book.keyTakeaways.map((takeaway, tIdx) => (
                              <div key={tIdx} className="text-[11px] text-stone-700 flex items-start gap-1.5">
                                <span className="text-orange-500 font-bold">•</span>
                                <span>{takeaway}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-500">Level: <span className="text-stone-800">{book.level}</span></span>
                          <span className="text-orange-600 font-bold flex items-center gap-1">
                            <span>Recommended Reading</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Free Learning Resources */}
              {career.freeResources && career.freeResources.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Free High-Yield Learning Resources
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {career.freeResources.map((res) => (
                      <div key={res.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                              FREE
                            </span>
                            <span className="text-xs font-semibold text-stone-500">{res.provider}</span>
                            <span className="text-[11px] text-stone-400">• {res.estimatedTime}</span>
                          </div>

                          <h4 className="text-sm font-bold text-stone-900">{res.title}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{res.description}</p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {res.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <a
                          href={res.directUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Paid & Industry Certifications */}
              {career.paidResources && career.paidResources.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Paid Certifications & Enterprise Credentials
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {career.paidResources.map((res) => (
                      <div key={res.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                              PAID / CERT
                            </span>
                            <span className="text-xs font-semibold text-stone-500">{res.provider}</span>
                            <span className="text-[11px] text-stone-400">• {res.estimatedTime}</span>
                          </div>

                          <h4 className="text-sm font-bold text-stone-900">{res.title}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{res.description}</p>
                        </div>

                        <a
                          href={res.directUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                        >
                          <span>Official Program</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: SKILLS & GAPS */}
          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              {/* Core Required Skills */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <span>🧠 Industry Hiring Benchmarks & Required Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.requiredSkills.map((req, i) => (
                    <span key={i} className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-semibold border border-stone-200">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Your Strengths (PPT mandate) */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-xs">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your Demonstrated Strengths</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {career.yourStrengths.map((st, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                        <span>{st.skill}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: st.rating }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{st.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills to Improve / Skill Gaps (PPT mandate) */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Skills to Improve & Recommended Bridges</span>
                </h3>
                <div className="space-y-3">
                  {career.skillsToImprove.map((gap, i) => (
                    <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{gap.skill}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            gap.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {gap.priority} Priority Gap
                          </span>
                        </div>
                        <p className="text-stone-600 text-xs">{gap.reason}</p>
                      </div>

                      <div className="sm:text-right shrink-0 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-semibold text-stone-400 block">Recommended Resource</span>
                        <span className="font-bold text-orange-600 text-xs">{gap.recommendedResource}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: 6-MONTH ROADMAP */}
          {activeTab === 'roadmap' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                <div>
                  <span className="font-bold">Structured 6-Month Actionable Preparation Plan</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">Specifically paced for {studentProfile.yearOfStudy || 'College Students'}</p>
                </div>
                <GraduationCap className="w-5 h-5 text-orange-600 shrink-0" />
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-stone-200">
                {career.learningRoadmap.map((milestone, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-2">
                    <div className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="flex-1 p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="text-sm font-bold text-stone-900">{milestone.phaseName}</h4>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 w-fit">
                          {milestone.timeframe}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Key Objectives:</span>
                        {milestone.keyObjectives.map((obj, oIdx) => (
                          <div key={oIdx} className="text-xs text-stone-700 flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-stone-500">Free Tools / Certifications:</span>
                        {milestone.recommendedFreeToolsOrCerts.map((cert, cIdx) => (
                          <span key={cIdx} className="text-[11px] font-medium px-2 py-0.5 bg-orange-50 text-orange-800 rounded border border-orange-200/60">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: AI ADVISOR INSIGHTS */}
          {activeTab === 'ai-counsel' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-md border border-stone-700">
                <div className="flex items-center gap-2.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Bot className="w-4 h-4" />
                  <span>Gemini AI Career Advisor Synthesis</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Personalized Guidance for {studentProfile.fullName || 'Student'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {career.aiPersonalizedAdvice || 
                    `Based on your ${studentProfile.degree} curriculum in ${studentProfile.yearOfStudy} and your strong ratings in Programming (${skillRatings.programming}/5) & Problem Solving (${skillRatings.problemSolving}/5), you are in a prime window to build 2 portfolio-grade projects. Focus your next 3 months on mastering data structures and deploying live applications.`}
                </p>
              </div>

              {/* Interview Focus Points */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Key Technical & Behavioral Interview Focus Areas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">1. Live Coding Round</span>
                    <p className="text-stone-600 text-[11px]">Arrays, HashMaps, Two-Pointers, and Time Complexity rationale</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">2. Architecture & Projects</span>
                    <p className="text-stone-600 text-[11px]">Explaining database schemas, API design, and trade-off decisions</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block mb-1">3. Behavioral (STAR Method)</span>
                    <p className="text-stone-600 text-[11px]">Conflict resolution in college team projects & sprint execution</p>
                  </div>
                </div>
              </div>

              {/* Market Demand Outlook */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <span className="font-bold block mb-0.5">2025–2027 Industry Hiring Outlook:</span>
                <p className="text-stone-700 text-[11px]">
                  {career.industryOutlook || 'Companies are prioritizing candidate depth in practical project implementation, containerization, and AI-assisted workflows over purely theoretical knowledge.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Role'}</span>
            </button>

            {onOpenReport && (
              <button
                id="modal-print-report-btn"
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Export PDF / Report</span>
              </button>
            )}
          </div>

          <button
            id="modal-close-action-btn"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

