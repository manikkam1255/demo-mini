import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  ExamResultData, 
  StudentProfile, 
  CareerMatch, 
  MCQQuestion,
  DoubtMessage
} from '../types';
import { 
  Award, CheckCircle2, XCircle, AlertTriangle, BookOpen, 
  TrendingUp, RefreshCw, ArrowRight, ExternalLink, HelpCircle,
  Clock, ShieldAlert, Sparkles, Send, Bot, User, MessageSquare,
  ChevronDown, ChevronUp, Layers, Check, Zap, Filter, Printer, Loader2,
  Copy, Trash2, Code, Lightbulb, BrainCircuit, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerExamScorePrint } from '../utils/printReport';

interface ModuleResultProps {
  result: ExamResultData;
  studentProfile: StudentProfile;
  career: CareerMatch;
  onRetakeExam: () => void;
  onExploreOtherCareers: () => void;
}

export const ModuleResult: React.FC<ModuleResultProps> = ({
  result,
  studentProfile,
  career,
  onRetakeExam,
  onExploreOtherCareers,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isPrintingCard, setIsPrintingCard] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // AI Doubt Clearing Assistant State
  const [doubtMessages, setDoubtMessages] = useState<DoubtMessage[]>([
    {
      id: 'welcome-doubt-ai',
      sender: 'ai',
      text: `Hello **${studentProfile.fullName || 'Student'}**! 👋 I am your **Skill-Based AI Doubt Resolver** powered by **Gemini 3.7 Flash**.\n\nYou scored **${result.scorePercentage}%** in the **${result.careerTitle}** assessment.\n\nAsk me any doubt about missed questions, code logic, mathematics, time complexity, or practical interview tips!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userDoubtInput, setUserDoubtInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Auto-scroll to latest chat message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [doubtMessages, isAiThinking]);

  // Quick Prompt Chips
  const quickPrompts = [
    { label: '💡 Step-by-Step Logic', prompt: 'Can you explain the step-by-step logic to solve questions in this exam domain with formulas/rules?' },
    { label: '💻 Working Code Example', prompt: 'Can you give a clean, runnable code implementation for this concept with inline comments?' },
    { label: '⏱️ Time & Space Complexity', prompt: 'What is the optimal time and space complexity for solving these algorithmic problems?' },
    { label: '🎯 Top Interview Questions', prompt: `What are the top 3 interview questions companies ask for ${career.title} on these topics?` },
    { label: '📋 Quick Cheat Sheet', prompt: 'Provide a 5-point cheat sheet summarizing the most critical rules to ace this topic.' },
  ];

  // Filter questions
  const filteredQuestions = result.questions.filter((q) => {
    const selected = result.userAnswers[q.id];
    if (filterType === 'correct') return selected === q.correctOptionId;
    if (filterType === 'incorrect') return selected && selected !== q.correctOptionId;
    if (filterType === 'unattempted') return !selected;
    return true;
  });

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    setDoubtMessages([
      {
        id: `welcome-doubt-ai-${Date.now()}`,
        sender: 'ai',
        text: `Chat cleared! Ready for your next doubt on **${career.title}** concepts, algorithms, or questions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleAskDoubtOnQuestion = async (question: MCQQuestion) => {
    const studentAnswer = result.userAnswers[question.id];
    const userSelectedOpt = question.options.find((o) => o.id === studentAnswer)?.text || 'Unattempted';
    const correctOpt = question.options.find((o) => o.id === question.correctOptionId)?.text || '';

    const newStudentMsg: DoubtMessage = {
      id: `doubt-q-${question.id}-${Date.now()}`,
      sender: 'student',
      questionId: question.id,
      text: `Can you explain Question: "${question.question.slice(0, 80)}..."?\n• I selected: "${userSelectedOpt}"\n• Correct answer: "${correctOpt}"\nWhy is my choice incorrect and how can I solve this faster in exams?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDoubtMessages((prev) => [...prev, newStudentMsg]);
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/ai/doubt-resolver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Explain question on ${question.skillDomain}: "${question.question}". Student chose ${userSelectedOpt}, correct is ${correctOpt}.`,
          studentProfile,
          career,
          examContext: {
            scorePercentage: result.scorePercentage,
            rawMarks: result.rawMarks,
            markingScheme: result.markingScheme,
          },
          questionContext: {
            question: question.question,
            codeSnippet: question.codeSnippet,
            options: question.options,
            correctOptionId: question.correctOptionId,
            userSelectedOptionId: studentAnswer || 'unattempted',
            explanation: question.explanation,
            skillDomain: question.skillDomain,
            difficulty: question.difficulty,
            topicToReview: question.topicToReview,
          },
          history: doubtMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || `### 🧠 AI Concept Breakdown for ${question.skillDomain}\n\n**1. The Core Concept:** ${question.explanation}\n\n**2. Why the Correct Option Works:** Follows standard ${question.skillDomain} principles.\n\n**3. Recommended Study Action:** Deepen practice in **${question.topicToReview}**.`;

      const aiReplyMsg: DoubtMessage = {
        id: `ai-reply-${Date.now()}`,
        sender: 'ai',
        questionId: question.id,
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDoubtMessages((prev) => [...prev, aiReplyMsg]);
    } catch (err) {
      console.error('Doubt resolver API error:', err);
      const fallbackReply: DoubtMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        questionId: question.id,
        text: `### 🧠 AI Concept Solution for ${question.skillDomain}\n\n**1. Explanation:** ${question.explanation}\n\n**2. Core Key:** Verify edge conditions and operator precedence.\n\n**3. Focus Topic:** Review **${question.topicToReview}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDoubtMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSendCustomDoubt = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const query = (customPrompt || userDoubtInput).trim();
    if (!query || isAiThinking) return;

    setUserDoubtInput('');

    const newStudentMsg: DoubtMessage = {
      id: `doubt-custom-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDoubtMessages((prev) => [...prev, newStudentMsg]);
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/ai/doubt-resolver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          studentProfile,
          career,
          examContext: {
            scorePercentage: result.scorePercentage,
            rawMarks: result.rawMarks,
            markingScheme: result.markingScheme,
          },
          history: doubtMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || `Regarding **"${query}"** for **${career.title}**:\n\n• **Core Principle:** Focus on predictable runtime invariants and boundary validations.\n• **Interview Tip:** Always state the approach, constraints, and time/space complexity.`;

      const aiReplyMsg: DoubtMessage = {
        id: `ai-reply-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDoubtMessages((prev) => [...prev, aiReplyMsg]);
    } catch (err) {
      console.error('Custom doubt API error:', err);
      const fallbackReply: DoubtMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: `### 🧠 AI Skill Mentor Solution\n\nRegarding **"${query}"** for **${career.title}**:\n\n• **Foundational Principle:** Master core data structures, API contracts, and defensive bounds.\n• **Best Practice:** Profile before optimizing speculatively.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDoubtMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handlePrintScoreCard = async () => {
    setIsPrintingCard(true);
    try {
      await triggerExamScorePrint({
        profile: studentProfile,
        career,
        result,
      });
    } catch (err) {
      console.error('Score print failed:', err);
      window.print();
    } finally {
      setTimeout(() => setIsPrintingCard(false), 1200);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Module 07 • Competitive Examination Result & Performance Analysis</span>
            </div>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">• TANCET / JEE Exam Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 tracking-tight">
            📊 Exam Report & AI Skill Doubt Resolver
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Detailed diagnostic score card for <strong>{studentProfile.fullName || 'Candidate'}</strong> in <strong>{career.title}</strong>.
          </p>
        </div>

        {/* Print Score Card CTA */}
        <button
          type="button"
          id="print-exam-score-card-btn"
          onClick={handlePrintScoreCard}
          disabled={isPrintingCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-75"
        >
          {isPrintingCard ? (
            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
          ) : (
            <Printer className="w-4 h-4 text-orange-400" />
          )}
          <span>{isPrintingCard ? 'Opening Print...' : 'Print / Save Score Card'}</span>
        </button>
      </div>

      {/* Main Score & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Score & Grade Hero Card */}
        <div className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between md:col-span-2 ${
          result.isPassed 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-emerald-600' 
            : 'bg-gradient-to-br from-amber-600 to-rose-700 text-white border-amber-600'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Performance Evaluation
              </span>
              <span className="text-xs font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                Grade {result.grade.split(' ')[0]}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tight">{result.scorePercentage}%</span>
              <span className="text-sm font-semibold text-white/90">
                ({result.correctCount} / {result.totalQuestions} Questions Correct)
              </span>
            </div>

            <p className="text-xs mt-2 text-white/90 leading-relaxed">
              {result.feedbackSummary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-medium">
            <span>Career Match Fitness:</span>
            <span className="font-bold text-base">{result.updatedCareerFit}% Fit</span>
          </div>
        </div>

        {/* TANCET / JEE Competitive Marks Breakdown */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Marking Breakdown
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Positive Marks:</span>
                <span className="font-bold text-emerald-600">+{result.positiveMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Negative Penalties:</span>
                <span className="font-bold text-rose-600">-{result.negativePenaltyMarks}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-100">
                <span className="font-bold text-stone-900">Net Raw Score:</span>
                <span className="font-black text-stone-900 text-sm">{result.rawMarks}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-900 font-semibold text-center">
            Estimated Percentile: ~{result.percentileEstimate}th %ile
          </div>
        </div>

        {/* Speed & Proctoring Integrity */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Time & Integrity
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Time Spent:</span>
                <span className="font-bold text-stone-900">
                  {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Allocated Time:</span>
                <span className="font-bold text-stone-900">{Math.floor(result.allocatedTimeSeconds / 60)}m</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-100">
                <span className="text-stone-600">Security Warnings:</span>
                <span className={`font-bold ${result.violationsCount === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {result.violationsCount} / 3
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 text-center font-medium">
            Proctoring Verified ✓
          </div>
        </div>
      </div>

      {/* Difficulty Progression Breakdown (Beginner -> Intermediate -> Difficult) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" />
          <span>Difficulty Progression Analysis (Beginner → Intermediate → Difficult)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Beginner Tier</span>
              <span className="text-xs font-black text-emerald-700">{result.difficultyBreakdown.beginner.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${result.difficultyBreakdown.beginner.percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-emerald-800 block">
              {result.difficultyBreakdown.beginner.correct} of {result.difficultyBreakdown.beginner.total} Correct
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">Intermediate Tier</span>
              <span className="text-xs font-black text-blue-700">{result.difficultyBreakdown.intermediate.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-blue-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${result.difficultyBreakdown.intermediate.percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-blue-800 block">
              {result.difficultyBreakdown.intermediate.correct} of {result.difficultyBreakdown.intermediate.total} Correct
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">Difficult Tier</span>
              <span className="text-xs font-black text-purple-700">{result.difficultyBreakdown.difficult.percentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${result.difficultyBreakdown.difficult.percentage}%` }}
              />
            </div>
            <span className="text-[11px] text-purple-800 block">
              {result.difficultyBreakdown.difficult.correct} of {result.difficultyBreakdown.difficult.total} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Skill Breakdown & Study Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domain Skills Mastery */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Skill & Domain Competency</span>
          </h2>

          <div className="space-y-3">
            {result.skillBreakdown.map((sb) => (
              <div key={sb.skill} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-800">{sb.skill}</span>
                  <span className={sb.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}>
                    {sb.correctAnswers}/{sb.totalQuestions} ({sb.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${sb.percentage >= 70 ? 'bg-emerald-500' : sb.percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${sb.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Study Recommendations */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>Targeted Topics to Master</span>
          </h2>

          <div className="space-y-2.5">
            {result.recommendedTopicsToStudy.map((topic, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">{topic.title}</span>
                  <span className="text-[11px] text-stone-600">{topic.recommendedAction}</span>
                </div>
                <a
                  href={topic.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
                  title="Open Resource"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive AI Doubt Resolver & Skill Questions Assistant */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900">Skill-Based AI Doubt Resolver</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                  ⚡ Gemini 3.7 Flash AI
                </span>
              </div>
              <span className="text-[11px] text-stone-500">Instant step-by-step solutions, code walkthroughs, and exam concept mastery</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AI Mentor Online</span>
            </span>
            <button
              type="button"
              onClick={handleClearChat}
              title="Clear Conversation"
              className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Clear</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-500" /> Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAiThinking}
              onClick={() => handleSendCustomDoubt(undefined, qp.prompt)}
              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-200 border border-stone-200 text-stone-700 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat History Box */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs border border-stone-100 rounded-2xl p-3 bg-stone-50/50">
          {doubtMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl border transition-all ${
                msg.sender === 'ai'
                  ? 'bg-white border-stone-200 text-stone-800 shadow-xs'
                  : 'bg-orange-600 text-white border-orange-600 ml-auto max-w-[85%]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 opacity-90 text-[11px] font-semibold pb-1.5 border-b border-stone-100/40">
                <div className="flex items-center gap-1.5">
                  {msg.sender === 'ai' ? (
                    <>
                      <Bot className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-stone-900 font-bold">AI Skill Mentor</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded">Instant</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-white/90" />
                      <span>{studentProfile.fullName || 'Candidate'}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="p-1 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                      title="Copy Solution"
                    >
                      {copiedMessageId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'ai' ? (
                <div className="markdown-body text-xs text-stone-800 leading-relaxed space-y-2 [&_h3]:font-bold [&_h3]:text-stone-900 [&_h3]:text-xs [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_pre]:bg-stone-900 [&_pre]:text-stone-100 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-[11px] [&_code]:font-mono [&_code]:px-1 [&_code]:py-0.5 [&_code]:bg-stone-100 [&_code]:rounded [&_strong]:text-stone-900">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <div className="leading-relaxed whitespace-pre-wrap text-white/95 text-xs">{msg.text}</div>
              )}
            </div>
          ))}

          {isAiThinking && (
            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 text-xs text-stone-600 flex items-center gap-3 shadow-xs animate-pulse">
              <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900 block text-xs">AI Skill Mentor is thinking...</span>
                <span className="text-[11px] text-stone-500">Formulating step-by-step reasoning, edge-cases, and conceptual derivations</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar for Asking Doubts */}
        <form onSubmit={handleSendCustomDoubt} className="flex gap-2 pt-1">
          <input
            type="text"
            id="doubt-input-field"
            value={userDoubtInput}
            onChange={(e) => setUserDoubtInput(e.target.value)}
            placeholder={`Ask any doubt on ${career.title}, algorithms, code, math formulas, or interview questions...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
          />
          <button
            type="submit"
            id="send-doubt-btn"
            disabled={!userDoubtInput.trim() || isAiThinking}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {isAiThinking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Ask Doubt</span>
          </button>
        </form>
      </div>

      {/* Detailed Question Review List with "Ask Doubt" on each Question */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Question-by-Question Solution Review</h2>
            <span className="text-xs text-stone-500">Review correct answers, explanations, and ask AI doubts per question</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors cursor-pointer ${
                  filterType === f
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const userChoice = result.userAnswers[q.id];
            const isCorrect = userChoice === q.correctOptionId;
            const isUnattempted = !userChoice;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isUnattempted
                    ? 'border-stone-200 bg-stone-50/30'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isUnattempted
                        ? 'bg-stone-300 text-stone-700'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {isCorrect ? '✓' : isUnattempted ? '-' : '✕'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-stone-900">Q{idx + 1}. {q.skillDomain}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 font-semibold">
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {q.section}
                        </span>
                      </div>
                      <p className="text-xs text-stone-800 font-medium line-clamp-2">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-3 text-xs">
                    {q.codeSnippet && (
                      <div className="p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isCorrectOpt = opt.id === q.correctOptionId;
                        const isUserSelected = opt.id === userChoice;

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                              isCorrectOpt
                                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                : isUserSelected
                                ? 'bg-rose-100/70 border-rose-300 text-rose-950 font-semibold'
                                : 'bg-white border-stone-200 text-stone-700'
                            }`}
                          >
                            <span className="uppercase font-mono text-[10px] w-4">{opt.id}.</span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 space-y-1">
                      <span className="font-bold text-stone-900 block">Explanation:</span>
                      <p className="text-[11px] leading-relaxed">{q.explanation}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-500">
                        Topic: <strong>{q.topicToReview}</strong>
                      </span>

                      <button
                        type="button"
                        id={`ask-doubt-q-${q.id}`}
                        onClick={() => handleAskDoubtOnQuestion(q)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-300 text-orange-800 text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-orange-600" />
                        <span>Ask AI Doubt on Q{idx + 1}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Final Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button
          type="button"
          id="retake-exam-btn"
          onClick={onRetakeExam}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-semibold cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4 text-stone-500" />
          <span>Retake Examination (New Questions)</span>
        </button>

        <button
          type="button"
          id="explore-other-careers-btn"
          onClick={onExploreOtherCareers}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
        >
          <span>Explore Other Career Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
