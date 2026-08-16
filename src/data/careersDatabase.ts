export interface CareerArchetype {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  salaryRange: string;
  averageStartingSalary: string;
  marketGrowth: string;
  workEnvironmentFit: string;
  requiredSkills: string[];
  careerOpportunities: string[];
  idealFeatures: {
    programming: number; // 1 to 5
    communication: number; // 1 to 5
    problemSolving: number; // 1 to 5
    mathematics: number; // 1 to 5
    creativity: number; // 1 to 5
    leadership: number; // 1 to 5
    minCgpa: number; // e.g., 6.5
  };
  preferredDomains: string[];
  preferredWorkTypes: string[];
  defaultSkillsToImprove: {
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    recommendedResource: string;
  }[];
  defaultRoadmap: {
    phaseName: string;
    timeframe: string;
    keyObjectives: string[];
    recommendedFreeToolsOrCerts: string[];
  }[];
}

export const CAREER_ARCHETYPES: CareerArchetype[] = [
  {
    id: 'software-developer',
    title: 'Software Developer',
    category: 'Engineering & Tech',
    icon: 'Code2',
    summary: 'Design, construct, test, and maintain robust software applications and system architectures for web, desktop, or enterprise platforms.',
    salaryRange: '₹6.5 LPA - ₹28 LPA ($85k - $165k)',
    averageStartingSalary: '₹7.2 LPA',
    marketGrowth: '+22% (Much faster than average)',
    workEnvironmentFit: 'Remote / Hybrid / High Flexibility',
    requiredSkills: [
      'Data Structures & Algorithms',
      'Object Oriented Programming',
      'Web Technologies (React/Node.js)',
      'Databases (SQL & NoSQL)',
      'Git Version Control & CI/CD',
    ],
    careerOpportunities: [
      'Frontend Engineer',
      'Backend Engineer',
      'Full Stack Developer',
      'System Software Engineer',
      'API Platform Engineer',
    ],
    idealFeatures: {
      programming: 4.8,
      problemSolving: 4.6,
      mathematics: 3.8,
      communication: 3.2,
      creativity: 3.5,
      leadership: 3.0,
      minCgpa: 7.0,
    },
    preferredDomains: ['Coding', 'Technology', 'AI & ML', 'Cloud & DevOps'],
    preferredWorkTypes: ['Problem Solving', 'Technical Work', 'Creative Work'],
    defaultSkillsToImprove: [
      {
        skill: 'Data Structures & Algorithms',
        priority: 'High',
        reason: 'Critical for clearing coding rounds in top tech companies and writing optimized code.',
        recommendedResource: 'LeetCode (Blind 75) & NeetCode Roadmap',
      },
      {
        skill: 'System Design & Architecture',
        priority: 'Medium',
        reason: 'Essential as you build scalable backends and distributed web systems.',
        recommendedResource: 'ByteByteGo System Design Primer',
      },
      {
        skill: 'Modern DevOps & Containerization (Docker)',
        priority: 'Medium',
        reason: 'Streamlines deployment and full stack development lifecycle.',
        recommendedResource: 'Docker Official Free Interactive Labs',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Core Foundation & DSA',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master one primary language (Java/Python/TypeScript) and OOP paradigms',
          'Solve 50+ DSA problems on arrays, hash maps, linked lists, and trees',
          'Build strong Git and command line fluency',
        ],
        recommendedFreeToolsOrCerts: ['CS50x by Harvard (edX)', 'freeCodeCamp JavaScript Algorithms'],
      },
      {
        phaseName: 'Phase 2: Full-Stack Web & API Development',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Build responsive React SPAs with state management and Tailwind CSS',
          'Create RESTful backend APIs with Node.js/Express or Python FastAPI',
          'Connect PostgreSQL/MongoDB databases with CRUD operations',
        ],
        recommendedFreeToolsOrCerts: ['The Odin Project Full Stack Path', 'Full Stack Open by Univ of Helsinki'],
      },
      {
        phaseName: 'Phase 3: Production Project & System Polish',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Deploy 2 production full-stack apps with user authentication & Docker',
          'Participate in open source contributions and mock technical interviews',
          'Prepare behavioral & STAR framework portfolio showcases',
        ],
        recommendedFreeToolsOrCerts: ['AWS Educate Cloud Free Badges', 'GitHub Campus Expert Resources'],
      },
    ],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    icon: 'BarChart3',
    summary: 'Transform complex multi-source datasets into actionable business intelligence, interactive visual dashboards, and strategic predictive insights.',
    salaryRange: '₹5.5 LPA - ₹20 LPA ($70k - $130k)',
    averageStartingSalary: '₹6.2 LPA',
    marketGrowth: '+25% (High Demand Across Industries)',
    workEnvironmentFit: 'Hybrid / Remote / High Cross-Functional',
    requiredSkills: [
      'Advanced SQL & Query Optimization',
      'Python / R for Data Manipulation',
      'Power BI / Tableau Dashboarding',
      'Exploratory Data Analysis (EDA)',
      'Business Statistics & Hypothesis Testing',
    ],
    careerOpportunities: [
      'Business Intelligence Analyst',
      'Product Data Analyst',
      'Financial Analytics Consultant',
      'Growth Marketing Analyst',
      'Operations Research Analyst',
    ],
    idealFeatures: {
      programming: 3.6,
      problemSolving: 4.5,
      mathematics: 4.4,
      communication: 4.0,
      creativity: 3.2,
      leadership: 3.0,
      minCgpa: 6.8,
    },
    preferredDomains: ['Data', 'Business', 'Technology', 'Coding'],
    preferredWorkTypes: ['Working with Data', 'Problem Solving', 'Working with People'],
    defaultSkillsToImprove: [
      {
        skill: 'Advanced SQL (Window Functions & CTEs)',
        priority: 'High',
        reason: 'Most interview tests strictly evaluate complex joins, window functions, and partitioning.',
        recommendedResource: 'Mode Analytics SQL Tutorial & SQLZoo',
      },
      {
        skill: 'Data Storytelling & Executive Visuals',
        priority: 'High',
        reason: 'Translating numbers into clear executive presentations makes or breaks analytics impact.',
        recommendedResource: 'Storytelling with Data (Cole Nussbaumer Knaflic)',
      },
      {
        skill: 'Pandas & Seaborn Python Libraries',
        priority: 'Medium',
        reason: 'Automates tabular data munging and exploratory visualization.',
        recommendedResource: 'Kaggle Learn: Python & Pandas Free Micro-courses',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: SQL & Data Foundations',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master relational database models, filtering, aggregations, and subqueries',
          'Understand core descriptive & inferential statistical measures',
          'Practice advanced Excel modeling (Pivot Tables, VLOOKUP/XLOOKUP)',
        ],
        recommendedFreeToolsOrCerts: ['Google Data Analytics Certificate (Audit)', 'StrataScratch SQL Practice'],
      },
      {
        phaseName: 'Phase 2: Python Analysis & BI Dashboards',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Wrangle messy datasets with Python Pandas, NumPy, and Matplotlib',
          'Design 3 end-to-end interactive dashboards on Power BI or Tableau Public',
          'Perform churn analysis and sales trend forecasting projects',
        ],
        recommendedFreeToolsOrCerts: ['Tableau for Students Free License', 'Microsoft Power BI Data Analyst (PL-300 prep)'],
      },
      {
        phaseName: 'Phase 3: Portfolio & Business Case Studies',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Publish 3 GitHub/Tableau case studies solving real e-commerce/fintech datasets',
          'Practice explaining complex metrics to non-technical stakeholders',
          'Simulate metric tree design and A/B test analysis in mock interviews',
        ],
        recommendedFreeToolsOrCerts: ['Kaggle Dataset Competitions', 'Maven Analytics Free Project Challenges'],
      },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Infrastructure',
    icon: 'ShieldCheck',
    summary: 'Safeguard enterprise networks, cloud assets, and confidential systems from malicious cyber attacks, breaches, and vulnerability exploits.',
    salaryRange: '₹6.0 LPA - ₹24 LPA ($80k - $155k)',
    averageStartingSalary: '₹6.8 LPA',
    marketGrowth: '+33% (Critical National & Global Shortage)',
    workEnvironmentFit: 'Hybrid / On-Site SOC / High Stability',
    requiredSkills: [
      'Network Security Protocols & Firewalls',
      'Vulnerability Assessment & Pen Testing',
      'SIEM Tools (Splunk / Wireshark)',
      'Incident Response & Forensics',
      'Security Compliance (ISO/NIST/OWASP)',
    ],
    careerOpportunities: [
      'SOC (Security Operations) Analyst',
      'Vulnerability Assessment Engineer',
      'Cloud Security Consultant',
      'Penetration Tester / Ethical Hacker',
      'Information Security Compliance Officer',
    ],
    idealFeatures: {
      programming: 3.5,
      problemSolving: 4.8,
      mathematics: 3.5,
      communication: 3.4,
      creativity: 3.6,
      leadership: 3.2,
      minCgpa: 6.8,
    },
    preferredDomains: ['Cybersecurity', 'Technology', 'Coding'],
    preferredWorkTypes: ['Problem Solving', 'Technical Work'],
    defaultSkillsToImprove: [
      {
        skill: 'Linux Command Line & Shell Scripting',
        priority: 'High',
        reason: 'Most server forensics, packet inspections, and SOC tooling run strictly on Linux systems.',
        recommendedResource: 'OverTheWire: Bandit Wargames & Linux Journey',
      },
      {
        skill: 'Packet Analysis with Wireshark',
        priority: 'High',
        reason: 'Vital for decoding network intrusion attempts and anomalous traffic spikes.',
        recommendedResource: 'Wireshark University Free Tutorials & TryHackMe',
      },
      {
        skill: 'OWASP Top 10 Web Vulnerabilities',
        priority: 'Medium',
        reason: 'Crucial for web application vulnerability assessment (SQLi, XSS, CSRF).',
        recommendedResource: 'PortSwigger Web Security Academy',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Networking & OS Hardening',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master OSI model, TCP/IP, DNS, VPNs, and subnetting calculations',
          'Learn Linux administration, permissions, and bash automation scripts',
          'Set up a home virtual security lab using VirtualBox/Kali Linux',
        ],
        recommendedFreeToolsOrCerts: ['Cisco Networking Basics (Skills for All)', 'CompTIA Security+ Blueprint (Professor Messer)'],
      },
      {
        phaseName: 'Phase 2: Hands-on Defenses & SOC Tools',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Analyze malicious traffic pcaps using Wireshark and Snort IDS rules',
          'Complete introductory SOC rooms on TryHackMe and Hack The Box',
          'Learn log monitoring and incident triage using Splunk Free Tier',
        ],
        recommendedFreeToolsOrCerts: ['TryHackMe Cyber Defense Path', 'Splunk Fundamentals 1 Free Training'],
      },
      {
        phaseName: 'Phase 3: Threat Hunting & Cert Readiness',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Document vulnerability assessment reports following NIST standards',
          'Practice CTF (Capture The Flag) challenges in cryptography and web security',
          'Prepare for entry-level certs like CompTIA Security+ or Certified in Cybersecurity (ISC2)',
        ],
        recommendedFreeToolsOrCerts: ['ISC2 Certified in Cybersecurity (1M Free Initiative)', 'Hack The Box Academy'],
      },
    ],
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Artificial Intelligence',
    icon: 'Cpu',
    summary: 'Develop, train, fine-tune, and deploy state-of-the-art machine learning models, LLMs, neural networks, and generative AI systems.',
    salaryRange: '₹8.0 LPA - ₹35 LPA ($110k - $210k)',
    averageStartingSalary: '₹8.5 LPA',
    marketGrowth: '+38% (Fastest Growing Global Domain)',
    workEnvironmentFit: 'Hybrid / Remote / High R&D Impact',
    requiredSkills: [
      'Python / PyTorch / TensorFlow',
      'Linear Algebra & Calculus',
      'Supervised & Unsupervised Learning',
      'Large Language Models (LLMs) & RAG',
      'MLOps & Model Deployment (FastAPI, Docker)',
    ],
    careerOpportunities: [
      'Machine Learning Engineer',
      'Computer Vision Specialist',
      'NLP / LLM Applications Engineer',
      'AI Research Scientist',
      'MLOps Infrastructure Engineer',
    ],
    idealFeatures: {
      programming: 4.7,
      problemSolving: 4.8,
      mathematics: 4.8,
      communication: 3.3,
      creativity: 4.0,
      leadership: 2.8,
      minCgpa: 7.5,
    },
    preferredDomains: ['AI & ML', 'Coding', 'Data', 'Technology'],
    preferredWorkTypes: ['Problem Solving', 'Technical Work', 'Working with Data'],
    defaultSkillsToImprove: [
      {
        skill: 'Mathematical Foundations (Calculus & Linear Algebra)',
        priority: 'High',
        reason: 'Essential for understanding gradient descent, backpropagation, and loss surfaces.',
        recommendedResource: '3Blue1Brown: Essence of Linear Algebra & Neural Networks',
      },
      {
        skill: 'Deep Learning Frameworks (PyTorch)',
        priority: 'High',
        reason: 'Industry standard framework for computer vision, NLP, and generative transformers.',
        recommendedResource: 'PyTorch Free Tutorials & Fast.ai Practical Deep Learning',
      },
      {
        skill: 'MLOps & Model Serving',
        priority: 'Medium',
        reason: 'Models in notebooks are useless unless served via high-performance APIs.',
        recommendedResource: 'Made With ML (Goku Mohandas) & MLflow docs',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Math, Python & Classical ML',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master NumPy, Pandas, Scikit-Learn, and scientific vectorization',
          'Implement regression, decision trees, random forests, and SVMs from scratch',
          'Master evaluation metrics: ROC-AUC, Precision, Recall, and Cross-Validation',
        ],
        recommendedFreeToolsOrCerts: ['Andrew Ng: Machine Learning Specialization (Audit)', 'Kaggle Micro-courses'],
      },
      {
        phaseName: 'Phase 2: Deep Learning & Modern PyTorch',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Build CNNs for image classification and RNNs/Transformers for NLP',
          'Learn transfer learning with Hugging Face Pre-trained Models',
          'Implement fine-tuning and Retrieval-Augmented Generation (RAG) pipelines',
        ],
        recommendedFreeToolsOrCerts: ['Hugging Face Deep Learning Course', 'DeepLearning.AI Short Courses'],
      },
      {
        phaseName: 'Phase 3: Production AI & Portfolio Capstone',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Package models into Docker containers served via FastAPI on Cloud',
          'Build a real-world GenAI/Computer Vision app with interactive UI',
          'Write technical write-ups and share benchmarks on GitHub & HuggingFace Spaces',
        ],
        recommendedFreeToolsOrCerts: ['Google Cloud AI Certification Prep', 'Kaggle Competitions Bronze/Silver badges'],
      },
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI / UX Product Designer',
    category: 'Design & Creative',
    icon: 'Palette',
    summary: 'Craft intuitive, accessible, and delightful digital user interfaces, design systems, interactive prototypes, and user journey workflows.',
    salaryRange: '₹5.5 LPA - ₹22 LPA ($75k - $140k)',
    averageStartingSalary: '₹6.0 LPA',
    marketGrowth: '+18% (Steady Growth in Product Ecosystems)',
    workEnvironmentFit: 'Remote / Hybrid / High Creative Freedom',
    requiredSkills: [
      'Figma & Design Systems',
      'User Research & Usability Testing',
      'Wireframing & High-Fidelity Prototyping',
      'Typography, Spacing & Color Theory',
      'Interaction Design & Micro-animations',
    ],
    careerOpportunities: [
      'Product Designer',
      'UI Designer',
      'UX Researcher',
      'Design System Architect',
      'Interaction Designer',
    ],
    idealFeatures: {
      creativity: 4.9,
      communication: 4.3,
      problemSolving: 4.0,
      programming: 2.2,
      mathematics: 2.0,
      leadership: 3.4,
      minCgpa: 6.0,
    },
    preferredDomains: ['Design', 'Technology', 'Marketing', 'Coding'],
    preferredWorkTypes: ['Creative Work', 'Problem Solving', 'Working with People'],
    defaultSkillsToImprove: [
      {
        skill: 'Figma Auto-Layout & Design Tokens',
        priority: 'High',
        reason: 'Crucial for modern engineering handoff and dynamic responsive web components.',
        recommendedResource: 'Figma Official YouTube & Config Deep Dives',
      },
      {
        skill: 'User Journey Mapping & Usability Testing',
        priority: 'High',
        reason: 'Validates UX hypotheses with real user behavior rather than pure aesthetic assumptions.',
        recommendedResource: 'Nielsen Norman Group Free UX Articles',
      },
      {
        skill: 'Basic HTML/CSS & Component Mental Models',
        priority: 'Medium',
        reason: 'Empowers you to design realistic interfaces that developers can build cleanly.',
        recommendedResource: 'Webflow University & Tailwind CSS Docs',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Design Fundamentals & Figma Mastery',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master visual hierarchy, typographic scales, spacing math, and WCAG accessibility',
          'Learn advanced Figma components, variants, auto-layout, and variables',
          'Replicate 10 world-class web and mobile interfaces pixel-for-pixel',
        ],
        recommendedFreeToolsOrCerts: ['Google UX Design Certificate (Coursera Audit)', 'Figma Academy Tutorials'],
      },
      {
        phaseName: 'Phase 2: UX Research & End-to-End Case Studies',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Conduct user interviews, create empathy maps, and define core personas',
          'Map complete user flows, information architecture, and interactive wireframes',
          'Test prototypes with 5 real users and iterate based on usability feedback',
        ],
        recommendedFreeToolsOrCerts: ['Laws of UX (Jon Yablonski)', 'Mobbin Design Inspiration Patterns'],
      },
      {
        phaseName: 'Phase 3: Design System & Portfolio Website',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Build a polished 2-3 case study portfolio highlighting business problems and outcomes',
          'Create a reusable mini design system with component documentation',
          'Practice live whiteboarding design challenges for tech company interviews',
        ],
        recommendedFreeToolsOrCerts: ['Bento.me / Framer Portfolio Showcase', 'Designercize Whiteboard Prompts'],
      },
    ],
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure & Cloud',
    icon: 'Cloud',
    summary: 'Architect scalable cloud infrastructure on AWS/GCP/Azure, automate CI/CD release pipelines, and ensure 99.99% system reliability and uptime.',
    salaryRange: '₹7.0 LPA - ₹30 LPA ($90k - $175k)',
    averageStartingSalary: '₹7.5 LPA',
    marketGrowth: '+28% (High Demand in SaaS & Cloud Transformation)',
    workEnvironmentFit: 'Remote / Hybrid / High Autonomy',
    requiredSkills: [
      'Cloud Platforms (AWS / GCP / Azure)',
      'Containerization (Docker & Kubernetes)',
      'Infrastructure as Code (Terraform)',
      'CI/CD Pipelines (GitHub Actions / Jenkins)',
      'Linux Administration & Bash/Python Scripting',
    ],
    careerOpportunities: [
      'Site Reliability Engineer (SRE)',
      'Cloud Infrastructure Architect',
      'DevOps Automation Engineer',
      'Platform Engineer',
      'Kubernetes Operations Specialist',
    ],
    idealFeatures: {
      programming: 4.2,
      problemSolving: 4.6,
      mathematics: 3.5,
      communication: 3.5,
      creativity: 3.0,
      leadership: 3.2,
      minCgpa: 6.8,
    },
    preferredDomains: ['Cloud & DevOps', 'Technology', 'Coding', 'Cybersecurity'],
    preferredWorkTypes: ['Technical Work', 'Problem Solving'],
    defaultSkillsToImprove: [
      {
        skill: 'Docker & Kubernetes Container Orchestration',
        priority: 'High',
        reason: 'The absolute bedrock of modern distributed cloud deployments.',
        recommendedResource: 'TechWorld with Nana YouTube & KodeKloud Free Basics',
      },
      {
        skill: 'Terraform (Infrastructure as Code)',
        priority: 'High',
        reason: 'Automates cloud provisioning with reproducible, audited code.',
        recommendedResource: 'HashiCorp Learn Tutorials',
      },
      {
        skill: 'CI/CD Automation (GitHub Actions)',
        priority: 'Medium',
        reason: 'Builds automated testing, linting, and container push workflows.',
        recommendedResource: 'GitHub Actions Official Quickstart',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Linux, Networking & Scripting',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master Linux server administration, SSH keys, cron jobs, and process management',
          'Understand DNS, HTTP/HTTPS, SSL certificates, load balancers, and VPCs',
          'Write Python and Bash scripts to automate daily operational tasks',
        ],
        recommendedFreeToolsOrCerts: ['Linux Foundation Free Intro', 'AWS Cloud Practitioner Essentials'],
      },
      {
        phaseName: 'Phase 2: Containers & Cloud Fundamentals',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Containerize multi-container web applications with Docker Compose',
          'Deploy compute instances, S3 storage, and relational DBs on AWS/GCP',
          'Build end-to-end automated deployment pipelines with GitHub Actions',
        ],
        recommendedFreeToolsOrCerts: ['AWS Free Tier Hands-on Labs', 'Docker Captains Free Tutorials'],
      },
      {
        phaseName: 'Phase 3: Kubernetes, Terraform & Observability',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Provision cloud VPCs and clusters using declarative Terraform code',
          'Deploy pods, services, and ingresses on local Minikube or managed K8s',
          'Set up Prometheus & Grafana monitoring dashboards for metrics & logs',
        ],
        recommendedFreeToolsOrCerts: ['Kubernetes Official Interactive Scenarios', 'Grafana Fundamentals Badges'],
      },
    ],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product & Strategy',
    icon: 'Briefcase',
    summary: 'Lead cross-functional teams of engineers, designers, and marketers to conceptualize, define, and ship impactful software products that solve real customer needs.',
    salaryRange: '₹8.0 LPA - ₹32 LPA ($95k - $180k)',
    averageStartingSalary: '₹8.0 LPA',
    marketGrowth: '+20% (High Leadership Value)',
    workEnvironmentFit: 'Hybrid / Office / High Collaboration',
    requiredSkills: [
      'Product Strategy & Vision',
      'User Research & Product Discovery',
      'Agile / Scrum Sprint Management',
      'Data Analytics & Metric Definition (AARRR, North Star)',
      'Cross-functional Leadership & Stakeholder Alignment',
    ],
    careerOpportunities: [
      'Associate Product Manager (APM)',
      'Technical Product Manager',
      'Growth Product Manager',
      'Product Operations Lead',
      'Startup Founder / Product Lead',
    ],
    idealFeatures: {
      leadership: 4.8,
      communication: 4.8,
      problemSolving: 4.4,
      creativity: 4.2,
      programming: 3.0,
      mathematics: 3.2,
      minCgpa: 7.0,
    },
    preferredDomains: ['Business', 'Technology', 'Design', 'Marketing', 'AI & ML'],
    preferredWorkTypes: ['Management', 'Working with People', 'Problem Solving', 'Creative Work'],
    defaultSkillsToImprove: [
      {
        skill: 'Writing PRDs (Product Requirement Documents)',
        priority: 'High',
        reason: 'The key communication artifact that specifies user stories, specs, and acceptance criteria.',
        recommendedResource: 'Reforge & Lenny’s Newsletter PM Templates',
      },
      {
        skill: 'Product Metrics & Cohort Analysis',
        priority: 'High',
        reason: 'Defining North Star metrics, tracking funnels, and calculating CAC/LTV.',
        recommendedResource: 'Amplitude Product Analytics Masterclass',
      },
      {
        skill: 'Tech-Fluent Communication',
        priority: 'Medium',
        reason: 'Gaining credibility with senior engineers by understanding system architectures.',
        recommendedResource: 'Technology for Product Managers (LinkedIn/YouTube)',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Product Sense & Discovery',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Deconstruct 5 successful apps (Swiggy, Spotify, Uber, Notion) and map their business models',
          'Conduct user problem interviews and formulate clear value proposition hypotheses',
          'Learn Jira, Notion, and Agile sprint planning methodologies',
        ],
        recommendedFreeToolsOrCerts: ['Product School Free Micro-Certifications', 'Inspired by Marty Cagan Book Study'],
      },
      {
        phaseName: 'Phase 2: Product Specs, Wireframes & Execution',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Write 3 detailed PRDs tackling real feature teardowns with measurable KPIs',
          'Design low-fidelity wireframes in Figma to communicate user flows',
          'Run A/B test experiments and analyze conversion funnel drop-offs',
        ],
        recommendedFreeToolsOrCerts: ['Google Project Management Certificate (Audit)', 'Mixpanel Free Certificate'],
      },
      {
        phaseName: 'Phase 3: APM Case Studies & Leadership Interviews',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Build an APM portfolio deck answering typical "Design X for Y" product questions',
          'Practice product design, strategy, and estimation questions in peer mocks',
          'Apply to structured Associate Product Manager (APM) cohorts and tech startups',
        ],
        recommendedFreeToolsOrCerts: ['StellarPeers Mock PM Communities', 'Exponent Free PM Interview Videos'],
      },
    ],
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    category: 'Engineering & Tech',
    icon: 'Smartphone',
    summary: 'Build high-performance, fluid, and engaging mobile applications for millions of iOS and Android users using modern native and cross-platform frameworks.',
    salaryRange: '₹6.0 LPA - ₹25 LPA ($80k - $150k)',
    averageStartingSalary: '₹6.8 LPA',
    marketGrowth: '+21% (Massive Consumer Smartphone Usage)',
    workEnvironmentFit: 'Remote / Hybrid / High Flexibility',
    requiredSkills: [
      'Flutter / React Native / Kotlin / Swift',
      'Mobile UI Architecture & State Management',
      'REST / GraphQL API Integration',
      'Local Storage (SQLite/Room/Hive)',
      'App Store & Play Store Deployment',
    ],
    careerOpportunities: [
      'Flutter Developer',
      'React Native Specialist',
      'Android Engineer (Kotlin)',
      'iOS Engineer (Swift/SwiftUI)',
      'Mobile Lead Architect',
    ],
    idealFeatures: {
      programming: 4.5,
      problemSolving: 4.2,
      creativity: 3.8,
      mathematics: 3.2,
      communication: 3.2,
      leadership: 2.8,
      minCgpa: 6.5,
    },
    preferredDomains: ['Coding', 'Technology', 'Design'],
    preferredWorkTypes: ['Technical Work', 'Creative Work', 'Problem Solving'],
    defaultSkillsToImprove: [
      {
        skill: 'Cross-Platform Framework (Flutter or React Native)',
        priority: 'High',
        reason: 'Most startups and fast-moving companies hire for unified single-codebase mobile apps.',
        recommendedResource: 'Flutter Official Codelabs & React Native Docs',
      },
      {
        skill: 'State Management (Riverpod / Redux / Bloc)',
        priority: 'High',
        reason: 'Required for complex app states, real-time sync, and offline persistence.',
        recommendedResource: 'Reso Coder Flutter Architecture Guides',
      },
      {
        skill: 'Mobile App Performance & Memory Profiling',
        priority: 'Medium',
        reason: 'Prevents frame drops, memory leaks, and battery drain in production builds.',
        recommendedResource: 'Android Studio / Xcode Profiler Docs',
      },
    ],
    defaultRoadmap: [
      {
        phaseName: 'Phase 1: Language & Mobile UI Basics',
        timeframe: 'Month 1 - 2',
        keyObjectives: [
          'Master Dart (for Flutter) or modern JavaScript/TypeScript (for React Native)',
          'Build responsive layouts with standard mobile widgets, navigation, and gestures',
          'Implement dark mode themes and responsive multi-device scaling',
        ],
        recommendedFreeToolsOrCerts: ['Google Flutter Apprenticeship', 'Meta React Native Specialization (Audit)'],
      },
      {
        phaseName: 'Phase 2: Networking, Local DB & Device APIs',
        timeframe: 'Month 3 - 4',
        keyObjectives: [
          'Integrate REST APIs with error handling, caching, and offline sync',
          'Access device hardware: Camera, Geolocation, Push Notifications, and Biometrics',
          'Implement local SQLite/Hive storage for offline-first user experience',
        ],
        recommendedFreeToolsOrCerts: ['Firebase for Mobile Codelabs', 'Android Basics with Compose'],
      },
      {
        phaseName: 'Phase 3: Production App Publishing & Portfolio',
        timeframe: 'Month 5 - 6',
        keyObjectives: [
          'Publish at least 1 functional application to Google Play Store / GitHub APK release',
          'Add in-app animations, haptic feedback, and automated unit/widget tests',
          'Showcase clean architecture (Clean Arch / MVVM) in your GitHub repository',
        ],
        recommendedFreeToolsOrCerts: ['Google Play Academy Badges', 'GitHub Mobile Starter Templates'],
      },
    ],
  },
];
