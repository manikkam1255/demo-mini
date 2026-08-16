import React, { useState } from 'react';
import { SkillRatings } from '../types';
import { Brain, Code2, MessageSquare, Lightbulb, Calculator, Sparkles, Users2, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleSkillsAssessmentProps {
  initialSkills: SkillRatings;
  onSaveAndNext: (skills: SkillRatings) => void;
  onBack: () => void;
}

interface CoreSkillMeta {
  key: keyof Omit<SkillRatings, 'specializedSkills'>;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  descriptions: Record<number, string>;
}

const CORE_SKILLS: CoreSkillMeta[] = [
  {
    key: 'programming',
    title: 'Programming & Logic',
    subtitle: 'Writing code, understanding algorithms, and computational logic',
    icon: Code2,
    color: 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-50',
    descriptions: {
      1: 'Beginner — Basic familiarity with syntax or hello-world logic',
      2: 'Elementary — Can write basic scripts and simple loops/functions',
      3: 'Intermediate — Comfortable with OOP, basic data structures & APIs',
      4: 'Advanced — Confident building full projects & optimizing algorithms',
      5: 'Excellent — Deep mastery of architecture, complexity & frameworks',
    },
  },
  {
    key: 'communication',
    title: 'Communication',
    subtitle: 'Expressing technical & non-technical ideas clearly to teams and clients',
    icon: MessageSquare,
    color: 'from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-50',
    descriptions: {
      1: 'Beginner — Prefer working individually with minimal presenting',
      2: 'Elementary — Can convey basic updates in small group settings',
      3: 'Intermediate — Clear written documentation and comfortable speaking',
      4: 'Advanced — Persuasive presenter and effective cross-team communicator',
      5: 'Excellent — Inspiring speaker, handles client negotiations & debates',
    },
  },
  {
    key: 'problemSolving',
    title: 'Problem Solving & Analytical Thinking',
    subtitle: 'Breaking down complex challenges into structured, systematic solutions',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600 text-amber-600 bg-amber-50',
    descriptions: {
      1: 'Beginner — Need step-by-step guidance for unfamiliar roadblocks',
      2: 'Elementary — Can troubleshoot common bugs with internet search',
      3: 'Intermediate — Break down business/logic problems into milestones',
      4: 'Advanced — High analytical acuity, quick root-cause diagnosis',
      5: 'Excellent — Solves ambiguous, high-impact multi-variable problems',
    },
  },
  {
    key: 'mathematics',
    title: 'Mathematics & Quantitative Aptitude',
    subtitle: 'Discrete math, statistics, calculus, matrices, and numeric reasoning',
    icon: Calculator,
    color: 'from-purple-500 to-violet-600 text-purple-600 bg-purple-50',
    descriptions: {
      1: 'Beginner — Basic arithmetic and formula calculations',
      2: 'Elementary — Algebra, basic trigonometry, and standard probability',
      3: 'Intermediate — Statistical modeling, matrices & graph theory basics',
      4: 'Advanced — Linear algebra, multivariate calculus & distributions',
      5: 'Excellent — Research-level mathematical proofs & optimization theory',
    },
  },
  {
    key: 'creativity',
    title: 'Creativity & Design Intuition',
    subtitle: 'Generating fresh concepts, aesthetic sense, and innovative solutions',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600 text-pink-600 bg-pink-50',
    descriptions: {
      1: 'Beginner — Prefer structured, pre-defined rules and guidelines',
      2: 'Elementary — Can modify existing templates and standard themes',
      3: 'Intermediate — Good visual balance and brainstorms creative ideas',
      4: 'Advanced — Crafts original design systems & novel product angles',
      5: 'Excellent — Visionary design thinking and breakthrough innovation',
    },
  },
  {
    key: 'leadership',
    title: 'Leadership & Collaboration',
    subtitle: 'Guiding peers, taking ownership of tasks, and organizing initiatives',
    icon: Users2,
    color: 'from-orange-500 to-red-600 text-orange-600 bg-orange-50',
    descriptions: {
      1: 'Beginner — Prefer following instructions as an individual contributor',
      2: 'Elementary — Actively contributes in college team assignments',
      3: 'Intermediate — Manages project timelines and coordinates 2-4 peers',
      4: 'Advanced — Leads clubs, hackathon teams, and delegates effectively',
      5: 'Excellent — Strategic leader who inspires and drives high execution',
    },
  },
];

const POPULAR_SPECIALIZED_TAGS = [
  'Python', 'Java', 'C++', 'JavaScript/TypeScript', 'React.js', 'Node.js',
  'SQL & Databases', 'Machine Learning', 'Data Structures', 'Figma / UI Design',
  'AWS / Cloud', 'Git & GitHub', 'Docker', 'Cybersecurity', 'Power BI / Tableau',
  'Mobile (Flutter/React Native)', 'Excel & Analytics', 'Linux'
];

export const ModuleSkillsAssessment: React.FC<ModuleSkillsAssessmentProps> = ({
  initialSkills,
  onSaveAndNext,
  onBack,
}) => {
  const [skills, setSkills] = useState<SkillRatings>(initialSkills);
  const [customTagInput, setCustomTagInput] = useState('');

  const handleRate = (key: keyof Omit<SkillRatings, 'specializedSkills'>, rating: number) => {
    setSkills((prev) => ({
      ...prev,
      [key]: rating,
    }));
  };

  const toggleTag = (tag: string) => {
    const current = skills.specializedSkills || [];
    if (current.includes(tag)) {
      setSkills({ ...skills, specializedSkills: current.filter((t) => t !== tag) });
    } else {
      setSkills({ ...skills, specializedSkills: [...current, tag] });
    }
  };

  const addCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (trimmed && !skills.specializedSkills.includes(trimmed)) {
      setSkills({
        ...skills,
        specializedSkills: [...skills.specializedSkills, trimmed],
      });
      setCustomTagInput('');
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto px-4">
      {/* Module Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <span>Module 03 of 07</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">Core Capabilities Rating</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
          🧠 Skills Assessment
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Rate yourself honestly on a 1 (Beginner) to 5 (Excellent) scale across the 6 key dimensions.
        </p>
      </div>

      {/* 6 Core Skill Cards */}
      <div className="space-y-4">
        {CORE_SKILLS.map((skillItem, idx) => {
          const Icon = skillItem.icon;
          const currentRating = skills[skillItem.key] as number;

          return (
            <motion.div
              key={skillItem.key}
              id={`skill-card-${skillItem.key}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-orange-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${skillItem.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{skillItem.title}</h3>
                    <p className="text-xs text-stone-500">{skillItem.subtitle}</p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-50 px-3 py-1 rounded-lg border border-stone-200">
                  <span className="text-sm font-extrabold text-orange-600">{currentRating}</span>
                  <span className="text-xs text-stone-400 font-semibold">/ 5</span>
                </div>
              </div>

              {/* 5-Point Interactive Level Selector */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isSelected = currentRating === score;
                  const isBelowOrEqual = currentRating >= score;

                  return (
                    <button
                      key={score}
                      type="button"
                      id={`rate-btn-${skillItem.key}-${score}`}
                      onClick={() => handleRate(skillItem.key, score)}
                      className={`group py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs scale-[1.02] font-bold'
                          : isBelowOrEqual
                          ? 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 font-semibold'
                          : 'bg-stone-50/70 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-sm sm:text-base font-extrabold">{score}</div>
                      <div className="text-[10px] hidden sm:block truncate opacity-85">
                        {score === 1 ? 'Beginner' : score === 3 ? 'Medium' : score === 5 ? 'Master' : `Level ${score}`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Level Descriptor */}
              <div className="mt-3 text-xs text-stone-600 bg-stone-50/80 px-3 py-2 rounded-lg border border-stone-200/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                <span>{skillItem.descriptions[currentRating]}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Specialized Technical & Practical Skills */}
      <div className="mt-8 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <Brain className="w-5 h-5 text-orange-600" />
          <h3 className="text-base font-bold text-stone-900">Specific Skills & Technologies (Optional)</h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Select any tools or frameworks you have practiced. This sharpens your ML match precision.
        </p>

        {/* Selected chips / popular list */}
        <div className="flex flex-wrap gap-2 mb-4">
          {POPULAR_SPECIALIZED_TAGS.map((tag) => {
            const isSelected = skills.specializedSkills.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                id={`spec-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 font-semibold shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isSelected ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>

        {/* Add custom tag */}
        <form onSubmit={addCustomTag} className="flex gap-2">
          <input
            type="text"
            id="custom-skill-input"
            placeholder="Add custom skill (e.g. Flutter, Kotlin, GraphQL)..."
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
          <button
            type="submit"
            id="add-custom-skill-btn"
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          id="skills-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="skills-continue-btn"
          onClick={() => onSaveAndNext(skills)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span>Run AI Skill Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
