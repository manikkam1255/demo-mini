import React, { useState, useEffect, useRef } from 'react';
import { 
  MCQQuestion, 
  ExamResultData, 
  SkillPerformanceBreakdown, 
  RecommendedStudyTopic, 
  ExamConfigOptions,
  QuestionStatusType,
  ExamSectionName
} from '../types';
import { 
  Clock, ShieldAlert, AlertTriangle, Flag, ArrowLeft, ArrowRight, 
  CheckCircle2, HelpCircle, Maximize2, Minimize2, EyeOff, Sparkles,
  Award, RefreshCw, XCircle, Send, Video, FileText, Check, Eraser,
  Bookmark, User, Layers, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleSkillExamProps {
  careerTitle: string;
  candidateName: string;
  questions: MCQQuestion[];
  config: ExamConfigOptions;
  onSubmitExam: (result: ExamResultData) => void;
  onCancelExam: () => void;
}

export const ModuleSkillExam: React.FC<ModuleSkillExamProps> = ({
  careerTitle,
  candidateName,
  questions,
  config,
  onSubmitExam,
  onCancelExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatusType>>({});
  const [selectedSection, setSelectedSection] = useState<string>('All');
  
  // Timer & Violations
  const totalAllocatedSeconds = (config.calculatedDurationMinutes || 30) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalAllocatedSeconds);
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [violationWarningModal, setViolationWarningModal] = useState<string | null>(null);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showQuestionPaperModal, setShowQuestionPaperModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clipboardToast, setClipboardToast] = useState(false);

  // Live Camera stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittedRef = useRef<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  // Initialize initial question status as 'not_visited' for all except the first ('not_answered')
  useEffect(() => {
    const initialStatuses: Record<string, QuestionStatusType> = {};
    questions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });
    setQuestionStatuses(initialStatuses);
  }, [questions]);

  // Launch live proctoring camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startWebcam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
            audio: false,
          });
          streamRef.current = activeStream;
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
          }
        }
      } catch (err) {
        console.warn('Exam proctoring camera stream fallback:', err);
      }
    };

    if (config.enableCamera) {
      startWebcam();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [config.enableCamera]);

  // 1. Countdown Timer with auto-submission
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!isSubmittedRef.current) {
            handleFinalizeSubmission('Time Expired');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. Automated Integrity: Tab Switch & Window Blur Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmittedRef.current) {
        recordViolation('Tab switched / Browser minimized');
      }
    };

    const handleWindowBlur = () => {
      if (!isSubmittedRef.current) {
        recordViolation('Window focus lost / Switched to another app');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [violationsCount]);

  // 3. Automated Integrity: Block Copy/Cut/Paste & Right-Click
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setClipboardToast(true);
      setTimeout(() => setClipboardToast(false), 2500);
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  // 4. Automated Integrity: Fullscreen Change Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen && !isSubmittedRef.current) {
        recordViolation('Exited Fullscreen examination mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [violationsCount]);

  const recordViolation = (reason: string) => {
    setViolationsCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        setViolationWarningModal(`Exceeded Maximum Violations (${nextCount}/3): ${reason}. Exam auto-submitting.`);
        setTimeout(() => {
          handleFinalizeSubmission('Disqualified due to repeated violations', true);
        }, 2000);
      } else {
        setViolationWarningModal(`Integrity Warning (${nextCount}/3): ${reason}. Please stay focused on the exam screen.`);
      }
      return nextCount;
    });
  };

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Navigating to question: updates 'not_visited' to 'not_answered' if not previously answered
  const handleNavigateToQuestion = (index: number) => {
    const targetQ = questions[index];
    if (!targetQ) return;

    setQuestionStatuses((prev) => {
      const currentStatus = prev[targetQ.id];
      if (currentStatus === 'not_visited') {
        return { ...prev, [targetQ.id]: 'not_answered' };
      }
      return prev;
    });

    setCurrentIndex(index);
  };

  const handleSelectOption = (optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: 'answered',
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: 'not_answered',
    }));
  };

  const handleMarkForReviewAndNext = () => {
    const hasAnswer = !!userAnswers[currentQuestion.id];
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: hasAnswer ? 'answered_and_marked' : 'marked_for_review',
    }));

    if (currentIndex < totalQuestions - 1) {
      handleNavigateToQuestion(currentIndex + 1);
    }
  };

  const handleSaveAndNext = () => {
    const hasAnswer = !!userAnswers[currentQuestion.id];
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: hasAnswer ? 'answered' : 'not_answered',
    }));

    if (currentIndex < totalQuestions - 1) {
      handleNavigateToQuestion(currentIndex + 1);
    }
  };

  // Compile full final exam results
  const handleFinalizeSubmission = (submissionReason: string = 'User Submitted', isDisqualified: boolean = false) => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.max(10, Math.floor((Date.now() - startTimeRef.current) / 1000));
    let correctCount = 0;
    let attemptedQuestions = 0;

    const isCompetitive = config.markingScheme === 'competitive';
    let positiveMarks = 0;
    let negativePenaltyMarks = 0;

    // Difficulty breakdown
    const diffStats = {
      beginner: { total: 0, correct: 0 },
      intermediate: { total: 0, correct: 0 },
      difficult: { total: 0, correct: 0 },
    };

    // Skill breakdown
    const skillStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const diffKey = q.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'difficult';
      if (diffStats[diffKey]) diffStats[diffKey].total += 1;

      if (!skillStats[q.skillDomain]) {
        skillStats[q.skillDomain] = { total: 0, correct: 0 };
      }
      skillStats[q.skillDomain].total += 1;

      if (selected) {
        attemptedQuestions += 1;
        if (selected === q.correctOptionId) {
          correctCount += 1;
          positiveMarks += isCompetitive ? 4 : 1;
          if (diffStats[diffKey]) diffStats[diffKey].correct += 1;
          skillStats[q.skillDomain].correct += 1;
        } else {
          negativePenaltyMarks += isCompetitive ? 1 : 0;
        }
      }
    });

    const incorrectCount = attemptedQuestions - correctCount;
    const unattemptedCount = totalQuestions - attemptedQuestions;
    const markedForReviewCount = Object.values(questionStatuses).filter(
      (s) => s === 'marked_for_review' || s === 'answered_and_marked'
    ).length;

    const rawMarks = positiveMarks - negativePenaltyMarks;
    const maxPossibleMarks = isCompetitive ? totalQuestions * 4 : totalQuestions;
    const scorePercentage = Math.max(0, Math.round((correctCount / totalQuestions) * 100));
    const isPassed = scorePercentage >= 60 && !isDisqualified;

    // Percentile estimation modeled after competitive curves
    const percentileEstimate = Math.min(99.8, Math.max(15, Math.round(scorePercentage * 0.95 + 4.5)));

    // Grade calculation
    let grade: ExamResultData['grade'] = 'C (Needs Revision)';
    if (isDisqualified) {
      grade = 'F (Retake Required)';
    } else if (scorePercentage >= 90) {
      grade = 'A+ (Exceptional)';
    } else if (scorePercentage >= 75) {
      grade = 'A (Strong)';
    } else if (scorePercentage >= 60) {
      grade = 'B (Competent)';
    } else {
      grade = 'F (Retake Required)';
    }

    const skillBreakdown: SkillPerformanceBreakdown[] = Object.entries(skillStats).map(([skill, stat]) => {
      const pct = Math.round((stat.correct / stat.total) * 100);
      let status: SkillPerformanceBreakdown['status'] = 'Needs Improvement';
      if (pct >= 80) status = 'Mastered';
      else if (pct >= 50) status = 'Competent';

      return {
        skill,
        totalQuestions: stat.total,
        correctAnswers: stat.correct,
        percentage: pct,
        status,
      };
    });

    const strongTopics = skillBreakdown.filter((s) => s.status === 'Mastered').map((s) => s.skill);
    const weakTopics = skillBreakdown.filter((s) => s.status === 'Needs Improvement').map((s) => s.skill);

    const recommendedTopicsToStudy: RecommendedStudyTopic[] = questions
      .filter((q) => userAnswers[q.id] !== q.correctOptionId)
      .map((q) => ({
        title: q.topicToReview,
        reason: `Missed ${q.difficulty} question in ${q.skillDomain} (${q.questionType}).`,
        priority: q.difficulty === 'Beginner' ? 'High' : 'Medium',
        recommendedAction: `Master foundational principles and code examples for ${q.topicToReview}`,
        resourceName: `${q.skillDomain} Reference Docs`,
        resourceUrl: q.suggestedResourceUrl || 'https://developer.mozilla.org/',
      }));

    const resultData: ExamResultData = {
      examId: `exam-${Date.now()}`,
      careerTitle,
      totalQuestions,
      attemptedQuestions,
      correctCount,
      incorrectCount,
      unattemptedCount,
      markedForReviewCount,
      rawMarks,
      positiveMarks,
      negativePenaltyMarks,
      scorePercentage,
      percentileEstimate,
      isPassed,
      grade,
      timeSpentSeconds,
      allocatedTimeSeconds: totalAllocatedSeconds,
      violationsCount,
      isDisqualified,
      userAnswers,
      questionStatuses,
      questions,
      skillBreakdown,
      difficultyBreakdown: {
        beginner: {
          total: diffStats.beginner.total,
          correct: diffStats.beginner.correct,
          percentage: diffStats.beginner.total > 0 ? Math.round((diffStats.beginner.correct / diffStats.beginner.total) * 100) : 0,
        },
        intermediate: {
          total: diffStats.intermediate.total,
          correct: diffStats.intermediate.correct,
          percentage: diffStats.intermediate.total > 0 ? Math.round((diffStats.intermediate.correct / diffStats.intermediate.total) * 100) : 0,
        },
        difficult: {
          total: diffStats.difficult.total,
          correct: diffStats.difficult.correct,
          percentage: diffStats.difficult.total > 0 ? Math.round((diffStats.difficult.correct / diffStats.difficult.total) * 100) : 0,
        },
      },
      strongTopics: strongTopics.length > 0 ? strongTopics : ['General Technical Knowledge'],
      weakTopics: weakTopics.length > 0 ? weakTopics : ['System Architecture Edge Cases'],
      recommendedTopicsToStudy: recommendedTopicsToStudy.slice(0, 5),
      updatedCareerFit: Math.min(98, Math.max(50, scorePercentage + 8)),
      feedbackSummary: isPassed
        ? `Exemplary performance! You secured ${scorePercentage}% marks with solid accuracy across ${strongTopics.join(', ') || 'core domains'}. You are well-positioned for placement & technical interview rounds.`
        : `Assessment completed. You demonstrated good foundation (${scorePercentage}%), but should reinforce ${weakTopics.join(', ') || 'missed core concepts'} before enterprise interview rounds.`,
      markingScheme: config.markingScheme,
    };

    onSubmitExam(resultData);
  };

  // Timer formatting
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeUrgent = secondsRemaining < 180; // under 3 mins

  // Palette counts
  const answeredCount = Object.values(questionStatuses).filter((s) => s === 'answered').length;
  const notAnsweredCount = Object.values(questionStatuses).filter((s) => s === 'not_answered').length;
  const notVisitedCount = Object.values(questionStatuses).filter((s) => s === 'not_visited').length;
  const markedReviewCount = Object.values(questionStatuses).filter((s) => s === 'marked_for_review').length;
  const answeredAndMarkedCount = Object.values(questionStatuses).filter((s) => s === 'answered_and_marked').length;

  // Filter questions for palette view
  const sectionsList = ['All', 'Section A: Aptitude & Logic', 'Section B: Core Technical & Skills', 'Section C: Code Debugging & Output', 'Section D: Advanced Problem Solving'];
  const filteredQuestions = selectedSection === 'All' 
    ? questions 
    : questions.filter((q) => q.section === selectedSection);

  return (
    <div className="min-h-[85vh] py-3 max-w-7xl mx-auto px-3 sm:px-4 flex flex-col justify-between select-none">
      
      {/* Top Competitive Exam Header Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Exam Details & Candidate Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {currentIndex + 1}/{totalQuestions}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-stone-900">{careerTitle} Entrance & Skill Exam</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                config.markingScheme === 'competitive'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}>
                {config.markingScheme === 'competitive' ? 'TANCET / JEE (+4 / -1)' : 'Standard (+1 / 0)'}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
              <span>Candidate: <strong>{candidateName || 'Student'}</strong></span>
              <span>•</span>
              <span className="text-orange-700 font-semibold">{currentQuestion.section}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${
          isTimeUrgent 
            ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
            : 'bg-stone-900 border-stone-800 text-white'
        }`}>
          <Clock className={`w-4 h-4 ${isTimeUrgent ? 'text-rose-600' : 'text-orange-400'}`} />
          <span>{timeFormatted}</span>
        </div>

        {/* Right: Camera Thumbnail, Violations & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Live Camera PIP Thumbnail */}
          <div className="relative w-14 h-10 sm:w-16 sm:h-11 rounded-lg bg-stone-900 overflow-hidden border border-stone-700 shrink-0 shadow-xs flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-center text-emerald-400 font-mono">
              PROCTOR
            </div>
          </div>

          {/* Violations pill */}
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
            violationsCount > 0 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{violationsCount}/3</span>
          </div>

          {/* Question Paper Preview Modal Button */}
          <button
            type="button"
            id="view-question-paper-btn"
            onClick={() => setShowQuestionPaperModal(true)}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="View Full Question Paper"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Paper</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            type="button"
            onClick={toggleFullscreenMode}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs (TANCET / JEE Competitive Style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
        {sectionsList.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setSelectedSection(sec)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedSection === sec
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Examination Question Body & Question Palette Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        
        {/* Main Question Card (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between min-h-[440px]"
          >
            <div>
              {/* Question Header & Meta badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Question {currentIndex + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    currentQuestion.difficulty === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : currentQuestion.difficulty === 'Intermediate'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-purple-100 text-purple-900 border border-purple-300'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                    {currentQuestion.questionType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-stone-500">
                  Marking: <strong className="text-emerald-600">+{config.markingScheme === 'competitive' ? '4' : '1'}</strong> / <strong className="text-rose-500">{config.markingScheme === 'competitive' ? '-1' : '0'}</strong>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-sm sm:text-base font-bold text-stone-900 leading-relaxed mb-4">
                {currentQuestion.question}
              </h2>

              {/* Code Snippet Box for Debugging / Output Questions */}
              {currentQuestion.codeSnippet && (
                <div className="mb-4 p-3.5 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto border border-stone-800 shadow-inner">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* 4 MCQ Option Radio Cards */}
              <div className="space-y-2.5 mt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = userAnswers[currentQuestion.id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      id={`mcq-opt-${opt.id}`}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-orange-50/90 border-orange-500 shadow-xs ring-2 ring-orange-500/20'
                          : 'bg-stone-50/60 border-stone-200 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 uppercase transition-colors ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {opt.id}
                      </div>
                      <span className={`text-xs sm:text-sm leading-relaxed ${isSelected ? 'text-stone-900 font-semibold' : 'text-stone-700'}`}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Controls (TANCET/JEE Format: Save & Next, Mark Review, Clear Response) */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="clear-response-btn"
                  onClick={handleClearResponse}
                  disabled={!userAnswers[currentQuestion.id]}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear Response</span>
                </button>

                <button
                  type="button"
                  id="mark-review-btn"
                  onClick={handleMarkForReviewAndNext}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-purple-300 bg-purple-50 text-purple-900 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-purple-700" />
                  <span>Mark for Review & Next</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="exam-prev-btn"
                  disabled={currentIndex === 0}
                  onClick={() => handleNavigateToQuestion(currentIndex - 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    id="save-and-next-btn"
                    onClick={handleSaveAndNext}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Save & Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    id="exam-submit-trigger-btn"
                    onClick={() => setShowSubmitConfirmModal(true)}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Palette Sidebar (1 col) */}
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Question Palette
              </h3>
              <span className="text-[11px] font-semibold text-stone-400">
                Total: {totalQuestions}
              </span>
            </div>

            {/* Grid of question buttons with 5 status colors */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const status = questionStatuses[q.id] || 'not_visited';

                let statusClasses = 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200';
                if (status === 'answered') {
                  statusClasses = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                } else if (status === 'not_answered') {
                  statusClasses = 'bg-rose-500 text-white border-rose-600 font-bold';
                } else if (status === 'marked_for_review') {
                  statusClasses = 'bg-purple-600 text-white border-purple-700 font-bold';
                } else if (status === 'answered_and_marked') {
                  statusClasses = 'bg-purple-800 text-white border-emerald-400 ring-2 ring-emerald-400 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    id={`nav-palette-${idx + 1}`}
                    type="button"
                    onClick={() => handleNavigateToQuestion(idx)}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer border ${statusClasses} ${
                      isCurrent ? 'ring-2 ring-orange-500 ring-offset-2 scale-105 z-10' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Standard Competitive Exam Status Legend */}
            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-[11px] text-stone-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Answered</span>
                </div>
                <span className="font-bold text-stone-900">{answeredCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500"></span>
                  <span>Not Answered</span>
                </div>
                <span className="font-bold text-stone-900">{notAnsweredCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-600"></span>
                  <span>Marked for Review</span>
                </div>
                <span className="font-bold text-stone-900">{markedReviewCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-800 ring-1 ring-emerald-400"></span>
                  <span>Answered & Marked</span>
                </div>
                <span className="font-bold text-stone-900">{answeredAndMarkedCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-stone-100 border border-stone-300"></span>
                  <span>Not Visited</span>
                </div>
                <span className="font-bold text-stone-900">{notVisitedCount}</span>
              </div>
            </div>

            <button
              type="button"
              id="sidebar-finish-test-btn"
              onClick={() => setShowSubmitConfirmModal(true)}
              className="w-full mt-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Finish & Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Violation Alert Modal */}
      {violationWarningModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Security & Integrity Warning</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{violationWarningModal}</p>
            </div>
            <button
              type="button"
              id="dismiss-violation-btn"
              onClick={() => setViolationWarningModal(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              I Understand • Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* Clipboard Toast */}
      {clipboardToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-150">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Clipboard copy/paste is strictly disabled during the exam.</span>
        </div>
      )}

      {/* Full Question Paper View Modal */}
      {showQuestionPaperModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-stone-900">Question Paper View ({careerTitle})</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionPaperModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Q{idx + 1}. {q.skillDomain} ({q.difficulty})</span>
                    <span className="text-[10px] text-stone-500 font-mono">{q.section}</span>
                  </div>
                  <p className="text-stone-800 font-medium">{q.question}</p>
                  {q.codeSnippet && (
                    <div className="p-2.5 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                      <pre>{q.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowQuestionPaperModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
              >
                Close Paper View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">Confirm Exam Submission</h3>
              <p className="text-xs text-stone-600 mt-1">
                Are you ready to submit your exam for instant AI scoring, percentile evaluation, and interactive doubt resolution?
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-700">
                <span>Attempted / Answered:</span>
                <span className="font-bold text-emerald-600">{answeredCount + answeredAndMarkedCount} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Marked for Review:</span>
                <span className="font-bold text-purple-600">{markedReviewCount}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Unattempted Questions:</span>
                <span className="font-bold text-rose-600">{notAnsweredCount + notVisitedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="cancel-submit-btn"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                type="button"
                id="confirm-submit-exam-btn"
                onClick={() => {
                  setShowSubmitConfirmModal(false);
                  handleFinalizeSubmission('User Submitted');
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
