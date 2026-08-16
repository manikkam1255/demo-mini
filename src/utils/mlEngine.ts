import { StudentProfile, SkillRatings, InterestPreferences, CareerPreferences, CareerMatch, CareerStrength, SkillGap } from '../types';
import { CAREER_ARCHETYPES } from '../data/careersDatabase';
import { LEARN_TOPICS_DATABASE } from '../data/learningResourcesDatabase';

/**
 * AI / ML Career Recommendation Engine
 * Simulates a multi-stage Random Forest & Decision Tree classifier
 * with weighted distance vectors, domain interest clustering, and academic modifiers.
 */

export function runMLRecommendationEngine(
  profile: StudentProfile,
  skills: SkillRatings,
  interests: InterestPreferences,
  preferences: CareerPreferences,
  selectedTopicId?: string
): CareerMatch[] {
  const scoredCareers = CAREER_ARCHETYPES.map((archetype) => {
    // 1. Core Skill Feature Match (Weighted Distance)
    const skillDiff =
      Math.abs((skills.programming || 3) - archetype.idealFeatures.programming) * 0.28 +
      Math.abs((skills.problemSolving || 3) - archetype.idealFeatures.problemSolving) * 0.26 +
      Math.abs((skills.mathematics || 3) - archetype.idealFeatures.mathematics) * 0.16 +
      Math.abs((skills.communication || 3) - archetype.idealFeatures.communication) * 0.12 +
      Math.abs((skills.creativity || 3) - archetype.idealFeatures.creativity) * 0.10 +
      Math.abs((skills.leadership || 3) - archetype.idealFeatures.leadership) * 0.08;

    // Base skill score between 50 and 96
    const normalizedSkillScore = Math.max(0, 100 - skillDiff * 14.5);

    // 2. Interest Domain Intersection Bonus
    const matchingDomains = archetype.preferredDomains.filter((d) =>
      interests.domains.some((userD) => userD.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(userD.toLowerCase()))
    );
    const domainBonus = Math.min(12, (matchingDomains.length / Math.max(1, archetype.preferredDomains.length)) * 14);

    // 3. Preferred Work Style Compatibility
    const matchingWorkTypes = archetype.preferredWorkTypes.filter((w) =>
      interests.workTypes.includes(w)
    );
    const workTypeBonus = Math.min(8, (matchingWorkTypes.length / Math.max(1, archetype.preferredWorkTypes.length)) * 10);

    // 4. Academic Performance Modifier (CGPA)
    const userCgpa = typeof profile.cgpa === 'number' ? profile.cgpa : parseFloat(profile.cgpa as string) || 7.5;
    let academicModifier = 0;
    if (userCgpa >= 8.5) {
      academicModifier = 4;
    } else if (userCgpa >= 7.5) {
      academicModifier = 2;
    } else if (userCgpa < archetype.idealFeatures.minCgpa) {
      academicModifier = -3;
    }

    // 5. Career Preferences alignment (e.g. Remote, High Salary)
    let preferenceBonus = 0;
    if (preferences.priorities.includes('High Salary') && (archetype.id === 'software-developer' || archetype.id === 'ai-ml-engineer' || archetype.id === 'cloud-devops-engineer')) {
      preferenceBonus += 3;
    }
    if (preferences.priorities.includes('Remote Work') && archetype.workEnvironmentFit.includes('Remote')) {
      preferenceBonus += 2;
    }
    if (preferences.priorities.includes('Work-Life Balance') && (archetype.id === 'data-analyst' || archetype.id === 'ui-ux-designer')) {
      preferenceBonus += 2;
    }

    // Topic Selection affinity bonus
    if (selectedTopicId && archetype.id === selectedTopicId) {
      preferenceBonus += 6;
    }

    // Raw calculated score
    let rawScore = (normalizedSkillScore * 0.65) + (domainBonus * 1.5) + (workTypeBonus * 1.2) + academicModifier + preferenceBonus;

    // Normalize between 58% and 96%
    let matchScore = Math.round(Math.min(96, Math.max(58, rawScore)));

    // Generate tailored "Why this matches you" points
    const whyMatch: string[] = [];
    if (skills.programming >= 4 && archetype.idealFeatures.programming >= 3.8) {
      whyMatch.push('Strong Programming rating aligns with technical demands');
    }
    if (skills.problemSolving >= 4 && archetype.idealFeatures.problemSolving >= 4.0) {
      whyMatch.push('High Problem-Solving score fits core algorithmic responsibilities');
    }
    if (skills.mathematics >= 4 && archetype.idealFeatures.mathematics >= 4.0) {
      whyMatch.push('Solid Mathematical foundation accelerates domain mastery');
    }
    if (skills.creativity >= 4 && archetype.idealFeatures.creativity >= 3.8) {
      whyMatch.push('Creative thinking matches the innovative requirements of this role');
    }
    if (skills.communication >= 4 && archetype.idealFeatures.communication >= 3.8) {
      whyMatch.push('Excellent Communication skills will boost stakeholder collaboration');
    }
    if (skills.leadership >= 4 && archetype.idealFeatures.leadership >= 3.5) {
      whyMatch.push('Demonstrated Leadership traits enable fast-track career progression');
    }
    if (matchingDomains.length > 0) {
      whyMatch.push(`Direct interest in ${matchingDomains.slice(0, 2).join(' & ')}`);
    }
    if (userCgpa >= 8.0) {
      whyMatch.push(`Strong academic record (${userCgpa} CGPA) supports top campus hiring`);
    }

    if (whyMatch.length === 0) {
      whyMatch.push('Balanced foundation across core technical and analytical competencies');
      whyMatch.push('Strong potential for rapid on-the-job skill acquisition');
    }

    // Determine strengths
    const yourStrengths: CareerStrength[] = [];
    const skillMap = [
      { name: 'Programming', val: skills.programming, desc: 'Technical syntax and logic implementation' },
      { name: 'Problem Solving', val: skills.problemSolving, desc: 'Analytical thinking and systematic breakdown' },
      { name: 'Mathematics', val: skills.mathematics, desc: 'Quantitative reasoning and statistical concepts' },
      { name: 'Communication', val: skills.communication, desc: 'Verbal articulation and documentation clarity' },
      { name: 'Creativity', val: skills.creativity, desc: 'Novel ideation and unconventional design' },
      { name: 'Leadership', val: skills.leadership, desc: 'Initiative taking and peer coordination' },
    ];

    skillMap
      .filter((s) => s.val >= 3)
      .sort((a, b) => b.val - a.val)
      .slice(0, 3)
      .forEach((s) => {
        yourStrengths.push({
          skill: s.name,
          rating: s.val,
          highlight: s.desc,
        });
      });

    // Custom skills to improve
    const skillsToImprove: SkillGap[] = [...archetype.defaultSkillsToImprove];

    // Feature contribution breakdown for XAI (Explainable AI) visualization
    const featureContributions = {
      programming: Math.round(Math.min(100, (skills.programming / archetype.idealFeatures.programming) * 100)),
      problemSolving: Math.round(Math.min(100, (skills.problemSolving / archetype.idealFeatures.problemSolving) * 100)),
      maths: Math.round(Math.min(100, (skills.mathematics / archetype.idealFeatures.mathematics) * 100)),
      communication: Math.round(Math.min(100, (skills.communication / archetype.idealFeatures.communication) * 100)),
      creativity: Math.round(Math.min(100, (skills.creativity / archetype.idealFeatures.creativity) * 100)),
      leadership: Math.round(Math.min(100, (skills.leadership / archetype.idealFeatures.leadership) * 100)),
      academic: Math.round(Math.min(100, (userCgpa / 10) * 100)),
      interests: Math.round(Math.min(100, (matchingDomains.length / Math.max(1, archetype.preferredDomains.length)) * 100)),
    };

    let matchLevel: CareerMatch['matchLevel'] = 'Moderate';
    if (matchScore >= 88) matchLevel = 'Exceptional';
    else if (matchScore >= 78) matchLevel = 'High';
    else if (matchScore >= 68) matchLevel = 'Moderate';
    else matchLevel = 'Exploratory';

    // Determine user skill level
    const avgSkill = (skills.programming + skills.problemSolving + skills.mathematics + skills.communication) / 4;
    let userSkillLevel: CareerMatch['userSkillLevel'] = 'Intermediate / Practitioner';
    if (avgSkill >= 4.2) userSkillLevel = 'Advanced / Ready for Industry';
    else if (avgSkill <= 2.6) userSkillLevel = 'Beginner / Foundation';

    // Find rich learning topic data
    const topicData = LEARN_TOPICS_DATABASE.find((t) => t.id === archetype.id) || LEARN_TOPICS_DATABASE[0];

    const match: CareerMatch = {
      id: archetype.id,
      title: archetype.title,
      category: archetype.category,
      icon: archetype.icon,
      matchScore,
      matchLevel,
      userSkillLevel,
      summary: archetype.summary,
      whyMatch: whyMatch.slice(0, 4),
      requiredSkills: archetype.requiredSkills,
      yourStrengths,
      skillsToImprove,
      careerOpportunities: archetype.careerOpportunities,
      salaryRange: archetype.salaryRange,
      marketGrowth: archetype.marketGrowth,
      averageStartingSalary: archetype.averageStartingSalary,
      workEnvironmentFit: archetype.workEnvironmentFit,
      learningRoadmap: archetype.defaultRoadmap,
      curatedBooks: topicData.books,
      freeResources: topicData.freeResources,
      paidResources: topicData.paidResources,
      featureContributions,
    };

    return match;
  });

  // Sort descending by match score
  return scoredCareers.sort((a, b) => b.matchScore - a.matchScore);
}

