export interface StudentProfile {
  fullName: string;
  email: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Prefer not to say' | 'Other';
  degree: string;
  yearOfStudy: string;
  college: string;
  cgpa: number;
}

export interface SkillRatings {
  programming: number; // 1 to 5
  communication: number; // 1 to 5
  problemSolving: number; // 1 to 5
  mathematics: number; // 1 to 5
  creativity: number; // 1 to 5
  leadership: number; // 1 to 5
  specializedSkills: string[];
}

export interface InterestPreferences {
  domains: string[]; // e.g., 'Coding', 'Data', 'Design', 'Cybersecurity', 'AI & ML', etc.
  workTypes: string[]; // e.g., 'Problem Solving', 'Creative Work', 'Working with Data', etc.
}

export interface CareerPreferences {
  priorities: string[]; // e.g., 'High Salary', 'Career Growth', 'Remote Work', etc.
  workEnvironment: 'Office' | 'Remote' | 'Hybrid' | 'No Preference';
  targetTimeline?: string;
}

export interface CareerStrength {
  skill: string;
  rating: number;
  highlight: string;
}

export interface SkillGap {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  recommendedResource: string;
}

export interface RoadmapMilestone {
  phaseName: string;
  timeframe: string;
  keyObjectives: string[];
  recommendedFreeToolsOrCerts: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  scoreModifier: number; // 1 (Novice) to 5 (Advanced)
  skillTags?: string[];
  feedback?: string;
}

export interface AssessmentQuestion {
  id: string;
  topicId: string;
  questionText: string;
  contextHint?: string;
  category: 'Knowledge & Concepts' | 'Practical Experience' | 'Problem Solving' | 'Work Style & Goals' | 'Tooling & Tech';
  options: QuestionOption[];
}

export interface CuratedBook {
  id: string;
  title: string;
  author: string;
  rating: number; // e.g. 4.8
  pagesOrLength: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  summary: string;
  keyTakeaways: string[];
  badge?: string;
}

export interface LearningResourceItem {
  id: string;
  title: string;
  provider: string; // e.g. 'Harvard CS50 / edX', 'Coursera', 'freeCodeCamp'
  type: 'Interactive Course' | 'Hands-on Lab' | 'Documentation' | 'Video Series' | 'Certification Exam' | 'Specialization';
  pricing: 'Free' | 'Paid' | 'Free Audit / Paid Cert';
  estimatedTime: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsEnrolled?: string;
  description: string;
  directUrl: string;
  tags: string[];
  keySkillsCovered: string[];
}

export interface LearnTrackTopicStep {
  id: string;
  stepNumber: number;
  title: string;
  skillDomain: string;
  whyImportant: string;
  whatToLearn: string[];
  progression: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  practiceTasks: string[];
  portfolioProjects: string[];
  books: CuratedBook[];
  freeResources: LearningResourceItem[];
  paidResources: LearningResourceItem[];
}

export interface LearnTopic {
  id: string;
  title: string;
  iconName: string;
  category: string;
  badgeText: string;
  shortDesc: string;
  popularRole: string;
  avgSalary: string;
  demandGrowth: string;
  colorTheme: string;
  sequenceSteps?: string[]; // e.g. ['Programming', 'Python Core', 'DSA', 'SQL & Databases', 'Web Frameworks']
  detailedTrackSteps?: LearnTrackTopicStep[];
  questions: AssessmentQuestion[];
  books: CuratedBook[];
  freeResources: LearningResourceItem[];
  paidResources: LearningResourceItem[];
}

export interface CareerMatch {
  id: string;
  title: string;
  category: string;
  icon: string;
  matchScore: number;
  matchLevel: 'Exceptional' | 'High' | 'Moderate' | 'Exploratory';
  userSkillLevel?: 'Beginner / Foundation' | 'Intermediate / Practitioner' | 'Advanced / Ready for Industry';
  summary: string;
  whyMatch: string[];
  requiredSkills: string[];
  yourStrengths: CareerStrength[];
  skillsToImprove: SkillGap[];
  careerOpportunities: string[];
  salaryRange: string;
  marketGrowth: string;
  averageStartingSalary: string;
  workEnvironmentFit: string;
  learningRoadmap: RoadmapMilestone[];
  learnTrackSequence?: string[];
  curatedBooks?: CuratedBook[];
  freeResources?: LearningResourceItem[];
  paidResources?: LearningResourceItem[];
  aiPersonalizedAdvice?: string;
  customMilestones?: RoadmapMilestone[];
  interviewFocusAreas?: string[];
  industryOutlook?: string;
  featureContributions: {
    programming: number;
    problemSolving: number;
    maths: number;
    communication: number;
    creativity: number;
    leadership: number;
    academic: number;
    interests: number;
  };
}

