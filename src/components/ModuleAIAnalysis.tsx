import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Database, Layers, GitBranch, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleAIAnalysisProps {
  onComplete: () => void;
  studentName?: string;
  degree?: string;
}

interface StepCheck {
  id: string;
  label: string;
  sub: string;
  completedAt: number; // percentage progress threshold
}

const CHECKLIST_STEPS: StepCheck[] = [
  { id: 'step-1', label: 'Academic Performance & Background', sub: 'Normalizing CGPA & graduation timeline features', completedAt: 20 },
  { id: 'step-2', label: 'Core Skills Vector Quantization', sub: 'Weighting 6-dimensional skill ratings matrix', completedAt: 42 },
  { id: 'step-3', label: 'Domain Interests & Passion Clusters', sub: 'Evaluating industry taxonomy and role compatibility', completedAt: 65 },
  { id: 'step-4', label: 'Work Style & Career Preferences', sub: 'Factoring work environment & growth criteria', completedAt: 84 },
  { id: 'step-5', label: 'Random Forest & Decision Tree Ensemble', sub: 'Synthesizing top career matches & skill gap roadmaps', completedAt: 98 },
];

export const ModuleAIAnalysis: React.FC<ModuleAIAnalysisProps> = ({
  onComplete,
  studentName,
  degree,
}) => {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState('Data Ingestion & Preprocessing');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Varied organic increment
        const increment = prev < 50 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 6) + 3;
        const next = Math.min(100, prev + increment);

        if (next < 25) setActiveStage('Preprocessing & Feature Normalization');
        else if (next < 55) setActiveStage('Feature Vector Scaling & Weight Matrix');
        else if (next < 80) setActiveStage('Decision Tree Classifier & Cluster Scorer');
        else if (next < 95) setActiveStage('Random Forest Ensemble & Explainable XAI Synthesis');
        else setActiveStage('Finalizing Top Ranked Recommendations');

        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // When progress hits 100%, trigger completion with short pause for satisfaction
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="py-10 max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-xl text-center relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* AI Pulsing Core Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-white/40 border-dashed"
          />
          <Cpu className="w-10 h-10 animate-pulse" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Analyzing Your Profile...
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
          AI is evaluating features for <span className="font-semibold text-stone-900">{studentName || 'Student'}</span> ({degree || 'Undergraduate'}) to find the best career matches...
        </p>

        {/* Animated Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
            <span className="text-orange-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeStage}</span>
            </span>
            <span className="font-mono text-sm">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 shadow-xs"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step-by-Step Animated Checklist (User PPT Specification) */}
        <div className="mt-8 pt-6 border-t border-stone-100 max-w-lg mx-auto text-left space-y-3">
          {CHECKLIST_STEPS.map((step) => {
            const isDone = progress >= step.completedAt;
            const isCurrent = progress < step.completedAt && progress >= step.completedAt - 25;

            return (
              <div
                key={step.id}
                id={step.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-orange-50/60 border-orange-200 text-stone-900'
                    : isCurrent
                    ? 'bg-amber-50/40 border-amber-200 text-stone-800'
                    : 'bg-stone-50/40 border-stone-200/60 text-stone-400 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDone ? 'text-orange-950' : 'text-stone-700'}`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-stone-500">{step.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Machine Learning Pipeline Diagram (PPT Architecture) */}
        <div className="mt-8 p-4 rounded-2xl bg-stone-900 text-white text-xs max-w-lg mx-auto text-left border border-stone-800">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-orange-400 uppercase tracking-wider mb-2">
            <GitBranch className="w-3.5 h-3.5" />
            <span>ML Execution Pipeline Architecture</span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
            <div className="p-1.5 bg-stone-800 rounded border border-stone-700">
              <Database className="w-3 h-3 mx-auto mb-1 text-stone-400" />
              <span>Student Data</span>
            </div>
            <div className="flex items-center justify-center text-orange-400">→</div>
            <div className="p-1.5 bg-stone-800 rounded border border-stone-700">
              <Layers className="w-3 h-3 mx-auto mb-1 text-stone-400" />
              <span>Feature Prep</span>
            </div>
            <div className="flex items-center justify-center text-orange-400">→</div>
            <div className="p-1.5 bg-orange-950/80 rounded border border-orange-700/60 text-orange-300 font-bold">
              <Zap className="w-3 h-3 mx-auto mb-1 text-orange-400" />
              <span>Random Forest</span>
            </div>
          </div>
        </div>

        {/* Instant Skip / Fast-Forward Button */}
        <div className="mt-6">
          <button
            type="button"
            id="skip-analysis-btn"
            onClick={onComplete}
            className="text-xs text-stone-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Skip animation & view results immediately</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
