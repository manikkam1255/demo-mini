import React from 'react';
import { AssessmentStep } from '../types';
import { Sparkles, Compass, User, Brain, Heart, Target, Cpu, Award, LayoutDashboard, RefreshCw, ChevronRight, Layers, HelpCircle } from 'lucide-react';

interface HeaderNavbarProps {
  currentStep: AssessmentStep;
  onNavigate: (step: AssessmentStep) => void;
  hasCompletedAssessment: boolean;
  onLoadSample: (key: string) => void;
  onReset: () => void;
  studentName?: string;
}

const STEPS: { id: AssessmentStep; label: string; number: string; icon: React.ElementType }[] = [
  { id: 'welcome', label: 'Home', number: '01', icon: Compass },
  { id: 'student-details', label: 'Details', number: '02', icon: User },
  { id: 'skills-assessment', label: 'Skills', number: '03', icon: Brain },
  { id: 'ai-analysis', label: 'AI Analysis', number: '04', icon: Cpu },
  { id: 'learn-track', label: 'Learn Track', number: '05', icon: Layers },
  { id: 'exam-instructions', label: 'Skill Exam', number: '06', icon: HelpCircle },
  { id: 'exam-result', label: 'Result', number: '07', icon: Award },
  { id: 'career-dashboard', label: 'Dashboard', number: '08', icon: LayoutDashboard },
];


export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentStep,
  onNavigate,
  hasCompletedAssessment,
  onLoadSample,
  onReset,
  studentName,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-lg tracking-tight">PathFinder<span className="text-orange-600">AI</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200/60">
                  ML Ensemble
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Intelligent Career Recommendation System</p>
            </div>
          </div>

          {/* Stepper progress (Center) */}
          <div className="hidden lg:flex items-center gap-1 bg-stone-100/90 p-1 rounded-full border border-stone-200/80">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPassed = currentStepIndex > idx;
              const isAccessible = isPassed || isActive || (hasCompletedAssessment && (step.id === 'recommendations' || step.id === 'career-dashboard'));

              return (
                <button
                  key={step.id}
                  id={`step-nav-btn-${step.id}`}
                  disabled={!isAccessible}
                  onClick={() => onNavigate(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs font-semibold'
                      : isPassed
                      ? 'text-stone-700 hover:bg-stone-200/70 cursor-pointer'
                      : 'text-stone-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isPassed ? 'text-orange-600' : 'text-stone-400'}`} />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions: Demo Loader & Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Pre-fill dropdown */}
            <div className="relative group">
              <button 
                id="demo-loader-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors"
                title="Quickly fill with sample student data for instant testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Load Sample</span>
                <span className="sm:hidden">Demo</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-200 p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Test Student Profiles
                </div>
                <button
                  id="sample-priya-btn"
                  onClick={() => onLoadSample('priya')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-orange-50 text-stone-800 hover:text-orange-900 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-[11px] text-stone-500">CS 3rd Year • Tech & Coding</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
                <button
                  id="sample-rohit-btn"
                  onClick={() => onLoadSample('rohit')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-orange-50 text-stone-800 hover:text-orange-900 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold">Rohit Verma</div>
                    <div className="text-[11px] text-stone-500">IT 2nd Year • Data & Analytics</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
                <button
                  id="sample-ananya-btn"
                  onClick={() => onLoadSample('ananya')}
                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-orange-50 text-stone-800 hover:text-orange-900 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold">Ananya Patel</div>
                    <div className="text-[11px] text-stone-500">BCA 4th Year • UI/UX & Product</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Dashboard Shortcut if finished */}
            {hasCompletedAssessment && (
              <button
                id="quick-dashboard-btn"
                onClick={() => onNavigate('career-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  currentStep === 'career-dashboard'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{studentName ? `${studentName.split(' ')[0]}'s Profile` : 'Dashboard'}</span>
              </button>
            )}

            {/* Reset Button */}
            <button
              id="reset-assessment-btn"
              onClick={onReset}
              title="Reset Assessment"
              className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Step Bar */}
      <div className="lg:hidden bg-stone-50 px-4 py-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-orange-600">Step {STEPS[currentStepIndex]?.number}:</span>
          <span className="font-medium text-stone-800">{STEPS[currentStepIndex]?.label}</span>
        </div>
        <div className="text-stone-400 font-mono text-[11px]">
          {currentStepIndex + 1} / {STEPS.length}
        </div>
      </div>
    </header>
  );
};