export type QuestionCategoryType = 
  | 'mcq'
  | 'programming'
  | 'debugging'
  | 'predict-output'
  | 'logical-reasoning'
  | 'problem-solving'
  | 'input-output'
  | 'technical-aptitude'
  | 'skill-based'
  | 'career-scenario';

export type ExamSectionName = 
  | 'Section A: Aptitude & Logic'
  | 'Section B: Core Technical & Skills'
  | 'Section C: Code Debugging & Output'
  | 'Section D: Advanced Problem Solving';

export interface MCQOption {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
}

export interface MCQQuestion {
  id: string;
  careerId: string;
  topicId: string;
  skillDomain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Difficult';
  questionType: QuestionCategoryType;
  section: ExamSectionName;
  question: string;
  codeSnippet?: string;
  inputOutputData?: { input: string; output: string };
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
  topicToReview: string;
  suggestedResourceUrl?: string;
  timeEstimateSeconds: number; // e.g. 60s for beginner, 120s for debugging, 180s for difficult
  marksPositive: number;
  marksNegative: number;
}

export type QuestionStatusType = 
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked';

export interface ExamConfigOptions {
  questionCount: number; // 20 (default), 30, 40, 50, 75, 100
  markingScheme: 'standard' | 'competitive'; // standard: +1/0, competitive (TANCET/JEE): +4/-1
  enableCamera: boolean;
  selectedSkills: string[];
  calculatedDurationMinutes: number;
}

export interface ExamViolation {
  timestamp: string;
  reason: string;
}

export interface SkillPerformanceBreakdown {
  skill: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  status: 'Mastered' | 'Competent' | 'Needs Improvement';
}

export interface RecommendedStudyTopic {
  title: string;
  reason: string;
  priority: 'High' | 'Medium';
  recommendedAction: string;
  resourceName: string;
  resourceUrl: string;
}

export interface DoubtMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  questionId?: string;
  timestamp: string;
}

export interface ExamResultData {
  examId: string;
  careerTitle: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  markedForReviewCount: number;
  rawMarks: number;
  positiveMarks: number;
  negativePenaltyMarks: number;
  scorePercentage: number;
  percentileEstimate: number;
  isPassed: boolean;
  grade: 'A+ (Exceptional)' | 'A (Strong)' | 'B (Competent)' | 'C (Needs Revision)' | 'F (Retake Required)';
  timeSpentSeconds: number;
  allocatedTimeSeconds: number;
  violationsCount: number;
  isDisqualified: boolean;
  userAnswers: Record<string, string>;
  questionStatuses: Record<string, QuestionStatusType>;
  questions: MCQQuestion[];
  skillBreakdown: SkillPerformanceBreakdown[];
  difficultyBreakdown: {
    beginner: { total: number; correct: number; percentage: number };
    intermediate: { total: number; correct: number; percentage: number };
    difficult: { total: number; correct: number; percentage: number };
  };
  strongTopics: string[];
  weakTopics: string[];
  recommendedTopicsToStudy: RecommendedStudyTopic[];
  updatedCareerFit: number;
  feedbackSummary: string;
  markingScheme: 'standard' | 'competitive';
}

export type AssessmentStep = 
  | 'welcome'             // 1. Home / Landing
  | 'student-details'     // 2. Student Details
  | 'skills-assessment'   // 3. Interactive Skill Assessment (1-5 ratings & selections)
  | 'ai-analysis'         // 4. AI Skill Analysis & Career Matching
  | 'learn-track'         // 5. Personalized Learn Track & Career-based Resources
  | 'exam-instructions'   // 6a. Skill-Based Exam Instructions & Integrity Rules
  | 'skill-exam'          // 6b. Live Exam Interface with Anti-Cheating & Countdown
  | 'exam-result'         // 7. Exam Result, Performance Analysis & Improved Learn Track
  | 'recommendations'     // Comprehensive Career Recommendation Overview
  | 'career-dashboard'    // Student Profile Dashboard
  | 'topic-select'        // Track selection
  | 'formal-questions'    // Interactive Question Pre-assessment
  | 'interests'           // Interests
  | 'career-preference';  // Career Preferences


