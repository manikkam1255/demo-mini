import React, { useState } from 'react';
import { LearnTopic, StudentProfile, SkillRatings, AssessmentQuestion } from '../types';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Brain, 
  HelpCircle, Target, Award, Compass, RefreshCw, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleFormalQuestionsProps {
  topic: LearnTopic;
  studentProfile: StudentProfile;
  onCompleteQuestions: (evaluatedSkills: Partial<SkillRatings>, answersSummary: Record<string, string>) => void;
  onBackToTopicSelect: () => void;
}

export const ModuleFormalQuestions: React.FC<ModuleFormalQuestionsProps> = ({
  topic,
  studentProfile,
  onCompleteQuestions,
  onBackToTopicSelect,
}) => {
  const questions = topic.questions && topic.questions.length > 0 ? topic.questions : [
    {
      id: 'default-q1',
      topicId: topic.id,
      category: 'Knowledge & Concepts' as const,
      questionText: `What is your current baseline understanding of ${topic.title}?`,
      contextHint: 'Helps us customize the starting level of your personalized roadmap.',
      options: [
        {
          id: 'opt-1',
          text: 'Beginner: Exploring basic concepts and interested in structured foundations.',
          scoreModifier: 2,
          skillTags: ['Beginner', 'Foundations'],
          feedback: 'Great! We will structure a step-by-step primer.',
        },
        {
          id: 'opt-2',
          text: 'Intermediate: Have completed coursework or built basic mini-projects.',
          scoreModifier: 4,
          skillTags: ['Intermediate', 'Practical'],
          feedback: 'Solid! We will focus on advanced tooling and production best practices.',
        },
        {
          id: 'opt-3',
          text: 'Advanced: Confident in real-world application, system design, and optimization.',
          scoreModifier: 5,
          skillTags: ['Advanced', 'System Design'],
          feedback: 'Excellent! Ready for competitive placements and architecture.',
        },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [evaluatedScores, setEvaluatedScores] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Compute live estimated skill level
  const scoreValues: number[] = Object.values(evaluatedScores);
  const avgScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 3;
  let liveSkillLevel = 'Intermediate / Practitioner';
  let skillBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  if (avgScore >= 4.2) {
    liveSkillLevel = 'Advanced / Ready for Industry';
    skillBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (avgScore <= 2.5) {
    liveSkillLevel = 'Beginner / Foundation';
    skillBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  const handleSelectOption = (optionId: string, scoreModifier: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
    setEvaluatedScores((prev) => ({
      ...prev,
      [currentQuestion.id]: scoreModifier,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final mapped skill updates
      const finalAvg = avgScore;
      const skillUpdate: Partial<SkillRatings> = {
        programming: Math.min(5, Math.max(1, Math.round(finalAvg))),
        problemSolving: Math.min(5, Math.max(1, Math.round(finalAvg * 0.95 + 0.3))),
      };
      onCompleteQuestions(skillUpdate, selectedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBackToTopicSelect();
    }
  };

  const isCurrentAnswered = !!selectedAnswers[currentQuestion.id];
  const allAnswered = questions.every((q) => !!selectedAnswers[q.id]);

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Top Question Stepper Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
              {topic.title}
            </span>
            <span className="text-xs font-semibold text-stone-400">
              Module 04 of 07 • Alva-Style Stepped Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Formal Knowledge & Goals Assessment
          </h1>
        </div>

        {/* Live Evaluated Skill Level Indicator */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3 self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Live Evaluated Level</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${skillBadgeColor}`}>
              {liveSkillLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Alva-Style Stepped Question Card (Top Prominent Placement) */}
      <div className="relative rounded-3xl bg-white border-2 border-orange-300/80 shadow-lg p-6 sm:p-8 overflow-hidden mb-8">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />

        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
            <span className="flex items-center gap-1.5 text-orange-600">
              <Sparkles className="w-4 h-4" />
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
            </span>
            <span className="font-mono text-stone-500">{progressPercent}% Completed</span>
          </div>

          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs"
            />
          </div>
        </div>

        {/* Question Text & Category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold mb-2">
                <Target className="w-3 h-3 text-orange-600" />
                <span>{currentQuestion.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight leading-snug">
                {currentQuestion.questionText}
              </h2>
              {currentQuestion.contextHint && (
                <p className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{currentQuestion.contextHint}</span>
                </p>
              )}
            </div>

            {/* Interactive Options Cards */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;

                return (
                  <motion.div
                    key={option.id}
                    id={`question-option-${oIdx}`}
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => handleSelectOption(option.id, option.scoreModifier)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-1 ring-orange-500/20'
                        : 'border-stone-200 hover:border-orange-200 bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-orange-600 bg-orange-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          isSelected ? 'text-orange-950 font-bold' : 'text-stone-800'
                        }`}>
                          {option.text}
                        </p>
                        {isSelected && option.feedback && (
                          <p className="text-[11px] text-orange-700 mt-1.5 font-medium animate-in fade-in">
                            ✓ {option.feedback}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Skill Tag Badges */}
                    {option.skillTags && (
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {option.skillTags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stepper Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
          <button
            id="question-prev-btn"
            onClick={handlePrevious}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentIndex === 0 ? 'Change Topic' : 'Previous Question'}</span>
          </button>

          <button
            id="question-next-btn"
            disabled={!isCurrentAnswered}
            onClick={handleNext}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              isCurrentAnswered
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{currentIndex < totalQuestions - 1 ? 'Save & Next Question' : 'Synthesize AI Recommendations'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
