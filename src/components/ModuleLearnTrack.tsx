import React, { useState } from 'react';
import { CareerMatch, StudentProfile, SkillRatings, CuratedBook, LearningResourceItem } from '../types';
import { 
  BookOpen, GraduationCap, Award, ExternalLink, Star, CheckCircle2, 
  ArrowRight, ArrowLeft, Clock, Sparkles, Layers, Terminal, Compass, 
  ChevronDown, ChevronUp, Play, Check, ShieldCheck, Flame, BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleLearnTrackProps {
  career: CareerMatch;
  studentProfile: StudentProfile;
  skillRatings: SkillRatings;
  onProceedToExam: () => void;
  onBackToAnalysis: () => void;
}

interface StepDetail {
  id: string;
  stepNum: number;
  title: string;
  domain: string;
  whyImportant: string;
  whatToLearn: string[];
  progression: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  practiceTasks: string[];
  portfolioProjects: string[];
  recommendedBooks: CuratedBook[];
  freeResources: LearningResourceItem[];
  paidResources: LearningResourceItem[];
}

// Built-in mapped career learning progressions
const CAREER_LEARN_TRACKS: Record<string, { sequence: string[]; steps: StepDetail[] }> = {
  'software-developer': {
    sequence: ['1. Programming Fundamentals', '2. Python / Core Language', '3. Data Structures & Algorithms', '4. SQL & Database Design', '5. Modern Web Frameworks'],
    steps: [
      {
        id: 'sd-step-1',
        stepNum: 1,
        title: 'Programming Fundamentals & Logic',
        domain: 'Computer Science Core',
        whyImportant: 'Establishes mental models for control flow, modular programming, memory, and algorithmic thinking that apply to any language.',
        whatToLearn: [
          'Variables, types, memory allocation and pointer concepts',
          'Conditionals, iteration loops, and recursion',
          'Object-Oriented Programming (Classes, Inheritance, Polymorphism)',
          'Modular code organization, unit testing & debugging with breakpoints',
        ],
        progression: {
          beginner: 'Writing simple scripts, command-line calculators, and text parsers',
          intermediate: 'Building modular libraries with OOP, interfaces, and unit test suites',
          advanced: 'Optimizing bytecode execution, memory management, and asynchronous event loops',
        },
        practiceTasks: [
          'Implement a CLI todo manager with file I/O persistence',
          'Write a unit test suite using PyTest or Jest testing edge cases',
          'Solve 15 basic algorithmic puzzles on LeetCode / HackerRank',
        ],
        portfolioProjects: [
          'CLI Banking & Transaction Ledger with JSON/File storage',
          'Custom Markdown to HTML parser and AST generator',
        ],
        recommendedBooks: [
          {
            id: 'book-clean-code',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin (Uncle Bob)',
            rating: 4.7,
            pagesOrLength: '464 pages',
            level: 'Beginner',
            summary: 'The universal bible for writing maintainable, readable, and professional code.',
            keyTakeaways: ['Meaningful naming conventions', 'Functions must do one thing well', 'Unit testing TDD rules'],
            badge: 'Must Read',
          },
        ],
        freeResources: [
          {
            id: 'res-cs50',
            title: 'CS50x: Introduction to Computer Science',
            provider: 'Harvard University / edX',
            type: 'Interactive Course',
            pricing: 'Free',
            estimatedTime: '60 hours',
            skillLevel: 'Beginner',
            rating: 4.9,
            description: 'World-renowned entry into algorithms, data structures, C, Python, and SQL.',
            directUrl: 'https://cs50.harvard.edu/x/',
            tags: ['Harvard', 'CS Core', 'Algorithms'],
            keySkillsCovered: ['Memory', 'Pointers', 'Big-O', 'Data Structures'],
          },
        ],
        paidResources: [
          {
            id: 'res-algo-expert',
            title: 'AlgoExpert: Systems & Algorithms Track',
            provider: 'AlgoExpert.io',
            type: 'Interactive Course',
            pricing: 'Paid',
            estimatedTime: '80 hours',
            skillLevel: 'Intermediate',
            rating: 4.8,
            description: 'Hand-picked coding interview problems with video explanations and space-time breakdowns.',
            directUrl: 'https://www.algoexpert.io/',
            tags: ['Interview Prep', 'Algorithms', 'Data Structures'],
            keySkillsCovered: ['Two Pointers', 'Dynamic Programming', 'Graph Traversal'],
          },
        ],
      },
      {
        id: 'sd-step-2',
        stepNum: 2,
        title: 'Data Structures & Algorithms (DSA)',
        domain: 'Algorithmic Acuity',
        whyImportant: 'Core requirement for technical hiring rounds and building performant, scalable software with low latency.',
        whatToLearn: [
          'Arrays, Strings, Hash Tables, and Linked Lists',
          'Stacks, Queues, Heaps, and Priority Queues',
          'Trees (BST, AVL, Tries) and Graphs (BFS, DFS, Dijkstra)',
          'Algorithmic patterns: Sliding Window, Two Pointers, Dynamic Programming',
        ],
        progression: {
          beginner: 'Understanding Array operations, Hash Map lookups, and basic binary search',
          intermediate: 'Implementing Trees, Graphs, Heap sorting, and recursive backtracking',
          advanced: 'Dynamic Programming memoization/tabulation and complex graph algorithms',
        },
        practiceTasks: [
          'Solve the Blind 75 LeetCode curated question list',
          'Benchmark Hash Map collisions vs. Balanced Tree lookups in code',
          'Implement Trie-based prefix autocomplete engine from scratch',
        ],
        portfolioProjects: [
          'Graph Pathfinding Visualizer (Dijkstra, A* search, BFS)',
          'Custom In-Memory Key-Value Store with LRU Cache eviction',
        ],
        recommendedBooks: [
          {
            id: 'book-grokking-algo',
            title: 'Grokking Algorithms: An Illustrated Guide',
            author: 'Aditya Bhargava',
            rating: 4.8,
            pagesOrLength: '256 pages',
            level: 'Beginner',
            summary: 'Visual, high-retention breakdown of core algorithms and Big-O notation.',
            keyTakeaways: ['Visual Big-O intuition', 'Graph search & Dijkstra', 'Dynamic Programming fundamentals'],
            badge: 'Best Visual Guide',
          },
        ],
        freeResources: [
          {
            id: 'res-neetcode',
            title: 'NeetCode Roadmap & Algorithms Guide',
            provider: 'NeetCode.io',
            type: 'Hands-on Lab',
            pricing: 'Free',
            estimatedTime: '50 hours',
            skillLevel: 'Intermediate',
            rating: 4.9,
            description: 'Structured topic-wise visual roadmap of top coding interview patterns.',
            directUrl: 'https://neetcode.io/roadmap',
            tags: ['LeetCode', 'DSA', 'Interview Patterns'],
            keySkillsCovered: ['Sliding Window', 'Dynamic Programming', 'Trees & Graphs'],
          },
        ],
        paidResources: [
          {
            id: 'res-educative-grokking',
            title: 'Grokking the Coding Interview: Patterns for Coding Questions',
            provider: 'Educative.io',
            type: 'Interactive Course',
            pricing: 'Paid',
            estimatedTime: '40 hours',
            skillLevel: 'Intermediate',
            rating: 4.8,
            description: 'Interactive browser-based coding environments mapping 16 core coding patterns.',
            directUrl: 'https://www.educative.io/courses/grokking-the-coding-interview',
            tags: ['Pattern Based', 'Interactive', 'Interview Prep'],
            keySkillsCovered: ['Fast & Slow Pointers', 'Top K Elements', 'Subsets'],
          },
        ],
      },
      {
        id: 'sd-step-3',
        stepNum: 3,
        title: 'SQL, Databases & System Architecture',
        domain: 'Data Layer & System Design',
        whyImportant: 'Every real-world product requires persistent, ACID-compliant storage, indexing, and high-throughput API endpoints.',
        whatToLearn: [
          'Relational databases: PostgreSQL schema design, normalization, indexing',
          'NoSQL options: Document stores (MongoDB), Key-Value (Redis)',
          'RESTful API architecture, HTTP status codes, and JWT authentication',
          'System design basics: Load balancers, caching strategies, rate limiting',
        ],
        progression: {
          beginner: 'Writing basic SELECT, INSERT, UPDATE, JOIN, and GROUP BY queries',
          intermediate: 'Schema normalization, B-Tree index optimization, and transaction isolation',
          advanced: 'Database sharding, read replicas, distributed caching, and microservice APIs',
        },
        practiceTasks: [
          'Design an e-commerce database schema with order, user, and inventory tables',
          'Use EXPLAIN ANALYZE to optimize slow queries with composite indexes',
          'Build a Redis-backed API rate limiter in Node.js or Python',
        ],
        portfolioProjects: [
          'Full-Stack Collaborative Workspace with Postgres & Redis Caching',
          'High-Throughput URL Shortener with Analytics & Microsecond Redirects',
        ],
        recommendedBooks: [
          {
            id: 'book-ddia',
            title: 'Designing Data-Intensive Applications',
            author: 'Martin Kleppmann',
            rating: 4.9,
            pagesOrLength: '616 pages',
            level: 'Intermediate',
            summary: 'The definitive architectural guide to distributed systems, replication, partitioning, and consistency.',
            keyTakeaways: ['Storage engines & B-Trees', 'Replication lag & consensus', 'Batch vs Stream processing'],
            badge: 'Industry Bible',
          },
        ],
        freeResources: [
          {
            id: 'res-postgres-tutorial',
            title: 'PostgreSQL Official Documentation & Tutorial',
            provider: 'PostgreSQL Global Development Group',
            type: 'Documentation',
            pricing: 'Free',
            estimatedTime: '30 hours',
            skillLevel: 'Beginner',
            rating: 4.9,
            description: 'Comprehensive guide to enterprise relational database engineering.',
            directUrl: 'https://www.postgresql.org/docs/',
            tags: ['PostgreSQL', 'SQL', 'Indexes'],
            keySkillsCovered: ['ACID Transactions', 'EXPLAIN ANALYZE', 'Foreign Keys'],
          },
        ],
        paidResources: [
          {
            id: 'res-bytebytego',
            title: 'System Design Interview & Architecture Course',
            provider: 'ByteByteGo (Alex Xu)',
            type: 'Specialization',
            pricing: 'Paid',
            estimatedTime: '35 hours',
            skillLevel: 'Intermediate',
            rating: 4.9,
            description: 'Industry standard visual guides for designing real-world scalable architectures.',
            directUrl: 'https://bytebytego.com/',
            tags: ['System Design', 'Scale', 'Distributed Architecture'],
            keySkillsCovered: ['Load Balancers', 'Message Queues', 'Sharding'],
          },
        ],
      },
    ],
  },
  'data-analyst': {
    sequence: ['1. Advanced Excel & Sheets', '2. SQL for Analytics', '3. Business Statistics', '4. Python (Pandas/Numpy)', '5. BI Dashboards (Power BI / Tableau)'],
    steps: [
      {
        id: 'da-step-1',
        stepNum: 1,
        title: 'Modern Spreadsheets & Business Intelligence Modeling',
        domain: 'Data Wrangling',
        whyImportant: '90% of business reporting, quick financial modeling, and ad-hoc analysis happens in spreadsheets.',
        whatToLearn: [
          'Advanced formulas: XLOOKUP, INDEX-MATCH, SUMIFS, FILTER, UNIQUE',
          'Pivot Tables, Power Pivot, and calculated fields',
          'Data cleaning, text parsing, and conditional formatting rules',
          'Interactive scenario modeling and sensitivity tables',
        ],
        progression: {
          beginner: 'SUM, AVERAGE, basic VLOOKUP, and standard bar charts',
          intermediate: 'Multi-criteria dynamic array formulas and automated pivot dashboards',
          advanced: 'Power Query automated ETL flows and VBA/Apps Script automation',
        },
        practiceTasks: [
          'Clean a dirty 10,000-row customer sales export with Power Query',
          'Build an interactive 1-page executive KPI dashboard with slicers',
        ],
        portfolioProjects: [
          'Retail Sales Performance & Profit Margins Executive Dashboard',
          'Customer Churn Cohort Retention Analysis Matrix',
        ],
        recommendedBooks: [
          {
            id: 'book-storytelling-data',
            title: 'Storytelling with Data: A Data Visualization Guide',
            author: 'Cole Nussbaumer Knaflic',
            rating: 4.8,
            pagesOrLength: '288 pages',
            level: 'Beginner',
            summary: 'Master the art of eliminating chart clutter and communicating actionable insights.',
            keyTakeaways: ['Eliminating visual clutter', 'Decluttering chart axes', 'Focusing audience attention'],
            badge: 'Top BI Book',
          },
        ],
        freeResources: [
          {
            id: 'res-excel-chandoo',
            title: 'Chandoo.org Advanced Excel & Power BI Tutorials',
            provider: 'Chandoo.org',
            type: 'Video Series',
            pricing: 'Free',
            estimatedTime: '20 hours',
            skillLevel: 'Beginner',
            rating: 4.8,
            description: 'Hands-on practical tutorials for building corporate dashboard models.',
            directUrl: 'https://chandoo.org/wp/advanced-excel-skills/',
            tags: ['Excel', 'Dashboards', 'Formulas'],
            keySkillsCovered: ['XLOOKUP', 'Pivot Tables', 'Power Query'],
          },
        ],
        paidResources: [
          {
            id: 'res-maven-analytics',
            title: 'Maven Analytics: Microsoft Excel & Power BI Specialist',
            provider: 'Maven Analytics',
            type: 'Interactive Course',
            pricing: 'Paid',
            estimatedTime: '45 hours',
            skillLevel: 'Intermediate',
            rating: 4.9,
            description: 'Guided corporate analytics case studies with real dataset challenges.',
            directUrl: 'https://www.mavenanalytics.io/',
            tags: ['Case Studies', 'Power BI', 'Excel Pro'],
            keySkillsCovered: ['DAX', 'Star Schema', 'KPI Modeling'],
          },
        ],
      },
      {
        id: 'da-step-2',
        stepNum: 2,
        title: 'SQL for Data Analysis & Cohort Metrics',
        domain: 'Data Extraction',
        whyImportant: 'Allows direct querying of corporate data warehouses (Snowflake, BigQuery, Postgres) without relying on engineering.',
        whatToLearn: [
          'Complex multi-table JOINs, subqueries, and Common Table Expressions (WITH CTEs)',
          'Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD()',
          'Cohort analysis, month-over-month growth calculations, and retention curves',
          'Query optimization, indexing strategies, and date/time manipulation',
        ],
        progression: {
          beginner: 'Basic SELECT, WHERE, GROUP BY, and aggregate functions',
          intermediate: 'CTEs, Window functions, running totals, and conditional aggregations',
          advanced: 'Complex cohort retention matrices and database query tuning',
        },
        practiceTasks: [
          'Calculate 30-day rolling average revenue per active user',
          'Write a query computing customer repeat purchase time using LAG()',
        ],
        portfolioProjects: [
          'SaaS Product Metrics & Subscription Revenue Retention Cohort Analysis',
          'E-Commerce Fraud Detection & Anomaly Query Engine',
        ],
        recommendedBooks: [
          {
            id: 'book-sql-data-analysis',
            title: 'SQL for Data Analysis: Advanced Techniques for Transforming Data into Insights',
            author: 'Cathy Tanimura',
            rating: 4.8,
            pagesOrLength: '360 pages',
            level: 'Intermediate',
            summary: 'Focuses entirely on analytics use cases: cohort analysis, text analysis, and time series.',
            keyTakeaways: ['Cohort retention queries', 'Window functions in practice', 'Data transformation patterns'],
            badge: 'Essential for Analysts',
          },
        ],
        freeResources: [
          {
            id: 'res-mode-sql',
            title: 'Mode Analytics: Interactive SQL Tutorial',
            provider: 'Mode Analytics',
            type: 'Interactive Course',
            pricing: 'Free',
            estimatedTime: '25 hours',
            skillLevel: 'Beginner',
            rating: 4.9,
            description: 'The industry-favorite interactive SQL tutorial with real browser-based querying.',
            directUrl: 'https://mode.com/sql-tutorial/',
            tags: ['Interactive SQL', 'Window Functions', 'Analytics'],
            keySkillsCovered: ['CTEs', 'Window Functions', 'Aggregations'],
          },
        ],
        paidResources: [
          {
            id: 'res-datacamp-sql',
            title: 'DataCamp: SQL for Business & Data Analysis Career Track',
            provider: 'DataCamp',
            type: 'Interactive Course',
            pricing: 'Paid',
            estimatedTime: '30 hours',
            skillLevel: 'Intermediate',
            rating: 4.7,
            description: 'Hands-on practice tracking business revenue, churn, and marketing performance.',
            directUrl: 'https://www.datacamp.com/tracks/sql-for-business-analysts',
            tags: ['Interactive', 'Business SQL', 'Certification'],
            keySkillsCovered: ['DataCamp Cert', 'PostgreSQL', 'Business Metrics'],
          },
        ],
      },
    ],
  },
  'cybersecurity-analyst': {
    sequence: ['1. Networking & Protocols', '2. Linux System Administration', '3. Security Fundamentals & Cryptography', '4. Vulnerability Assessment', '5. Incident Response & SIEM'],
    steps: [
      {
        id: 'cs-step-1',
        stepNum: 1,
        title: 'Computer Networking & Network Defense',
        domain: 'Infrastructure Security',
        whyImportant: 'You cannot protect or secure network assets if you do not understand how packets flow across TCP/IP layers.',
        whatToLearn: [
          'OSI & TCP/IP models, packet encapsulation, and IP addressing / CIDR subnets',
          'Core protocols: TCP, UDP, DNS, DHCP, HTTP/HTTPS, SSH, TLS 1.3 handshake',
          'Network packet capture analysis with Wireshark and tcpdump',
          'Firewalls (iptables/pfSense), NAT, VPNs, and Network Intrusion Detection (Snort/Suricata)',
        ],
        progression: {
          beginner: 'Understanding ports, IP subnets, and standard client-server request flows',
          intermediate: 'Analyzing packet captures for cleartext credentials and DNS tunneling',
          advanced: 'Configuring IDS/IPS rules, proxy interception, and perimeter microsegmentation',
        },
        practiceTasks: [
          'Capture and inspect an unencrypted HTTP session and TLS handshake in Wireshark',
          'Configure a local virtual firewall with strict ingress/egress rules',
        ],
        portfolioProjects: [
          'Network Traffic Anomaly Monitor & Packet Inspection Toolkit',
          'Secure Multi-VLAN Home Lab Network with pfSense & Suricata IDS',
        ],
        recommendedBooks: [
          {
            id: 'book-tanenbaum-net',
            title: 'Computer Networks (6th Edition)',
            author: 'Andrew S. Tanenbaum & David J. Wetherall',
            rating: 4.8,
            pagesOrLength: '944 pages',
            level: 'Beginner',
            summary: 'The ultimate computer science textbook on network architecture and protocols.',
            keyTakeaways: ['Protocol layer mechanics', 'Transport layer flow control', 'Routing algorithms'],
            badge: 'Academic Gold Standard',
          },
        ],
        freeResources: [
          {
            id: 'res-prof-messer',
            title: 'Professor Messer: CompTIA Security+ & Network+ Video Series',
            provider: 'Professor Messer / YouTube',
            type: 'Video Series',
            pricing: 'Free',
            estimatedTime: '40 hours',
            skillLevel: 'Beginner',
            rating: 4.9,
            description: 'Free comprehensive video courses aligned with industry certification standards.',
            directUrl: 'https://www.professormesser.com/',
            tags: ['CompTIA', 'Security+', 'Network+'],
            keySkillsCovered: ['Protocols', 'Firewalls', 'Threat Actors'],
          },
        ],
        paidResources: [
          {
            id: 'res-tryhackme',
            title: 'TryHackMe: Pre-Security & SOC Level 1 Career Path',
            provider: 'TryHackMe.com',
            type: 'Hands-on Lab',
            pricing: 'Paid',
            estimatedTime: '60 hours',
            skillLevel: 'Beginner',
            rating: 4.9,
            description: 'Hands-on virtual browser-based hacking and defense sandbox rooms.',
            directUrl: 'https://tryhackme.com/path/outline/soclevel1',
            tags: ['Hands-on', 'SOC Analyst', 'Sandbox'],
            keySkillsCovered: ['Wireshark', 'Splunk', 'Linux Security'],
          },
        ],
      },
    ],
  },
};

export const ModuleLearnTrack: React.FC<ModuleLearnTrackProps> = ({
  career,
  studentProfile,
  skillRatings,
  onProceedToExam,
  onBackToAnalysis,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Fallback to software developer if specific track not defined
  const trackData = CAREER_LEARN_TRACKS[career.id] || CAREER_LEARN_TRACKS['software-developer'];
  const steps = trackData.steps;
  const currentStep = steps[activeStepIndex] || steps[0];

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Personalized Learning Track
              </span>
              <span className="text-xs text-stone-400">
                Curated for {studentProfile.fullName || 'Student'} • {career.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              🚀 Career Skill Roadmap: {career.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Follow this step-by-step master progression. Every topic includes what to learn, progression milestones, curated books, and verified FREE & PAID resources.
            </p>
          </div>

          {/* Quick Action Button to Exam */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              id="start-mcq-exam-btn"
              onClick={onProceedToExam}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Take Skill MCQ Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Sequence Pills */}
        <div className="mt-6 pt-5 border-t border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
          {trackData.sequence.map((seq, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 font-semibold border border-stone-700">
                {seq}
              </span>
              {idx < trackData.sequence.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress & Step Navigation Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = !!completedSteps[step.id];

          return (
            <button
              key={step.id}
              id={`learn-step-tab-${idx + 1}`}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                isActive
                  ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/10'
                  : 'bg-stone-50/70 border-stone-200 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                isDone
                  ? 'bg-emerald-600 text-white'
                  : isActive
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider truncate">
                    {step.domain}
                  </span>
                  {isDone && <span className="text-[10px] font-bold text-emerald-600">Done</span>}
                </div>
                <h3 className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${isActive ? 'text-stone-900' : 'text-stone-700'}`}>
                  {step.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Content Body */}
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        
        {/* Module Header Card */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
                  Step {currentStep.stepNum} of {steps.length}
                </span>
                <span className="text-xs font-semibold text-stone-500">{currentStep.domain}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {currentStep.title}
              </h2>
            </div>

            <button
              id={`mark-complete-btn-${currentStep.stepNum}`}
              onClick={() => toggleStepCompleted(currentStep.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                completedSteps[currentStep.id]
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{completedSteps[currentStep.id] ? 'Marked Complete' : 'Mark Step as Studied'}</span>
            </button>
          </div>

          {/* Why This is Important */}
          <div className="mt-4 p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Why This is Critical for {career.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              {currentStep.whyImportant}
            </p>
          </div>

          {/* What to Learn Checklist */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Key Concepts & Syllabus Topics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentStep.whatToLearn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                  <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Beginner -> Intermediate -> Advanced Progression */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Beginner → Intermediate → Advanced Skill Progression
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
                  1. Beginner Phase
                </span>
                <p className="text-stone-700 mt-2 leading-relaxed">{currentStep.progression.beginner}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
                  2. Intermediate Phase
                </span>
                <p className="text-stone-700 mt-2 leading-relaxed">{currentStep.progression.intermediate}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                  3. Advanced / Industry
                </span>
                <p className="text-stone-700 mt-2 leading-relaxed">{currentStep.progression.advanced}</p>
              </div>
            </div>
          </div>

          {/* Practice Activities & Portfolio Projects */}
          <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                <Terminal className="w-3.5 h-3.5 text-stone-700" />
                <span>Hands-on Practice Activities</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {currentStep.practiceTasks.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Recommended Portfolio Projects</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {currentStep.portfolioProjects.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Curated Books & Real Resources for this Step */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Curated Books & Verified Learning Resources for this Step
            </h3>
          </div>

          {/* Books */}
          {currentStep.recommendedBooks && currentStep.recommendedBooks.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Foundational Books</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.recommendedBooks.map((book) => (
                  <div key={book.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                          {book.badge || 'Recommended'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{book.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">{book.title}</h4>
                      <span className="text-[11px] text-stone-500">By {book.author} • {book.pagesOrLength}</span>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">{book.summary}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 font-medium">Level: <span className="font-bold text-stone-800">{book.level}</span></span>
                      <span className="text-orange-600 font-bold">Curated Reading</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free & Paid Resources */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Free Platforms & Paid Certifications</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Free Resource */}
              {currentStep.freeResources.map((res) => (
                <div key={res.id} className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        FREE
                      </span>
                      <span className="text-xs font-semibold text-stone-600">{res.provider}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{res.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">⏱️ {res.estimatedTime}</span>
                    <a
                      href={res.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}

              {/* Paid Resource */}
              {currentStep.paidResources.map((res) => (
                <div key={res.id} className="p-4 rounded-2xl bg-orange-50/30 border border-orange-200/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300">
                        PAID / CERT
                      </span>
                      <span className="text-xs font-semibold text-stone-600">{res.provider}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{res.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">⏱️ {res.estimatedTime}</span>
                    <a
                      href={res.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-800"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Exam Call to Action */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              id="learn-prev-btn"
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <button
              id="learn-next-btn"
              disabled={activeStepIndex === steps.length - 1}
              onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="proceed-to-exam-btn"
            onClick={onProceedToExam}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Proceed to Skill-Based MCQ Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
