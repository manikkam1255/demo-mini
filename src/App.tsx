import React, { useState, useEffect } from 'react';
import { 
  AssessmentStep, 
  StudentProfile, 
  SkillRatings, 
  InterestPreferences, 
  CareerPreferences, 
  CareerMatch,
  LearnTopic,
  MCQQuestion,    
  ExamResultData,
  ExamConfigOptions
} from './types';
import { runMLRecommendationEngine, SAMPLE_STUDENT_PROFILES } from './utils/mlEngine';
import { LEARN_TOPICS_DATABASE } from './data/learningResourcesDatabase';
import { generatePersonalizedExam } from './data/mcqExamDatabase';
import { HeaderNavbar } from './components/HeaderNavbar';
import { ModuleWelcome } from './components/ModuleWelcome';
import { ModuleStudentDetails } from './components/ModuleStudentDetails';
import { ModuleSkillsAssessment } from './components/ModuleSkillsAssessment';
import { ModuleAIAnalysis } from './components/ModuleAIAnalysis';
import { ModuleLearnTrack } from './components/ModuleLearnTrack';
import { ModuleExamInstructions } from './components/ModuleExamInstructions';
import { ModuleSkillExam } from './components/ModuleSkillExam';
import { ModuleResult } from './components/ModuleResult';
import { ModuleRecommendations } from './components/ModuleRecommendations';
import { ModuleDashboard } from './components/ModuleDashboard';
import { ModuleTopicSelect } from './components/ModuleTopicSelect';
import { ModuleFormalQuestions } from './components/ModuleFormalQuestions';
import { ModuleInterests } from './components/ModuleInterests';
import { ModuleCareerPreferences } from './components/ModuleCareerPreferences';
import { CareerDetailsModal } from './components/CareerDetailsModal';

import { PrintableReportModal } from './components/PrintableReportModal';
import { AnimatePresence, motion } from 'motion/react';


const DEFAULT_PROFILE: StudentProfile = {
  fullName: '',
  email: '',
  age: 20,
  gender: 'Male',
  degree: 'B.Sc Computer Science',
  yearOfStudy: '3rd Year (Junior)',
  college: '',
  cgpa: 8.2,
};

const DEFAULT_SKILLS: SkillRatings = {
  programming: 4,
  communication: 3,
  problemSolving: 4,
  mathematics: 3,
  creativity: 3,
  leadership: 3,
  specializedSkills: ['Python', 'SQL', 'Git & GitHub'],
};

// Default interest preferences for the student
const DEFAULT_INTERESTS: InterestPreferences = {
  domains: ['Coding', 'Technology', 'AI & ML'],

  workTypes: ['Problem Solving', 'Technical Work'],
};


