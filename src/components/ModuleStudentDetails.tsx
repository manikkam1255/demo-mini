import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User, GraduationCap, ArrowRight, ArrowLeft, Building, Mail, Hash, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleStudentDetailsProps {
  initialProfile: StudentProfile;
  onSaveAndNext: (profile: StudentProfile) => void;
  onBack: () => void;
}

const COMMON_DEGREES = [
  'B.Sc Computer Science',
  'B.Tech / B.E. Computer Science & Engineering',
  'B.Tech / B.E. Information Technology',
  'BCA (Bachelor of Computer Applications)',
  'B.Tech Artificial Intelligence & Data Science',
  'B.E. Electronics & Communication (ECE)',
  'B.Sc Data Science / Statistics',
  'B.Com / BBA (Business & Management)',
  'MCA / M.Tech Computer Science',
  'Other / Interdisciplinary Degree',
];

const YEARS_OF_STUDY = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  'Final Year (4th Year / Senior)',
  'Postgraduate / Masters (1st/2nd Year)',
];

export const ModuleStudentDetails: React.FC<ModuleStudentDetailsProps> = ({
  initialProfile,
  onSaveAndNext,
  onBack,
}) => {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!profile.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!profile.email.trim() || !profile.email.includes('@')) newErrors.email = 'Please enter a valid email address';
    if (!profile.age || Number(profile.age) < 15 || Number(profile.age) > 60) newErrors.age = 'Please enter a valid age (15-60)';
    if (!profile.degree) newErrors.degree = 'Please select or enter your degree';
    if (!profile.college.trim()) newErrors.college = 'Please enter your college/institution';
    if (profile.cgpa < 0 || profile.cgpa > 10) newErrors.cgpa = 'CGPA must be between 0.0 and 10.0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveAndNext(profile);
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto px-4">
      {/* Module Title & Step Tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <span>Module 02 of 08</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">Personal & Academic Foundation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
          👤 Student Details
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Tell us about yourself and your academic standing. This sets baseline parameters for your AI career matching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs"
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
              <p className="text-xs text-stone-500">Your basic identity and profile details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="student-fullname-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="student-fullname-input"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                    errors.fullName ? 'border-rose-300 bg-rose-50/30' : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="student-email-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="student-email-input"
                  type="email"
                  placeholder="priya@college.edu"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                    errors.email ? 'border-rose-300 bg-rose-50/30' : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="student-age-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-age-input"
                type="number"
                min={15}
                max={60}
                placeholder="20"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value ? Number(e.target.value) : '' })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                  errors.age ? 'border-rose-300 bg-rose-50/30' : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              />
              {errors.age && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.age}</p>}
            </div>

            {/* Gender Selection */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Male', 'Female', 'Prefer not to say', 'Other'] as const).map((genderOption) => (
                  <button
                    key={genderOption}
                    type="button"
                    id={`gender-opt-${genderOption.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setProfile({ ...profile, gender: genderOption })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                      profile.gender === genderOption
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {profile.gender === genderOption && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    <span>{genderOption}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Academic Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs"
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Academic Information</h3>
              <p className="text-xs text-stone-500">Degree, institution, and performance metric</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Degree / Course Selection */}
            <div>
              <label htmlFor="student-degree-select" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Degree / Course <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-degree-select"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {COMMON_DEGREES.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
              {errors.degree && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.degree}</p>}
            </div>

            {/* Year of Study */}
            <div>
              <label htmlFor="student-year-select" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                id="student-year-select"
                value={profile.yearOfStudy}
                onChange={(e) => setProfile({ ...profile, yearOfStudy: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {YEARS_OF_STUDY.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* College / Institution */}
            <div className="sm:col-span-2">
              <label htmlFor="student-college-input" className="block text-xs font-semibold text-stone-700 mb-1.5">
                College / Institution <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-college-input"
                type="text"
                placeholder="e.g. National Institute of Technology / St. Xavier's"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                  errors.college ? 'border-rose-300 bg-rose-50/30' : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              />
              {errors.college && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.college}</p>}
            </div>

            {/* Academic Performance: CGPA Slider & Input */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-orange-50/40 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label htmlFor="student-cgpa-slider" className="text-xs font-bold text-stone-800">
                    Academic Performance (CGPA out of 10.0)
                  </label>
                  <p className="text-[11px] text-stone-500">Or equivalent percentage (e.g. 8.5 CGPA ≈ 85%)</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-orange-200 shadow-2xs">
                  <span className="text-lg font-black text-orange-600">{Number(profile.cgpa).toFixed(1)}</span>
                  <span className="text-xs text-stone-400 font-semibold">/ 10</span>
                </div>
              </div>

              <input
                id="student-cgpa-slider"
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={profile.cgpa}
                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />

              <div className="flex justify-between text-[11px] font-medium text-stone-500 mt-1.5">
                <span>4.0 (Passing)</span>
                <span>6.5 (First Class)</span>
                <span>8.0 (Distinction)</span>
                <span>10.0 (Perfect)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            id="details-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            id="details-continue-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Continue to Skills Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
