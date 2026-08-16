import { StudentProfile, SkillRatings, CareerMatch, InterestPreferences, CareerPreferences } from '../types';

export interface GenerateReportData {
  profile: StudentProfile;
  skills: SkillRatings;
  interests: InterestPreferences;
  preferences: CareerPreferences;
  recommendations: CareerMatch[];
}

export interface GenerateExamScoreData {
  profile: StudentProfile;
  career: CareerMatch;
  result: import('../types').ExamResultData;
}

/**
 * Builds clean, standalone, high-fidelity printable HTML for the career diagnostic report.
 */
export function generateReportHtml(data: GenerateReportData): string {
  const { profile, skills, recommendations } = data;
  const topCareer = recommendations[0] || null;
  const alternatives = recommendations.slice(1, 5);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const skillItems = [
    { name: 'Programming & Logic', score: skills.programming },
    { name: 'Problem Solving', score: skills.problemSolving },
    { name: 'Mathematics & Stats', score: skills.mathematics },
    { name: 'Communication', score: skills.communication },
    { name: 'Creativity & Design', score: skills.creativity },
    { name: 'Leadership & Teamwork', score: skills.leadership },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career Recommendation Diagnostic Report - ${profile.fullName || 'Student'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 15mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background-color: #f5f5f4;
      line-height: 1.5;
      font-size: 12px;
      padding: 20px;
    }

    /* Screen-only top action toolbar */
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      background: #1c1917;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .no-print-bar .title {
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .no-print-bar .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-print {
      background: #ea580c;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }

    .btn-print:hover {
      background: #c2410c;
    }

    .btn-close {
      background: #292524;
      color: #d6d3d1;
      border: 1px solid #44403c;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
    }

    .btn-close:hover {
      background: #44403c;
      color: #ffffff;
    }

    .tip-text {
      font-size: 11px;
      color: #a8a29e;
      width: 100%;
    }

    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      border: 1px solid #e7e5e4;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .header-bar {
      border-bottom: 2px solid #1c1917;
      padding-bottom: 14px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .badge-top {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c2410c;
      margin-bottom: 4px;
    }

    .title-main {
      font-size: 24px;
      font-weight: 800;
      color: #0c0a09;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 11px;
      color: #78716c;
      margin-top: 4px;
    }

    .status-badge {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 6px 12px;
      border-radius: 8px;
      text-align: right;
    }

    .status-badge .sub {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #16a34a;
      display: block;
    }

    .status-badge .val {
      font-size: 11px;
      font-weight: 800;
    }

    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #1c1917;
      margin-bottom: 10px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 18px;
    }

    .profile-item .label {
      font-size: 10px;
      font-weight: 600;
      color: #78716c;
      display: block;
      margin-bottom: 2px;
    }

    .profile-item .val {
      font-size: 13px;
      font-weight: 800;
      color: #1c1917;
    }

    .profile-item .val-cgpa {
      color: #ea580c;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }

    .skill-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .skill-name {
      font-weight: 600;
      color: #44403c;
      font-size: 11px;
    }

    .skill-score {
      font-weight: 800;
      color: #ea580c;
      font-size: 12px;
    }

    .hero-card {
      background: #fff7ed;
      border: 2px solid #fdba74;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .hero-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .hero-tag {
      background: #fed7aa;
      color: #9a3412;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 20px;
      display: inline-block;
    }

    .hero-title {
      font-size: 20px;
      font-weight: 900;
      color: #0c0a09;
      margin-top: 4px;
    }

    .hero-score-box {
      text-align: right;
    }

    .hero-score-num {
      font-size: 22px;
      font-weight: 900;
      color: #ea580c;
      line-height: 1;
    }

    .hero-score-lbl {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #78716c;
    }

    .hero-summary {
      font-size: 11px;
      color: #44403c;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .reasons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 12px;
    }

    .reason-item {
      background: #ffffff;
      border: 1px solid #fed7aa;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 10.5px;
      color: #292524;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .check-icon {
      color: #ea580c;
      font-weight: 800;
    }

    .hero-benchmarks {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      border-top: 1px solid #fed7aa;
      padding-top: 10px;
    }

    .bench-title {
      font-weight: 700;
      font-size: 10.5px;
      color: #1c1917;
      margin-bottom: 4px;
    }

    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .pill {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      color: #292524;
      font-size: 9.5px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    .alternatives-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .alt-item {
      border: 1px solid #e7e5e4;
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
    }

    .alt-title {
      font-weight: 700;
      font-size: 11.5px;
      color: #1c1917;
    }

    .alt-meta {
      font-size: 10px;
      color: #78716c;
    }

    .alt-score {
      font-weight: 800;
      color: #ea580c;
      font-size: 12px;
    }

    .footer {
      border-top: 1px solid #e7e5e4;
      padding-top: 12px;
      text-align: center;
      font-size: 10px;
      color: #a8a29e;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .report-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Top Control Bar -->
  <div class="no-print-bar">
    <div class="title">
      <span>📄</span>
      <span>Diagnostic Career Recommendation Report</span>
    </div>
    <div class="actions">
      <button class="btn-print" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
      <button class="btn-close" onclick="window.close()">
        <span>Close Tab</span>
      </button>
    </div>
    <div class="tip-text">
      💡 Tip: In the destination dropdown of the print window, choose <strong>"Save as PDF"</strong> to save this document directly.
    </div>
  </div>

  <div class="report-container">
    <!-- Header Banner -->
    <div class="header-bar">
      <div>
        <div class="badge-top">Official AI Career Assessment Summary</div>
        <h1 class="title-main">Career Recommendation Diagnostic Report</h1>
        <p class="subtitle">Generated by PathFinder AI ML Ensemble Classifier • Date: ${currentDate}</p>
      </div>
      <div class="status-badge">
        <span class="sub">Assessment Status</span>
        <span class="val">✓ Verified Complete</span>
      </div>
    </div>

    <!-- Student Metadata -->
    <div class="profile-grid">
      <div class="profile-item">
        <span class="label">Student Name:</span>
        <span class="val">${profile.fullName || 'Student'}</span>
      </div>
      <div class="profile-item">
        <span class="label">Degree / Course:</span>
        <span class="val">${profile.degree || 'Undergraduate'}</span>
      </div>
      <div class="profile-item">
        <span class="label">Academic Year:</span>
        <span class="val">${profile.yearOfStudy || '3rd Year'}</span>
      </div>
      <div class="profile-item">
        <span class="label">Performance / CGPA:</span>
        <span class="val val-cgpa">${profile.cgpa || '8.5'} / 10.0</span>
      </div>
    </div>

    <!-- Section 1: Assessed Skills -->
    <div class="section-title">1. Assessed Core Competencies</div>
    <div class="skills-grid">
      ${skillItems
        .map(
          (s) => `
        <div class="skill-card">
          <span class="skill-name">${s.name}</span>
          <span class="skill-score">${s.score} / 5</span>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- Section 2: Top Matched Career -->
    ${
      topCareer
        ? `
      <div class="hero-card">
        <div class="hero-header">
          <div>
            <span class="hero-tag">Top Career Recommendation</span>
            <h2 class="hero-title">${topCareer.title}</h2>
          </div>
          <div class="hero-score-box">
            <div class="hero-score-num">${topCareer.matchScore}%</div>
            <div class="hero-score-lbl">Match Score</div>
          </div>
        </div>

        <p class="hero-summary">${topCareer.summary}</p>

        <div style="font-weight: 700; font-size: 10.5px; text-transform: uppercase; color: #44403c; margin-bottom: 6px;">
          Key Matching Factors:
        </div>
        <div class="reasons-grid">
          ${topCareer.whyMatch
            .map(
              (reason) => `
            <div class="reason-item">
              <span class="check-icon">✓</span>
              <span>${reason}</span>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="hero-benchmarks">
          <div>
            <div class="bench-title">Required Skills Benchmark:</div>
            <div class="pill-list">
              ${topCareer.requiredSkills
                .map((skill) => `<span class="pill">${skill}</span>`)
                .join('')}
            </div>
          </div>
          <div>
            <div class="bench-title">Career Opportunities:</div>
            <div class="pill-list">
              ${topCareer.careerOpportunities
                .map((opp) => `<span class="pill">${opp}</span>`)
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `
        : ''
    }

    <!-- Section 3: Alternative Career Matches -->
    ${
      alternatives.length > 0
        ? `
      <div class="section-title">2. Alternative Ranked Career Matches</div>
      <div class="alternatives-list">
        ${alternatives
          .map(
            (alt, idx) => `
          <div class="alt-item">
            <div>
              <div class="alt-title">#${idx + 2} ${alt.title}</div>
              <div class="alt-meta">${alt.category} • ${alt.averageStartingSalary}</div>
            </div>
            <div class="alt-score">${alt.matchScore}% Match</div>
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }

    <!-- Footer -->
    <div class="footer">
      PathFinder AI Career Recommendation System • Designed for Student Career Clarity • Powered by Machine Learning
    </div>
  </div>

  <script>
    // Automatically trigger system print dialog smoothly once rendered
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {
          console.error('Auto-print error:', e);
        }
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Builds printable HTML for the competitive exam score card.
 */
export function generateExamScoreHtml(data: GenerateExamScoreData): string {
  const { profile, career, result } = data;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assessment Score Card - ${profile.fullName || 'Candidate'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 12mm 12mm 15mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #1c1917;
      background-color: #f5f5f4;
      line-height: 1.5;
      font-size: 12px;
      padding: 20px;
    }

    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      background: #1c1917;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .no-print-bar .title {
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-print {
      background: #ea580c;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-print:hover {
      background: #c2410c;
    }

    .btn-close {
      background: #292524;
      color: #d6d3d1;
      border: 1px solid #44403c;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
    }

    .tip-text {
      font-size: 11px;
      color: #a8a29e;
      width: 100%;
    }

    .card-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      border: 1px solid #e7e5e4;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .header-bar {
      border-bottom: 2px solid #1c1917;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .title-main {
      font-size: 22px;
      font-weight: 800;
      color: #0c0a09;
    }

    .badge-eval {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #166534;
      background: #dcfce7;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 16px;
    }

    .meta-grid .lbl {
      font-size: 10px;
      color: #78716c;
      font-weight: 600;
      display: block;
    }

    .meta-grid .val {
      font-size: 12px;
      font-weight: 800;
      color: #1c1917;
    }

    .score-banner {
      background: ${result.isPassed ? '#f0fdf4' : '#fff1f2'};
      border: 2px solid ${result.isPassed ? '#86efac' : '#fecdd3'};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .score-pct {
      font-size: 32px;
      font-weight: 900;
      color: ${result.isPassed ? '#166534' : '#9f1239'};
    }

    .stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }

    .stats-table th, .stats-table td {
      border: 1px solid #e7e5e4;
      padding: 8px 12px;
      text-align: left;
      font-size: 11px;
    }

    .stats-table th {
      background: #fafaf9;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
    }

    .footer {
      border-top: 1px solid #e7e5e4;
      padding-top: 12px;
      text-align: center;
      font-size: 10px;
      color: #a8a29e;
      margin-top: 20px;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .card-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Top Control Bar -->
  <div class="no-print-bar">
    <div class="title">
      <span>📊</span>
      <span>Diagnostic Assessment Score Card</span>
    </div>
    <div class="actions">
      <button class="btn-print" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
      <button class="btn-close" onclick="window.close()">
        <span>Close Tab</span>
      </button>
    </div>
    <div class="tip-text">
      💡 Tip: In the destination dropdown of the print window, choose <strong>"Save as PDF"</strong> to save this document directly.
    </div>
  </div>

  <div class="card-container">
    <div class="header-bar">
      <div>
        <div class="badge-eval">Official Assessment Result</div>
        <h1 class="title-main">Competitive Exam Diagnostic Score Card</h1>
        <div style="font-size: 11px; color: #78716c;">Target Role: ${career.title} • Date: ${currentDate}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: 700; color: #78716c;">EVALUATION</div>
        <div style="font-size: 14px; font-weight: 800; color: ${result.isPassed ? '#166534' : '#b91c1c'};">
          ${result.isPassed ? '✓ PASSED & QUALIFIED' : '⚠ NEEDS RETEST'}
        </div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <span class="lbl">Candidate:</span>
        <span class="val">${profile.fullName || 'Candidate'}</span>
      </div>
      <div>
        <span class="lbl">Degree / Year:</span>
        <span class="val">${profile.degree || 'Degree'} (${profile.yearOfStudy || '3rd Year'})</span>
      </div>
      <div>
        <span class="lbl">Exam Format:</span>
        <span class="val">${result.markingScheme === 'competitive' ? 'Competitive (+4 / -1)' : 'Standard (+1 / 0)'}</span>
      </div>
      <div>
        <span class="lbl">Total Questions:</span>
        <span class="val">${result.totalQuestions} Questions</span>
      </div>
    </div>

    <div class="score-banner">
      <div>
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #78716c;">Final Score Percentage</div>
        <div class="score-pct">${result.scorePercentage}%</div>
        <div style="font-size: 11px; color: #44403c; margin-top: 4px;">${result.feedbackSummary}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: 700; color: #78716c; text-transform: uppercase;">Awarded Grade</div>
        <div style="font-size: 24px; font-weight: 900; color: #1c1917;">${result.grade.split(' ')[0]}</div>
      </div>
    </div>

    <table class="stats-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Raw Count</th>
          <th>Competitive Marks</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="color: #166534; font-weight: 700;">Correct Answers</td>
          <td>${result.correctCount} / ${result.totalQuestions}</td>
          <td>+${result.correctCount * (result.markingScheme === 'competitive' ? 4 : 1)} Marks</td>
          <td>Accurate knowledge demonstrated</td>
        </tr>
        <tr>
          <td style="color: #991b1b; font-weight: 700;">Incorrect Answers</td>
          <td>${result.incorrectCount} / ${result.totalQuestions}</td>
          <td>-${result.incorrectCount * (result.markingScheme === 'competitive' ? 1 : 0)} Marks</td>
          <td>Needs review in weak concepts</td>
        </tr>
        <tr>
          <td style="color: #854d0e; font-weight: 700;">Unattempted</td>
          <td>${result.unattemptedCount} / ${result.totalQuestions}</td>
          <td>0 Marks</td>
          <td>Skipped during assessment</td>
        </tr>
        <tr style="background: #fafaf9; font-weight: 800;">
          <td>Total Competitive Marks</td>
          <td>-</td>
          <td style="color: #ea580c; font-size: 13px;">${result.rawMarks} / ${result.totalQuestions * (result.markingScheme === 'competitive' ? 4 : 1)}</td>
          <td>Match Fit: ${result.updatedCareerFit}%</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      PathFinder AI Assessment System • TANCET/JEE Competitive Exam Standard • Verified Digital Score Card
    </div>
  </div>

  <script>
    // Automatically trigger system print dialog smoothly once rendered
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {
          console.error('Auto-print error:', e);
        }
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Opens a dedicated system print tab populated with the document and automatically triggers print.
 */
export function openPrintTabWithHtml(htmlContent: string): boolean {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    // Attempt direct window.open
    const printWindow = window.open(blobUrl, '_blank');
    
    if (printWindow) {
      printWindow.focus();
      return true;
    }

    // Fallback if popup blocker intercepted window.open
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    link.rel = 'noopener,noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error in openPrintTabWithHtml:', err);
    // Final fallback to native print
    window.print();
    return false;
  }
}

/**
 * Triggers real-time printing of Career Diagnostic Report by opening a dedicated print tab.
 */
export function triggerRealtimePrint(data: GenerateReportData): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const htmlContent = generateReportHtml(data);
      const success = openPrintTabWithHtml(htmlContent);
      resolve(success);
    } catch (err) {
      console.error('Error generating realtime print document:', err);
      window.print();
      resolve(false);
    }
  });
}

/**
 * Triggers printing of the exam score card by opening a dedicated print tab.
 */
export function triggerExamScorePrint(data: GenerateExamScoreData): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const htmlContent = generateExamScoreHtml(data);
      const success = openPrintTabWithHtml(htmlContent);
      resolve(success);
    } catch (err) {
      console.error('Error triggering exam score print:', err);
      window.print();
      resolve(false);
    }
  });
}

/**
 * Downloads the diagnostic report as a standalone printable HTML file.
 */
export function downloadReportHtml(data: GenerateReportData): void {
  const htmlContent = generateReportHtml(data);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const studentName = data.profile.fullName ? data.profile.fullName.replace(/\s+/g, '_') : 'Student';
  link.href = url;
  link.download = `PathFinder_Career_Report_${studentName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
