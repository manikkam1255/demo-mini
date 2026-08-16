import React, { useState } from 'react';
import { CareerPreferences } from '../types';
import { Target, Sparkles, Building2, Laptop, Network, HelpCircle, ArrowRight, ArrowLeft, Check, Compass, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleCareerPreferencesProps {
  initialPreferences: CareerPreferences;
  onSaveAndNext: (preferences: CareerPreferences) => void;
  onBack: () => void;
}

const CAREER_PRIORITIES = [
  { id: 'High Salary', label: 'High Salary', icon: '💰', desc: 'Above-average entry packages & performance bonuses' },
  { id: 'Career Growth', label: 'Rapid Career Growth', icon: '📈', desc: 'Quick promotion cycles and hierarchical advancement' },
  { id: 'Remote Work', label: 'Remote Flexibility', icon: '🏠', desc: 'Work from anywhere with asynchronous hours' },
  { id: 'International Opportunities', label: 'Global Opportunities', icon: '🌎', desc: 'Onsite travel, global teams and overseas relocation' },
  { id: 'Innovation', label: 'High Innovation', icon: '💡', desc: 'Working on cutting-edge tech, R&D and 0-to-1 ideas' },
  { id: 'Work-Life Balance', label: 'Work-Life Balance', icon: '⚖️', desc: 'Predictable hours, low burnout and well-being' },
  { id: 'Job Stability', label: 'Job Stability', icon: '🏢', desc: 'Secure enterprise roles and recession-resistant fields' },
  { id: 'Entrepreneurship', label: 'Entrepreneurship', icon: '🚀', desc: 'Startup experience, high ownership and founder skills' },
];

const WORK_ENVIRONMENTS: { id: CareerPreferences['workEnvironment']; title: string; icon: React.ElementType; desc: string }[] = [
  { id: 'Hybrid', title: 'Hybrid Work', icon: Network, desc: 'Blend of collaborative office days and home focus' },
  { id: 'Remote', title: '100% Remote', icon: Laptop, desc: 'Complete location independence with digital tools' },
  { id: 'Office', title: 'On-Site Office', icon: Building2, desc: 'Dynamic in-person campus environment & mentorship' },
  { id: 'No Preference', title: 'No Preference', icon: HelpCircle, desc: 'Open to whichever environment offers best growth' },
];

export const ModuleCareerPreferences: React.FC<ModuleCareerPreferencesProps> = ({
  initialPreferences,
  onSaveAndNext,
  onBack,
}) => {
  const [priorities, setPriorities] = useState<string[]>(initialPreferences.priorities || ['Career Growth', 'High Salary']);
  const [workEnvironment, setWorkEnvironment] = useState<CareerPreferences['workEnvironment']>(initialPreferences.workEnvironment || 'Hybrid');
  const [targetTimeline, setTargetTimeline] = useState<string>(initialPreferences.targetTimeline || 'Immediate Campus Placements (2026)');

  const togglePriority = (priorityId: string) => {
    if (priorities.includes(priorityId)) {
      setPriorities(priorities.filter((p) => p !== priorityId));
    } else {
      setPriorities([...priorities, priorityId]);
    }
  };

  const handleContinue = () => {
    onSaveAndNext({
      priorities: priorities.length > 0 ? priorities : ['Career Growth'],
      workEnvironment,
      targetTimeline,
    });
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <span>Module 05 of 08</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">Career Expectations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
          🎯 Career Preferences
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Tell us what you expect from your ideal career path. This weights the decision matrix.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: What matters most to you (Priorities) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">What matters most to you in a career?</h3>
              <p className="text-xs text-stone-500">Select as many priorities as apply to your vision</p>
            </div>
            <span className="text-xs font-semibold text-orange-600">
              {priorities.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {CAREER_PRIORITIES.map((priority) => {
              const isSelected = priorities.includes(priority.id);

              return (
                <button
                  key={priority.id}
                  type="button"
                  id={`priority-btn-${priority.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => togglePriority(priority.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/70 shadow-2xs ring-1 ring-orange-500/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-2xl">{priority.icon}</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-orange-600 text-white' : 'border border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-orange-950' : 'text-stone-900'}`}>
                      {priority.label}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 leading-snug">
                      {priority.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 2: Preferred Work Environment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-stone-900">Preferred Work Environment</h3>
            <p className="text-xs text-stone-500">Choose the daily setup where you feel most productive</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORK_ENVIRONMENTS.map((env) => {
              const Icon = env.icon;
              const isSelected = workEnvironment === env.id;

              return (
                <button
                  key={env.id}
                  type="button"
                  id={`work-env-btn-${env.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setWorkEnvironment(env.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">Selected</span>}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{env.title}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{env.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 3: Target Timeline Goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950">Target Placement / Career Milestone</div>
              <div className="text-[11px] text-amber-800/80">Helps calibrate roadmap milestone urgency</div>
            </div>
          </div>

          <select
            id="target-timeline-select"
            value={targetTimeline}
            onChange={(e) => setTargetTimeline(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="Immediate Campus Placements (2026)">Campus Placements (2026)</option>
            <option value="Summer Internships (2026)">Summer Internships (2026)</option>
            <option value="Off-Campus Hiring (Within 6 months)">Off-Campus Hiring (Next 6 Months)</option>
            <option value="Higher Studies & Research Preparations">Higher Studies & Research Track</option>
          </select>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8">
        <button
          type="button"
          id="preferences-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="run-ai-analysis-btn"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition-all cursor-pointer active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Analysis & Match Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