const DEFAULT_PREFERENCES: CareerPreferences = {
  priorities: ['High Salary', 'Career Growth'],
  
  workEnvironment: 'Hybrid',
  targetTimeline: 'Campus Placements (2026)',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [skills, setSkills] = useState<SkillRatings>(DEFAULT_SKILLS);
  const [interests, setInterests] = useState<InterestPreferences>(DEFAULT_INTERESTS);
  const [preferences, setPreferences] = useState<CareerPreferences>(DEFAULT_PREFERENCES);
  const [selectedTopic, setSelectedTopic] = useState<LearnTopic>(LEARN_TOPICS_DATABASE[0]);
  
  const [recommendations, setRecommendations] = useState<CareerMatch[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Exam States
  const [examConfig, setExamConfig] = useState<ExamConfigOptions>({
    questionCount: 20,
    markingScheme: 'competitive',
    enableCamera: true,
    selectedSkills: DEFAULT_SKILLS.specializedSkills,
    calculatedDurationMinutes: 32,
  });
  const [examQuestions, setExamQuestions] = useState<MCQQuestion[]>([]);
  const [examResult, setExamResult] = useState<ExamResultData | null>(null);

  // Active recommended career (top match)
  const activeCareer = recommendations[0] || runMLRecommendationEngine(profile, skills, interests, preferences)[0];

  // Initialize recommendations when parameters change
  const computeAndSaveRecommendations = (
    p: StudentProfile,
    s: SkillRatings,
    i: InterestPreferences,
    cp: CareerPreferences,
    topicId?: string
  ) => {
    // 1. Run local deterministic ML ensemble with topic affinity
    const mlResults = runMLRecommendationEngine(p, s, i, cp, topicId);
    setRecommendations(mlResults);

    // 2. Asynchronously request Gemini deep AI reasoning to enrich the top match (if server reachable)
    try {
      const topMatch = mlResults[0];
      if (topMatch) {
        fetch('/api/ai/deep-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentProfile: p,
            skillRatings: s,
            interests: i,
            careerPreferences: cp,
            topCareer: topMatch,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.data) {
              setRecommendations((prev) => {
                if (prev.length === 0) return prev;
                const updated = [...prev];
                updated[0] = {
                  ...updated[0],
                  aiPersonalizedAdvice: result.data.personalizedAdvice,
                  customMilestones: result.data.customMilestones,
                  interviewFocusAreas: result.data.interviewFocusAreas,
                  industryOutlook: result.data.industryOutlook,
                };
                return updated;
              });
            }
          })
          .catch((err) => {
            console.log('AI deep reasoning endpoint handled locally:', err);
          });
      }
    } catch (e) {
      // Local ML handles cleanly
    }
  };

  // Load sample student profile for instant testing
  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_STUDENT_PROFILES.find((s) => s.name === sampleKey) || SAMPLE_STUDENT_PROFILES[0];
    setProfile(sample.profile);
    setSkills(sample.skills);
    setInterests(sample.interests);
    setPreferences(sample.preferences);

    const matchedTopic = LEARN_TOPICS_DATABASE.find((t) => t.id === sample.topicId) || LEARN_TOPICS_DATABASE[0];
    setSelectedTopic(matchedTopic);

    const mlResults = runMLRecommendationEngine(sample.profile, sample.skills, sample.interests, sample.preferences, matchedTopic.id);
    setRecommendations(mlResults);
    setHasCompletedAssessment(true);
    setCurrentStep('learn-track');
  };

  const handleReset = () => {
    setProfile(DEFAULT_PROFILE);
    setSkills(DEFAULT_SKILLS);
    setInterests(DEFAULT_INTERESTS);
    setPreferences(DEFAULT_PREFERENCES);
    setSelectedTopic(LEARN_TOPICS_DATABASE[0]);
    setRecommendations([]);
    setHasCompletedAssessment(false);
    setSelectedCareer(null);
    setExamQuestions([]);
    setExamResult(null);
    setExamConfig({
      questionCount: 20,
      markingScheme: 'competitive',
      enableCamera: true,
      selectedSkills: DEFAULT_SKILLS.specializedSkills,
      calculatedDurationMinutes: 32,
    });
    setCurrentStep('welcome');
  };

  // Step transitions
  const handleStart = () => {
    setCurrentStep('student-details');
  };

  const handleStudentDetailsNext = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    setCurrentStep('skills-assessment');
  };

  const handleSkillsNext = (updatedSkills: SkillRatings) => {
    setSkills(updatedSkills);
    setExamConfig((prev) => ({
      ...prev,
      selectedSkills: updatedSkills.specializedSkills,
    }));
    computeAndSaveRecommendations(profile, updatedSkills, interests, preferences, selectedTopic.id);
    setCurrentStep('ai-analysis');
  };

  const handleAIAnalysisComplete = () => {
    setHasCompletedAssessment(true);
    setCurrentStep('learn-track');
  };

  const handleProceedToExamInstructions = () => {
    setCurrentStep('exam-instructions');
  };

  const handleStartLiveExam = () => {
    const topCareer = activeCareer;
    const questions = generatePersonalizedExam(
      topCareer.id, 
      selectedTopic.id, 
      examConfig.questionCount, 
      skills.specializedSkills
    );
    setExamQuestions(questions);
    setCurrentStep('skill-exam');
  };

  const handleExamSubmit = (result: ExamResultData) => {
    setExamResult(result);
    setCurrentStep('exam-result');
  };

  const handleRetakeExam = () => {
    setCurrentStep('exam-instructions');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 font-sans text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Top Sticky Modern Navigation Bar */}
      <HeaderNavbar
        currentStep={currentStep}
        onNavigate={setCurrentStep}
        hasCompletedAssessment={hasCompletedAssessment}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        studentName={profile.fullName}
      />

      {/* Main Module Content Viewport */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          
          {/* Module 01: Home / Welcome */}
          {currentStep === 'welcome' && (
            <motion.div
              key="module-welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleWelcome
                onStart={handleStart}
                onLoadSample={handleLoadSample}
                hasSavedProfile={hasCompletedAssessment}
                onViewDashboard={() => setCurrentStep('career-dashboard')}
                studentName={profile.fullName}
              />
            </motion.div>
          )}

          {/* Module 02: Student Details */}
          {currentStep === 'student-details' && (
            <motion.div
              key="module-student-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleStudentDetails
                initialProfile={profile}
                onSaveAndNext={handleStudentDetailsNext}
                onBack={() => setCurrentStep('welcome')}
              />
            </motion.div>
          )}

          {/* Module 03: Skills Assessment (Interactive 1-5 ratings & selections) */}
          {currentStep === 'skills-assessment' && (
            <motion.div
              key="module-skills-assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleSkillsAssessment
                initialSkills={skills}
                onSaveAndNext={handleSkillsNext}
                onBack={() => setCurrentStep('student-details')}
              />
            </motion.div>
          )}

          {/* Module 04: AI Skill Analysis & Career Recommendation Pipeline */}
          {currentStep === 'ai-analysis' && (
            <motion.div
              key="module-ai-analysis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleAIAnalysis
                onComplete={handleAIAnalysisComplete}
                studentName={profile.fullName}
                degree={profile.degree}
              />
            </motion.div>
          )}

          {/* Module 05: Personalized Learn Track & Career-Based Resources */}
          {currentStep === 'learn-track' && (
            <motion.div
              key="module-learn-track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleLearnTrack
                career={activeCareer}
                studentProfile={profile}
                skillRatings={skills}
                onProceedToExam={handleProceedToExamInstructions}
                onBackToAnalysis={() => setCurrentStep('ai-analysis')}
              />
            </motion.div>
          )}

          {/* Module 06a: Skill-Based Exam Instructions & Integrity Guidelines */}
          {currentStep === 'exam-instructions' && (
            <motion.div
              key="module-exam-instructions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleExamInstructions
                career={activeCareer}
                studentProfile={profile}
                selectedSkills={skills.specializedSkills}
                config={examConfig}
                onChangeConfig={(updated) => setExamConfig((prev) => ({ ...prev, ...updated }))}
                onStartExam={handleStartLiveExam}
                onBackToLearnTrack={() => setCurrentStep('learn-track')}
              />
            </motion.div>
          )}

          {/* Module 06b: Live Skill-Based MCQ Test Interface */}
          {currentStep === 'skill-exam' && (
            <motion.div
              key="module-skill-exam"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleSkillExam
                careerTitle={activeCareer.title}
                candidateName={profile.fullName}
                questions={examQuestions}
                config={examConfig}
                onSubmitExam={handleExamSubmit}
                onCancelExam={() => setCurrentStep('learn-track')}
              />
            </motion.div>
          )}

          {/* Module 07: Result & Performance Analysis + Feedback Loop */}
          {currentStep === 'exam-result' && examResult && (
            <motion.div
              key="module-exam-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleResult
                result={examResult}
                studentProfile={profile}
                career={activeCareer}
                onRetakeExam={handleRetakeExam}
                onExploreOtherCareers={() => setCurrentStep('recommendations')}
              />
            </motion.div>
          )}

          {/* Auxiliary Screen: Recommendations Summary View */}
          {currentStep === 'recommendations' && (
            <motion.div
              key="module-recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleRecommendations
                recommendations={recommendations.length > 0 ? recommendations : runMLRecommendationEngine(profile, skills, interests, preferences, selectedTopic.id)}
                studentProfile={profile}
                skillRatings={skills}
                onSelectCareer={setSelectedCareer}
                onGoToDashboard={() => setCurrentStep('career-dashboard')}
                onRetake={() => setCurrentStep('skills-assessment')}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </motion.div>
          )}

          {/* Auxiliary Screen: Student Career Dashboard */}
          {currentStep === 'career-dashboard' && (
            <motion.div
              key="module-career-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ModuleDashboard
                profile={profile}
                skills={skills}
                interests={interests}
                preferences={preferences}
                recommendations={recommendations.length > 0 ? recommendations : runMLRecommendationEngine(profile, skills, interests, preferences, selectedTopic.id)}
                onSelectCareer={setSelectedCareer}
                onRetake={() => setCurrentStep('student-details')}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Career Details Deep Modal */}
      {selectedCareer && (
        <CareerDetailsModal
          career={selectedCareer}
          studentProfile={profile}
          skillRatings={skills}
          onClose={() => setSelectedCareer(null)}
          onOpenReport={() => {
            setSelectedCareer(null);
            setIsReportOpen(true);
          }}
        />
      )}

      {/* Printable Report Summary Modal */}
      <PrintableReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        profile={profile}
        skills={skills}
        interests={interests}
        preferences={preferences}
        recommendations={recommendations.length > 0 ? recommendations : runMLRecommendationEngine(profile, skills, interests, preferences, selectedTopic.id)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-xs text-stone-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">PathFinder AI</span>
            <span>• Intelligent ML Career Recommendation & Skill Gap Analysis</span>
          </div>
          <div className="text-stone-400">
            Based on Random Forest / Decision Tree ML Classifier Methodology & Interactive Skill Assessment
          </div>
        </div>
      </footer>
    </div>
  );
}


