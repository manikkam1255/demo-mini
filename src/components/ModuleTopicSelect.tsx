import React, { useState } from 'react';
import { LearnTopic, StudentProfile } from '../types';
import { LEARN_TOPICS_DATABASE } from '../data/learningResourcesDatabase';
import { 
  Code2, Cpu, BarChart3, ShieldCheck, Palette, Cloud, Briefcase,
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, BookOpen, 
  HelpCircle, Search, Layers, Compass
} from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleTopicSelectProps {
  studentProfile: StudentProfile;
  selectedTopicId: string;
  onSelectTopic: (topic: LearnTopic) => void;
  onBack: () => void;
}

const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2': return Code2;
    case 'Cpu': return Cpu;
    case 'BarChart3': return BarChart3;
    case 'ShieldCheck': return ShieldCheck;
    case 'Palette': return Palette;
    case 'Cloud': return Cloud;
    case 'Briefcase': return Briefcase;
    default: return Compass;
  }
};

export const ModuleTopicSelect: React.FC<ModuleTopicSelectProps> = ({
  studentProfile,
  selectedTopicId,
  onSelectTopic,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Engineering & Systems', 'Artificial Intelligence & R&D', 'Data & Intelligence', 'Security & Forensics', 'Design & Interaction', 'Infrastructure & SRE', 'Product & Leadership'];

  const filteredTopics = LEARN_TOPICS_DATABASE.filter((topic) => {
    const matchesCategory = activeCategory === 'All' || topic.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(topic.category.toLowerCase());
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.popularRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Module 03 of 07 • Topic & Question Track Selection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Select Your Learning & Career Focus Track
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Hello <span className="font-semibold text-stone-900">{studentProfile.fullName || 'Student'}</span>! Choose a primary domain below. We will ask a set of formal assessment questions tailored to this track before synthesizing your AI recommendations & learning roadmap.
            </p>
          </div>

          <button
            id="topic-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </button>
        </div>

        {/* Swiggy-Style Search & Category Filter Pills */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="topic-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. AI, React, SQL, Cloud)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
            />
          </div>

          <div className="w-full sm:flex-1 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Engineering', 'AI & ML', 'Data Analytics', 'Cybersecurity', 'UI/UX Design', 'Cloud & DevOps', 'Product Mgmt'].map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  if (cat === 'All') setActiveCategory('All');
                  else if (cat === 'Engineering') setActiveCategory('Engineering');
                  else if (cat === 'AI & ML') setActiveCategory('Artificial Intelligence');
                  else if (cat === 'Data Analytics') setActiveCategory('Data');
                  else if (cat === 'Cybersecurity') setActiveCategory('Security');
                  else if (cat === 'UI/UX Design') setActiveCategory('Design');
                  else if (cat === 'Cloud & DevOps') setActiveCategory('Infrastructure');
                  else if (cat === 'Product Mgmt') setActiveCategory('Product');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  (cat === 'All' && activeCategory === 'All') || 
                  (activeCategory.toLowerCase().includes(cat.toLowerCase().slice(0, 4)))
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid (Swiggy-Style Card Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic, idx) => {
          const Icon = getTopicIcon(topic.iconName);
          const isSelected = selectedTopicId === topic.id;

          return (
            <motion.div
              key={topic.id}
              id={`topic-card-${topic.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              onClick={() => onSelectTopic(topic)}
              className={`p-6 rounded-3xl bg-white border-2 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md relative overflow-hidden ${
                isSelected 
                  ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20' 
                  : 'border-stone-200 hover:border-orange-300'
              }`}
            >
              {/* Top Row: Icon + Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                      : 'bg-stone-100 text-stone-800 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100/80 text-orange-900 border border-orange-200/60">
                    {topic.badgeText}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {topic.category}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                    {topic.title}
                  </h3>
                </div>

                <p className="text-xs text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {topic.shortDesc}
                </p>

                {/* Micro Stats (Salary + Questions) */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <span className="text-[10px] text-stone-400 block font-medium">Growth Rate</span>
                    <span className="font-bold text-emerald-600 text-[11px]">{topic.demandGrowth}</span>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <span className="text-[10px] text-stone-400 block font-medium">Formal Questions</span>
                    <span className="font-bold text-stone-800 text-[11px]">{topic.questions.length} Questions</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Target: <span className="text-stone-800">{topic.popularRole.split('/')[0]}</span>
                </span>

                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-900 group-hover:bg-orange-600 text-white'
                  }`}
                >
                  <span>Select Track</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
