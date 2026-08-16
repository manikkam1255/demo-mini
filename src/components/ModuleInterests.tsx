import React, { useState } from 'react';
import { InterestPreferences } from '../types';
import { Heart, Code2, BarChart2, Palette, Shield, Laptop, Megaphone, Briefcase, Cpu, ArrowRight, ArrowLeft, Check, Sparkles, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleInterestsProps {
  initialInterests: InterestPreferences;
  onSaveAndNext: (interests: InterestPreferences) => void;
  onBack: () => void;
}

interface DomainCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  popularRoles: string;
  badge: string;
}

const DOMAINS: DomainCategory[] = [
  {
    id: 'Coding',
    name: 'Coding & Development',
    icon: Code2,
    description: 'Writing software, building web applications, backend APIs, and systems.',
    popularRoles: 'Full Stack, Backend, App Dev',
    badge: 'Popular',
  },
  {
    id: 'Data',
    name: 'Data & Analytics',
    icon: BarChart2,
    description: 'Mining numbers, dashboards, business metrics, and statistical insights.',
    popularRoles: 'Data Analyst, BI Developer',
    badge: 'High Growth',
  },
  {
    id: 'Design',
    name: 'UI/UX Design',
    icon: Palette,
    description: 'Crafting user interfaces, wireframes, visual aesthetics, and user flows.',
    popularRoles: 'Product Designer, UX Architect',
    badge: 'Creative',
  },
  {
    id: 'Cybersecurity',
    name: 'Cybersecurity',
    icon: Shield,
    description: 'Ethical hacking, defending networks, threat hunting, and security audits.',
    popularRoles: 'Security Analyst, Pen Tester',
    badge: 'High Demand',
  },
  {
    id: 'Technology',
    name: 'Core Technology',
    icon: Laptop,
    description: 'Cloud architectures, operating systems, hardware integration & DevOps.',
    popularRoles: 'Cloud Engineer, DevOps',
    badge: 'Trending',
  },
  {
    id: 'AI & ML',
    name: 'AI & Machine Learning',
    icon: Cpu,
    description: 'Neural networks, generative AI, LLMs, computer vision, and predictive models.',
    popularRoles: 'ML Engineer, AI Specialist',
    badge: 'Booming',
  },
  {
    id: 'Business',
    name: 'Business & Strategy',
    icon: Briefcase,
    description: 'Product scoping, market research, team coordination, and business growth.',
    popularRoles: 'Product Manager, Biz Analyst',
    badge: 'Leadership',
  },
  {
    id: 'Marketing',
    name: 'Digital Marketing',
    icon: Megaphone,
    description: 'Growth funnels, content engagement, SEO, brand positioning, and social.',
    popularRoles: 'Growth Marketer, Campaign Lead',
    badge: 'Fast Pace',
  },
];

const WORK_STYLES = [
  { id: 'Problem Solving', label: 'Problem Solving', icon: '🧩', desc: 'Solving puzzles and troubleshooting bottlenecks' },
  { id: 'Creative Work', label: 'Creative Work', icon: '🎨', desc: 'Designing aesthetics, user interfaces and novel ideas' },
  { id: 'Working with Data', label: 'Working with Data', icon: '📊', desc: 'Extracting patterns, numbers and analytical models' },
  { id: 'Working with People', label: 'Working with People', icon: '🤝', desc: 'Collaborating, mentoring, and presenting solutions' },
  { id: 'Technical Work', label: 'Technical Work', icon: '⚙️', desc: 'Hands-on coding, architecture, and engineering' },
  { id: 'Management', label: 'Management & Strategy', icon: '📈', desc: 'Leading timelines, prioritization, and product roadmaps' },
];

export const ModuleInterests: React.FC<ModuleInterestsProps> = ({
  initialInterests,
  onSaveAndNext,
  onBack,
}) => {
  const [selectedDomains, setSelectedDomains] = useState<string[]>(initialInterests.domains || []);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(initialInterests.workTypes || []);
  const [error, setError] = useState<string | null>(null);

  const toggleDomain = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domainId));
    } else {
      setSelectedDomains([...selectedDomains, domainId]);
    }
    setError(null);
  };

  const toggleWorkType = (workId: string) => {
    if (selectedWorkTypes.includes(workId)) {
      setSelectedWorkTypes(selectedWorkTypes.filter((w) => w !== workId));
    } else {
      setSelectedWorkTypes([...selectedWorkTypes, workId]);
    }
    setError(null);
  };

  const handleContinue = () => {
    if (selectedDomains.length === 0) {
      setError('Please select at least 1 domain you are interested in.');
      return;
    }
    if (selectedWorkTypes.length === 0) {
      setError('Please select at least 1 preferred work style.');
      return;
    }
    onSaveAndNext({
      domains: selectedDomains,
      workTypes: selectedWorkTypes,
    });
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <span>Module 04 of 08</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">Domain & Work Culture Fit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
          ❤️ Interests & Preferences
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Select what excites you. Our algorithm gives extra weight to careers matching your passion points.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Section 1: Domain Interest Cards (Swiggy Style) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>What are you interested in?</span>
            <span className="text-xs font-normal text-stone-500">(Select all that apply)</span>
          </h3>
          <span className="text-xs font-semibold text-orange-600">
            {selectedDomains.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DOMAINS.map((domain, idx) => {
            const Icon = domain.icon;
            const isSelected = selectedDomains.includes(domain.id);

            return (
              <motion.div
                key={domain.id}
                id={`domain-card-${domain.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => toggleDomain(domain.id)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-orange-500 text-white shadow-2xs' : 'bg-stone-100 text-stone-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-orange-200 text-orange-900' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {domain.badge}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${isSelected ? 'text-orange-950' : 'text-stone-900'}`}>
                    {domain.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 truncate">{domain.popularRoles}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-orange-600 text-white' : 'border border-stone-300 text-transparent'
                  }`}>
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Preferred Work Style */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <span>What type of work do you prefer?</span>
          </h3>
          <span className="text-xs font-semibold text-orange-600">
            {selectedWorkTypes.length} selected
          </span>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          How do you enjoy spending your working hours on a daily basis?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {WORK_STYLES.map((work) => {
            const isSelected = selectedWorkTypes.includes(work.id);

            return (
              <button
                key={work.id}
                type="button"
                id={`workstyle-btn-${work.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => toggleWorkType(work.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/60 shadow-2xs ring-1 ring-orange-500/30'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{work.icon}</span>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-orange-950' : 'text-stone-900'}`}>
                    {work.label}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {work.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          id="interests-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="interests-continue-btn"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span>Continue to Career Goals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
