import React, { useState } from 'react';
import { StudentProfile, SkillRatings, CareerMatch, InterestPreferences, CareerPreferences } from '../types';
import { X, Printer, Download, Sparkles, CheckCircle2, Award, BookOpen, ExternalLink, Loader2, FileText } from 'lucide-react';
import { triggerRealtimePrint, downloadReportHtml, generateReportHtml } from '../utils/printReport';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  skills: SkillRatings;
  interests: InterestPreferences;
  preferences: CareerPreferences;
  recommendations: CareerMatch[];
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  skills,
  interests,
  preferences,
  recommendations,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const topCareer = recommendations[0] || null;

  const handlePrint = async () => {
    setIsPrinting(true);
    setFeedbackStatus('Opening Real-time Print...');

    try {
      await triggerRealtimePrint({
        profile,
        skills,
        interests,
        preferences,
        recommendations,
      });
      setFeedbackStatus('Print Dialog Ready');
    } catch (err) {
      console.error('Print trigger error:', err);
      window.print();
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
        setFeedbackStatus(null);
      }, 1500);
    }
  };

  const handleDownloadReport = () => {
    downloadReportHtml({
      profile,
      skills,
      interests,
      preferences,
      recommendations,
    });
    setFeedbackStatus('Downloaded Report File');
    setTimeout(() => setFeedbackStatus(null), 2000);
  };

  const handleOpenInNewTab = () => {
    const html = generateReportHtml({
      profile,
      skills,
      interests,
      preferences,
      recommendations,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 printable-modal-overlay">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] printable-modal-box">
        
        {/* Modal Controls Top Bar (Hidden during printing) */}
        <div className="p-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AI Career Recommendation Diagnostic Report</span>
            {feedbackStatus && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] border border-orange-500/30">
                {feedbackStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Realtime Print Button */}
            <button
              type="button"
              id="print-action-btn"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 active:bg-orange-800 disabled:opacity-75 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title="Print directly or save as PDF"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              <span>{isPrinting ? 'Opening Print...' : 'Print / Save as PDF'}</span>
            </button>

            {/* Direct Download HTML / PDF File Button */}
            <button
              type="button"
              id="direct-download-btn"
              onClick={handleDownloadReport}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-stone-700"
              title="Download standalone printable report file"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Open in New Window Button (for strict iframes) */}
            <button
              type="button"
              id="open-tab-btn"
              onClick={handleOpenInNewTab}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition-colors border border-stone-700"
              title="Open full-page report in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              id="close-report-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div 
          id="printable-report-document" 
          className="p-8 sm:p-10 overflow-y-auto space-y-8 bg-white text-stone-900 text-sm printable-document-body"
        >
          
          {/* Header Banner */}
          <div className="pb-6 border-b-2 border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-1">
                Official AI Career Assessment Summary
              </div>
              <h1 className="text-3xl font-black text-stone-950 tracking-tight">
                Career Recommendation Report
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Generated by PathFinder AI ML Ensemble Classifier • Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Assessment Status</span>
              <span className="text-xs font-bold text-emerald-600">✓ Verified Complete</span>
            </div>
          </div>

          {/* Section 1: Student Metadata Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs printable-card">
            <div>
              <span className="text-stone-400 block font-medium">Student Name:</span>
              <span className="font-bold text-stone-900 text-sm">{profile.fullName || 'Student'}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Degree / Course:</span>
              <span className="font-bold text-stone-900 text-sm">{profile.degree || 'Undergraduate'}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Academic Year:</span>
              <span className="font-bold text-stone-900 text-sm">{profile.yearOfStudy || '3rd Year'}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Performance / CGPA:</span>
              <span className="font-bold text-orange-600 text-sm">{profile.cgpa} / 10.0</span>
            </div>
          </div>

          {/* Section 2: Skills Matrix Overview */}
          <div className="printable-card">
            <h2 className="text-base font-bold text-stone-900 uppercase tracking-wider mb-3">
              1. Assessed Core Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Programming & Logic', score: skills.programming },
                { name: 'Problem Solving', score: skills.problemSolving },
                { name: 'Mathematics & Stats', score: skills.mathematics },
                { name: 'Communication', score: skills.communication },
                { name: 'Creativity & Design', score: skills.creativity },
                { name: 'Leadership & Teamwork', score: skills.leadership },
              ].map((s) => (
                <div key={s.name} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="font-medium text-stone-700">{s.name}</span>
                  <span className="font-bold text-orange-600">{s.score} / 5</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: #1 Top Matched Career Detailed Breakdown */}
          {topCareer && (
            <div className="p-6 rounded-2xl bg-orange-50/50 border-2 border-orange-300 space-y-4 printable-card page-break-avoid">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-200 px-2.5 py-0.5 rounded-full">
                    Top Career Recommendation
                  </span>
                  <h3 className="text-2xl font-black text-stone-950 mt-1">{topCareer.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-orange-600">{topCareer.matchScore}%</span>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Match Score</span>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">{topCareer.summary}</p>

              <div>
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Matching Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {topCareer.whyMatch.map((w, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-stone-800 bg-white p-2 rounded-lg border border-orange-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills & Opportunities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-orange-200 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block mb-1">Required Skills Benchmark:</span>
                  <div className="flex flex-wrap gap-1">
                    {topCareer.requiredSkills.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-stone-800 rounded border border-stone-200 text-[11px]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-stone-900 block mb-1">Career Opportunities:</span>
                  <div className="flex flex-wrap gap-1">
                    {topCareer.careerOpportunities.map((o, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-stone-800 rounded border border-stone-200 text-[11px]">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Ranked Alternative Recommendations */}
          <div className="printable-card page-break-avoid">
            <h2 className="text-base font-bold text-stone-900 uppercase tracking-wider mb-3">
              2. Alternative Ranked Career Matches
            </h2>
            <div className="space-y-2 text-xs">
              {recommendations.slice(1, 4).map((c, idx) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-stone-200 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-bold text-stone-900">#{idx + 2} {c.title}</span>
                    <span className="text-stone-500 text-[11px] block">{c.category} • {c.averageStartingSalary}</span>
                  </div>
                  <span className="font-black text-orange-600 text-sm">{c.matchScore}% Match</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Footer */}
          <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-400">
            <p>PathFinder AI Career Recommendation System • Designed for Student Career Clarity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

