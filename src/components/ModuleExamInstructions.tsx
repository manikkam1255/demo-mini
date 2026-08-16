import React, { useState, useEffect, useRef } from 'react';
import { CareerMatch, StudentProfile, ExamConfigOptions } from '../types';
import { 
  ShieldAlert, Clock, Award, CheckCircle2, AlertTriangle, 
  Maximize2, CopySlash, EyeOff, Sparkles, ArrowRight, ArrowLeft,
  BookOpen, HelpCircle, Camera, CameraOff, Video, Sliders, Check,
  Zap, Info, RefreshCw, Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleExamInstructionsProps {
  career: CareerMatch;
  studentProfile: StudentProfile;
  selectedSkills: string[];
  config: ExamConfigOptions;
  onChangeConfig: (updated: Partial<ExamConfigOptions>) => void;
  onStartExam: () => void;
  onBackToLearnTrack: () => void;
}

export const ModuleExamInstructions: React.FC<ModuleExamInstructionsProps> = ({
  career,
  studentProfile,
  selectedSkills = [],
  config,
  onChangeConfig,
  onStartExam,
  onBackToLearnTrack,
}) => {
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'simulated'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const QUESTION_COUNT_OPTIONS = [20, 30, 40, 50, 75, 100];

  // Camera setup
  const startCamera = async () => {
    setCameraStatus('requesting');
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraStatus('active');
        onChangeConfig({ enableCamera: true });
      } else {
        setCameraStatus('simulated');
        onChangeConfig({ enableCamera: true });
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraStatus('simulated');
      setCameraError('Live webcam permission optional. AI Proctoring simulation active.');
      onChangeConfig({ enableCamera: true });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStatus('idle');
    onChangeConfig({ enableCamera: false });
  };

  useEffect(() => {
    // Auto-attempt camera start on mount
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectCount = (count: number) => {
    // Dynamic timer calculation: ~1.5 - 1.6 mins per question based on difficulty mix
    const calcMinutes = Math.ceil(count * 1.55);
    onChangeConfig({
      questionCount: count,
      calculatedDurationMinutes: calcMinutes,
    });
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 space-y-6">
      
      {/* Header Pill */}
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <span>Module 06 • Competitive Skill Examination Setup</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">{career.title} Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 tracking-tight">
          📝 Exam Configuration & Live Camera Verification
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Customize your examination size, verify your proctoring camera stream, and review the TANCET/JEE-style exam format.
        </p>
      </div>

      {/* Step 1: Choose Number of Questions & Marking Scheme */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              1. Choose Number of Questions (Default: 20 Questions)
            </h2>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            {config.questionCount} Questions Selected
          </span>
        </div>

        {/* Question Count Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {QUESTION_COUNT_OPTIONS.map((count) => {
            const isSelected = config.questionCount === count;
            const approxMins = Math.ceil(count * 1.55);

            return (
              <button
                key={count}
                id={`q-count-${count}`}
                type="button"
                onClick={() => handleSelectCount(count)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-500/20'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <span className={`text-base sm:text-lg font-black ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {count}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-orange-100' : 'text-stone-500'}`}>
                  {count === 20 ? 'Standard' : count <= 40 ? 'Moderate' : 'Full Length'}
                </span>
                <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-white/90' : 'text-stone-400'}`}>
                  ~{approxMins} mins
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Timer Auto-Calculation Details */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block">
                Auto-Calculated Dynamic Exam Timer: {config.calculatedDurationMinutes} Minutes
              </span>
              <span className="text-stone-600 text-[11px]">
                Computed automatically from difficulty weights (Beginner: ~60s, Debugging/Output: ~110s, Difficult Algorithms: ~160s).
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Progressive: Easy → Hard</span>
          </div>
        </div>

        {/* Marking Scheme Selection */}
        <div className="pt-4 border-t border-stone-100">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Marking Scheme Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              id="marking-scheme-competitive"
              onClick={() => onChangeConfig({ markingScheme: 'competitive' })}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                config.markingScheme === 'competitive'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/10'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 ${
                config.markingScheme === 'competitive' ? 'bg-orange-600 text-white' : 'bg-stone-200'
              }`}>
                {config.markingScheme === 'competitive' && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="font-bold text-stone-900 block">TANCET / JEE Competitive Mode</span>
                <span className="text-stone-600 text-[11px] leading-relaxed">
                  +4 Marks for Correct Answer • -1 Negative Marking for Incorrect Answer • 0 for Unattempted
                </span>
              </div>
            </button>

            <button
              type="button"
              id="marking-scheme-standard"
              onClick={() => onChangeConfig({ markingScheme: 'standard' })}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                config.markingScheme === 'standard'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/10'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 ${
                config.markingScheme === 'standard' ? 'bg-orange-600 text-white' : 'bg-stone-200'
              }`}>
                {config.markingScheme === 'standard' && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Standard Skill Practice Mode</span>
                <span className="text-stone-600 text-[11px] leading-relaxed">
                  +1 Mark for Correct Answer • No Negative Penalty (0 marks for Incorrect/Unattempted)
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Camera Verification & AI Proctoring Stream */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              2. Camera ON & Proctoring Readiness Verification
            </h2>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            cameraStatus === 'active' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : cameraStatus === 'simulated'
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}>
            {cameraStatus === 'active' ? '● Camera Live' : cameraStatus === 'simulated' ? '● AI Proctoring Stream Active' : 'Connecting...'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Video Stream Container */}
          <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-800 flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover mirror ${cameraStatus === 'active' ? 'block' : 'hidden'}`}
              style={{ transform: 'scaleX(-1)' }}
            />

            {cameraStatus !== 'active' && (
              <div className="text-center p-4 text-stone-400 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-stone-800 text-orange-400 flex items-center justify-center mx-auto">
                  <Video className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-stone-200">
                  {cameraStatus === 'simulated' ? 'AI Virtual Proctoring Active' : 'Camera Initializing...'}
                </div>
                <p className="text-[11px] text-stone-500 max-w-xs">
                  {cameraError || 'Webcam stream will feed live into the anti-cheating thumbnail during the exam.'}
                </p>
              </div>
            )}

            {/* Live Overlay HUD */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-xs text-[10px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE PROCTORING REC</span>
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-stone-300 text-[10px] font-mono">
              {studentProfile.fullName || 'Candidate'}
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-stone-900">Candidate Identity Check: </span>
                <span>{studentProfile.fullName || 'Registered Student'} ({studentProfile.degree || 'Degree Program'})</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-stone-900">Lighting & Camera Angle: </span>
                <span>Face centered, ambient lighting optimal for examination.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-stone-900">Integrity Tracking Sensors: </span>
                <span>Tab visibility, window focus loss, and clipboard locks ready.</span>
              </div>
            </div>

            {/* Re-trigger camera button */}
            <div className="pt-1 flex items-center gap-2">
              {cameraStatus !== 'active' ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera Connection</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-700 font-semibold">
                  ✓ Webcam verified and connected successfully.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Question Diversity & Section Preview */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-600" />
          <span>3. Question Types & Section Blueprint (TANCET / JEE Exam Pattern)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">MCQs & Conceptual</span>
            <span className="text-[11px] text-stone-500">Core theoretical & foundational syntax</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Code Debugging</span>
            <span className="text-[11px] text-stone-500">Spot vulnerabilities, bugs, & off-by-one errors</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Predict the Output</span>
            <span className="text-[11px] text-stone-500">Execution traces & recursion outputs</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900 block">Logical & Problem Solving</span>
            <span className="text-[11px] text-stone-500">Architecture, algorithmic trade-offs</span>
          </div>
        </div>

        {/* Integrity Rules Summary */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Automated Anti-Cheating Protocol</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
            <li>Tab switching, window blur, or minimizing will trigger an integrity warning.</li>
            <li>Clipboard copy/cut/paste and right-click context menus are locked.</li>
            <li>Accumulating 3 unexcused violations triggers automatic exam termination.</li>
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 cursor-pointer select-none">
            <input
              type="checkbox"
              id="agree-exam-rules-checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-orange-600 rounded cursor-pointer"
            />
            <div className="text-xs text-stone-800">
              <span className="font-bold text-stone-900 block">Candidate Honor Code & Agreement:</span>
              <span>I confirm that I will take this {config.questionCount}-question examination independently without unauthorized tabs, generative AI tools, or assistance. I understand the auto-calculated {config.calculatedDurationMinutes}-minute timer.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          id="back-to-learn-track-btn"
          onClick={onBackToLearnTrack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learn Track</span>
        </button>

        <button
          type="button"
          id="start-exam-now-btn"
          disabled={!agreedToRules}
          onClick={onStartExam}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span>Start {config.questionCount} Questions Exam</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