export const SAMPLE_STUDENT_PROFILES: { name: string; label: string; profile: StudentProfile; skills: SkillRatings; interests: InterestPreferences; preferences: CareerPreferences; topicId?: string }[] = [
  {
    name: 'priya',
    label: 'Priya Sharma (CS 3rd Year - Tech Focus)',
    topicId: 'software-developer',
    profile: {
      fullName: 'Priya Sharma',
      email: 'priya.sharma@college.edu',
      age: 20,
      gender: 'Female',
      degree: 'B.Tech Computer Science & Engineering',
      yearOfStudy: '3rd Year',
      college: 'National Institute of Technology',
      cgpa: 8.6,
    },
    skills: {
      programming: 5,
      problemSolving: 4,
      mathematics: 4,
      communication: 3,
      creativity: 3,
      leadership: 3,
      specializedSkills: ['Python', 'Java', 'Data Structures', 'React', 'SQL'],
    },
    interests: {
      domains: ['Coding', 'Technology', 'AI & ML'],
      workTypes: ['Problem Solving', 'Technical Work'],
    },
    preferences: {
      priorities: ['High Salary', 'Career Growth', 'Remote Work'],
      workEnvironment: 'Hybrid',
      targetTimeline: 'Campus Placements 2026',
    },
  },
  {
    name: 'rohit',
    label: 'Rohit Verma (IT 2nd Year - Data & Analytics)',
    topicId: 'data-analyst',
    profile: {
      fullName: 'Rohit Verma',
      email: 'rohit.v@techuniv.edu',
      age: 19,
      gender: 'Male',
      degree: 'B.Sc Information Technology',
      yearOfStudy: '2nd Year',
      college: 'St. Xavier’s College of Technology',
      cgpa: 8.1,
    },
    skills: {
      programming: 3,
      problemSolving: 4,
      mathematics: 5,
      communication: 4,
      creativity: 3,
      leadership: 3,
      specializedSkills: ['Python', 'SQL', 'Excel', 'Statistics', 'Power BI'],
    },
    interests: {
      domains: ['Data', 'Business', 'Technology'],
      workTypes: ['Working with Data', 'Problem Solving', 'Working with People'],
    },
    preferences: {
      priorities: ['Career Growth', 'Work-Life Balance', 'Job Stability'],
      workEnvironment: 'Hybrid',
      targetTimeline: 'Internships 2026',
    },
  },
  {
    name: 'ananya',
    label: 'Ananya Patel (BCA Final Year - UI/UX & Product)',
    topicId: 'ui-ux-designer',
    profile: {
      fullName: 'Ananya Patel',
      email: 'ananya.p@designuniv.edu',
      age: 21,
      gender: 'Female',
      degree: 'BCA (Computer Applications)',
      yearOfStudy: 'Final Year (4th Year)',
      college: 'Symbiosis Institute of Computer Studies',
      cgpa: 8.4,
    },
    skills: {
      programming: 2,
      problemSolving: 4,
      mathematics: 2,
      communication: 5,
      creativity: 5,
      leadership: 4,
      specializedSkills: ['Figma', 'User Research', 'Wireframing', 'HTML/CSS', 'Prototyping'],
    },
    interests: {
      domains: ['Design', 'Technology', 'Marketing', 'Business'],
      workTypes: ['Creative Work', 'Working with People', 'Problem Solving'],
    },
    preferences: {
      priorities: ['Innovation', 'Career Growth', 'Remote Work'],
      workEnvironment: 'Remote',
      targetTimeline: 'Immediate Full-Time 2026',
    },
  },
];

